'use client';

import React, { useState } from 'react';
import { editUser, deleteUser } from './actions';
import { Role } from '@/lib/rbac';
import { Loader2, UserCog, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface EditUserModalProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
    };
}

export function EditUserModal({ user }: EditUserModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        role: user.role
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await editUser(user.id, formData);
            if (res.success) {
                setIsOpen(false);
            } else {
                alert(res.error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to PERMANENTLY delete ${user.email}? This will also remove them from Clerk auth.`)) return;
        setLoading(true);
        try {
            const res = await deleteUser(user.id);
            if (!res.success) alert(res.error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(true)}
                className="h-8 w-8 text-muted-foreground hover:text-black hover:bg-accent/50"
                title="Edit User"
            >
                <UserCog className="w-3.5 h-3.5" />
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-left">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <div className="p-6 border-b flex items-center justify-between bg-accent/30">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Edit Profile</h2>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1 tracking-wider">{user.email}</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-black">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                            <Input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="uppercase text-xs font-bold h-11 tracking-tight bg-accent/20 border-none focus:ring-1 ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Tier</label>
                            <select 
                                value={formData.role}
                                onChange={e => setFormData({...formData, role: e.target.value as Role})}
                                className="w-full h-11 px-3 bg-accent/20 border-none rounded-md text-xs font-bold uppercase outline-none focus:ring-1 ring-primary"
                            >
                                <option value="USER">Standard Operator (USER)</option>
                                <option value="MANAGER">Operational Manager (MANAGER)</option>
                                <option value="ADMIN">System Administrator (ADMIN)</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <div className="flex gap-3">
                            <Button 
                                type="button" 
                                variant="ghost" 
                                onClick={() => setIsOpen(false)}
                                className="flex-1 uppercase text-[10px] font-black tracking-widest h-11"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 bg-black text-white hover:bg-black/90 uppercase text-[10px] font-black tracking-widest h-11 shadow-lg"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                            </Button>
                        </div>
                        
                        <Button 
                            type="button" 
                            variant="ghost"
                            disabled={loading}
                            onClick={handleDelete}
                            className="w-full text-destructive hover:bg-destructive/5 uppercase text-[10px] font-black tracking-widest h-10 flex items-center gap-2"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Purge Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
