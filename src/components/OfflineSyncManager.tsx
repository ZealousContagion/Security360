'use client';

import { useEffect, useState } from 'react';
import { getQueuedActions, removeAction, SyncAction } from '@/lib/offline-storage';
import { Wifi, WifiOff, Loader2, CheckCircle2 } from 'lucide-react';

export function OfflineSyncManager() {
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const checkQueue = async () => {
        const queue = await getQueuedActions();
        setPendingCount(queue.length);
        return queue;
    };

    const processQueue = async () => {
        if (!navigator.onLine) return;
        
        const queue = await checkQueue();
        if (queue.length === 0) return;

        setIsSyncing(true);
        console.log(`[OfflineSync] Processing ${queue.length} actions...`);

        for (const action of queue) {
            try {
                if (action.type === 'PHOTO_UPLOAD') {
                    const formData = new FormData();
                    formData.append('file', action.data);
                    
                    const res = await fetch(`/api/field/jobs/${action.jobId}/photos`, {
                        method: 'POST',
                        body: formData
                    });

                    if (res.ok) {
                        await removeAction(action.id!);
                    }
                }
                // Add more types here (e.g., JOB_COMPLETE)
            } catch (err) {
                console.error('[OfflineSync] Failed to process action:', err);
                break; // Stop processing if we hit a network error
            }
        }

        await checkQueue();
        setIsSyncing(false);
    };

    useEffect(() => {
        setIsOnline(navigator.onLine);
        checkQueue();

        const handleOnline = () => {
            setIsOnline(true);
            processQueue();
        };
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Periodic check every 30s
        const interval = setInterval(processQueue, 30000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    if (isOnline && pendingCount === 0 && !isSyncing) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right duration-500">
            <div className={`p-4 rounded-2xl shadow-2xl flex items-center gap-4 border ${isOnline ? 'bg-black text-white border-white/10' : 'bg-destructive text-white border-none'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOnline ? 'bg-primary text-black' : 'bg-white/20'}`}>
                    {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                     isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                        {isOnline ? (isSyncing ? 'Syncing Data...' : 'System Online') : 'Working Offline'}
                    </p>
                    <p className="text-[9px] font-bold opacity-70 uppercase mt-1 tracking-tighter">
                        {pendingCount > 0 ? `${pendingCount} actions in queue` : 'All changes synced'}
                    </p>
                </div>
                {isOnline && pendingCount === 0 && !isSyncing && (
                    <CheckCircle2 className="w-4 h-4 text-primary ml-2" />
                )}
            </div>
        </div>
    );
}
