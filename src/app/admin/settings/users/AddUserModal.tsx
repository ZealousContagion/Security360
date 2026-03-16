'use client';

import React, { useState } from 'react';
import { createUser } from './actions';
import { Role } from '@/lib/rbac';
import { Loader2, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function AddUserModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'USER' as Role
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await createUser(formData);
            if (res.success) {
                setIsOpen(false);
                setFormData({ name: '', email: '', username: '', password: '', role: 'USER' });
            } else {
                alert(res.error);
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button 
                onClick={() => setIsOpen(true)}
                className="bg-black text-white hover:bg-black/80 uppercase text-[10px] tracking-widest font-black h-9 px-4 flex items-center gap-2"
            >
                <UserPlus className="w-3.5 h-3.5" />
                Provision New User
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                <div className="p-6 border-b flex items-center justify-between bg-accent/30">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em]">New System User</h2>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold mt-1 tracking-wider">Configure baseline access credentials</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-black">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                            <Input 
                                required
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="E.G. TAFADZWA MUTANGADURA"
                                className="uppercase text-xs font-bold h-11 tracking-tight bg-accent/20 border-none focus:ring-1 ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                            <Input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                placeholder="USER@SECURITY360.CO.ZW"
                                className="uppercase text-xs font-bold h-11 tracking-tight bg-accent/20 border-none focus:ring-1 ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                            <Input 
                                required
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
                                placeholder="USERNAME"
                                className="lowercase text-xs font-bold h-11 tracking-tight bg-accent/20 border-none focus:ring-1 ring-primary"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Initial Password</label>
                            <Input 
                                required
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({...formData, password: e.target.value})}
                                placeholder="••••••••"
                                className="text-xs font-bold h-11 tracking-tight bg-accent/20 border-none focus:ring-1 ring-primary"
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

                    <div className="pt-4 flex gap-3">
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
                            className="flex-1 bg-primary text-black hover:bg-primary/90 uppercase text-[10px] font-black tracking-widest h-11 shadow-lg shadow-primary/20"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Provisioning'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
