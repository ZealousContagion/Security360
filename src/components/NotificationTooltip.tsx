'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Clock } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import Link from 'next/link';
import { markAsRead, markAllAsRead } from '@/app/admin/notifications/actions';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export function NotificationTooltip() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const unreadCount = notifications.filter(n => !n.read).length;

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.slice(0, 5)); // Just show latest 5
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = async () => {
        setLoading(true);
        await markAllAsRead();
        await fetchNotifications();
        setLoading(false);
    };

    const handleMarkRead = async (id: string) => {
        await markAsRead(id);
        await fetchNotifications();
    };

    return (
        <div className="relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-primary relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                )}
            </Button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-black/5 shadow-2xl rounded-lg z-50 overflow-hidden">
                        <div className="p-4 border-b border-dashed flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    onClick={handleMarkAllRead}
                                    disabled={loading}
                                    className="text-[8px] font-bold uppercase text-primary hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[350px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-8 h-8 text-muted/20 mx-auto" />
                                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-2">No notifications</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        className={`p-4 border-b border-dashed border-black/5 last:border-0 hover:bg-accent/30 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-tight">{n.title}</p>
                                                <p className="text-[10px] text-muted-foreground leading-tight">{n.message}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                                                    <span className="text-[8px] uppercase font-bold text-muted-foreground">
                                                        {new Date(n.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            {!n.read && (
                                                <button 
                                                    onClick={() => handleMarkRead(n.id)}
                                                    className="p-1 hover:bg-white rounded border border-black/5"
                                                >
                                                    <Check className="w-3 h-3 text-green-600" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Link 
                            href="/admin/notifications" 
                            onClick={() => setIsOpen(false)}
                            className="p-3 border-t bg-accent/10 flex items-center justify-center gap-2 hover:bg-accent/20 transition-colors"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">View all activity</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
