'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Camera, X, Loader2, Check } from 'lucide-react';

export function PhotoUpload({ jobId }: { jobId: string }) {
    const [uploading, setUploading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);

    const handleSimulateUpload = () => {
        setUploading(true);
        // Simulate network delay
        setTimeout(() => {
            const mockPhotoUrl = `https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=200&h=200`;
            setPhotos([...photos, mockPhotoUrl]);
            setUploading(false);
        }, 1500);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {photos.map((p, i) => (
                    <div key={i} className="relative w-16 h-16 rounded border overflow-hidden group">
                        <img src={p} alt="Site" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                
                <button 
                    onClick={handleSimulateUpload}
                    disabled={uploading}
                    className="w-16 h-16 border-2 border-dashed border-muted rounded flex flex-col items-center justify-center hover:border-primary transition-colors text-muted-foreground hover:text-primary"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                    <span className="text-[8px] font-bold mt-1 uppercase">Add</span>
                </button>
            </div>
            
            {photos.length > 0 && (
                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-green-600 tracking-widest animate-in fade-in slide-in-from-left-2">
                    <Check className="w-3 h-3" />
                    {photos.length} Photo(s) ready for submission
                </div>
            )}
        </div>
    );
}
