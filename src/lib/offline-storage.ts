/**
 * Offline Storage Utility
 * Manages an IndexedDB queue for actions performed while offline.
 */

const DB_NAME = 'S360_Offline_DB';
const STORE_NAME = 'sync_queue';
const DB_VERSION = 1;

export interface SyncAction {
    id?: number;
    type: 'PHOTO_UPLOAD' | 'JOB_COMPLETE';
    jobId: string;
    data: any; // Blob for photos, or other metadata
    timestamp: number;
}

export function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function queueAction(action: Omit<SyncAction, 'id' | 'timestamp'>) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise<void>((resolve, reject) => {
        const request = store.add({
            ...action,
            timestamp: Date.now()
        });
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export async function getQueuedActions(): Promise<SyncAction[]> {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function removeAction(id: number) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}
