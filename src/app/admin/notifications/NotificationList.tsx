'use client';

import React, { useState, useTransition } from 'react';
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Bell, Info, AlertTriangle, CheckCircle, Trash2, Check, Loader2 } from "lucide-react";
import { markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } from "./actions";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: Date | string;
}

export function NotificationList({ initialNotifications }: { initialNotifications: Notification[] }) {
    const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
    const [isPending, startTransition] = useTransition();

    const filtered = initialNotifications.filter(n => {
        if (filter === 'UNREAD') return !n.read;
        return true;
    });

    const unreadCount = initialNotifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        startTransition(async () => {
            await markAsRead(id);
        });
    };

    const handleMarkAllRead = () => {
        if (unreadCount === 0) return;
        startTransition(async () => {
            await markAllAsRead();
        });
    };

    const handleDelete = (id: string) => {
        startTransition(async () => {
            await deleteNotification(id);
        });
    };

    const handleClearAll = () => {
        if (!confirm('Permanently clear all notifications?')) return;
        startTransition(async () => {
            await clearAllNotifications();
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border rounded-xl shadow-sm">
                <div className="flex bg-accent/30 p-1 rounded-lg">
                    <button 
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-white shadow text-black' : 'text-muted-foreground hover:text-black'}`}
                    >
                        All Activity
                    </button>
                    <button 
                        onClick={() => setFilter('UNREAD')}
                        className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all relative ${filter === 'UNREAD' ? 'bg-white shadow text-black' : 'text-muted-foreground hover:text-black'}`}
                    >
                        Unread
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[8px] flex items-center justify-center rounded-full font-black">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleMarkAllRead}
                        disabled={unreadCount === 0 || isPending}
                        className="text-[9px] uppercase tracking-widest font-bold"
                    >
                        <Check className="w-3 h-3 mr-2" />
                        Mark all as read
                    </Button>
                    <div className="h-4 w-[1px] bg-border mx-1" />
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClearAll}
                        disabled={initialNotifications.length === 0 || isPending}
                        className="text-[9px] uppercase tracking-widest font-bold text-destructive hover:bg-destructive/5"
                    >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Clear All
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden">
                <CardContent className="divide-y p-0">
                    {filtered.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center opacity-20">
                                <Bell className="w-6 h-6" />
                            </div>
                            <p className="uppercase text-[10px] tracking-[0.3em] font-black text-muted-foreground">
                                No {filter === 'UNREAD' ? 'unread' : ''} notifications
                            </p>
                        </div>
                    ) : filtered.map((n) => (
                        <div key={n.id} className={`flex gap-4 p-6 transition-all group relative ${!n.read ? 'bg-primary/[0.02]' : 'hover:bg-accent/30'}`}>
                            {!n.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                            )}
                            
                            <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                                ${n.type === 'ALERT' ? 'bg-primary text-black' : 
                                  n.type === 'SUCCESS' ? 'bg-green-500 text-white' : 
                                  n.type === 'WARNING' ? 'bg-amber-500 text-white' : 
                                  'bg-slate-800 text-white'}`}>
                                {n.type === 'ALERT' ? <Bell className="w-5 h-5" /> :
                                 n.type === 'SUCCESS' ? <CheckCircle className="w-5 h-5" /> :
                                 n.type === 'WARNING' ? <AlertTriangle className="w-5 h-5" /> :
                                 <Info className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`font-black uppercase text-xs tracking-tight ${!n.read ? 'text-black' : 'text-muted-foreground'}`}>
                                            {n.title}
                                        </h4>
                                        {!n.read && (
                                            <Badge className="bg-primary text-black text-[7px] font-black border-none px-1 h-3 animate-pulse">NEW</Badge>
                                        )}
                                    </div>
                                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">
                                        {new Date(n.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className={`text-xs leading-relaxed ${!n.read ? 'text-slate-900 font-medium' : 'text-muted-foreground'}`}>
                                    {n.message}
                                </p>
                                
                                <div className="pt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    {!n.read && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => handleMarkAsRead(n.id)}
                                            className="h-7 text-[8px] uppercase font-black tracking-[0.2em] border-primary/20 hover:bg-primary hover:text-black"
                                        >
                                            Mark as read
                                        </Button>
                                    )}
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleDelete(n.id)}
                                        className="h-7 text-[8px] uppercase font-black tracking-[0.2em] text-destructive hover:bg-destructive/10"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {initialNotifications.length > 50 && (
                <div className="flex justify-center">
                    <Button variant="outline" className="text-[10px] uppercase tracking-[0.2em] font-black h-12 px-12 border-black/5 hover:bg-black hover:text-white transition-all">
                        Load History
                    </Button>
                </div>
            )}
        </div>
    );
}
