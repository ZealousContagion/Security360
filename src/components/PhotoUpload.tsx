'use client';

import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { Camera, X, Loader2, Check, WifiOff } from 'lucide-react';
import { queueAction } from '@/lib/offline-storage';

export function PhotoUpload({ jobId }: { jobId: string }) {
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState<{ url: string, isOffline?: boolean }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        // 1. Create a local preview
        const localUrl = URL.createObjectURL(file);

        if (!navigator.onLine) {
            // 2. Offline Mode: Queue for later
            try {
                await queueAction({
                    type: 'PHOTO_UPLOAD',
                    jobId,
                    data: file // IndexedDB can store Blobs
                });
                setPhotos([...photos, { url: localUrl, isOffline: true }]);
                alert("Working Offline: Photo saved locally and will sync when connection returns.");
            } catch (err) {
                console.error("Failed to queue photo:", err);
            } finally {
                setUploading(false);
            }
            return;
        }

        // 3. Online Mode: Try immediate upload
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`/api/field/jobs/${jobId}/photos`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setPhotos([...photos, { url: data.url }]);
            } else {
                throw new Error("Upload failed");
            }
        } catch (err) {
            // Fallback to offline queue if upload fails even if "online"
            await queueAction({ type: 'PHOTO_UPLOAD', jobId, data: file });
            setPhotos([...photos, { url: localUrl, isOffline: true }]);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            
            <div className="flex flex-wrap gap-2">
                {photos.map((p, i) => (
                    <div key={i} className="relative w-16 h-16 rounded border overflow-hidden group">
                        <img src={p.url} alt="Site" className="w-full h-full object-cover" />
                        {p.isOffline && (
                            <div className="absolute top-0 right-0 bg-amber-500 p-0.5 rounded-bl shadow-sm">
                                <WifiOff className="w-2 h-2 text-white" />
                            </div>
                        )}
                        <button 
                            onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-16 h-16 border-2 border-dashed border-muted rounded flex flex-col items-center justify-center hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    <span className="text-[8px] font-bold mt-1 uppercase">
                        {navigator.onLine ? 'Upload' : 'Capture'}
                    </span>
                </button>
            </div>
            
            {photos.length > 0 && (
                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-green-600 tracking-widest animate-in fade-in slide-in-from-left-2">
                    <Check className="w-3 h-3" />
                    {photos.length} Photo(s) {photos.some(p => p.isOffline) ? 'queued for sync' : 'uploaded'}
                </div>
            )}
        </div>
    );
}