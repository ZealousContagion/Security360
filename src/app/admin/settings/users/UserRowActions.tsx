'use client';

import React, { useState } from 'react';
import { updateUserRole, toggleUserStatus } from './actions';
import { Role } from '@/lib/rbac';
import { Loader2, Power, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UserRowActionsProps {
    userId: string;
    currentRole: Role;
    isActive: boolean;
}

export function UserRowActions({ userId, currentRole, isActive }: UserRowActionsProps) {
    const [loading, setLoading] = useState(false);

    const handleRoleChange = async (newRole: Role) => {
        if (newRole === currentRole) return;
        setLoading(true);
        try {
            const res = await updateUserRole(userId, newRole);
            if (!res.success) alert(res.error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!confirm(`Are you sure you want to ${isActive ? 'disable' : 'enable'} this user?`)) return;
        setLoading(true);
        try {
            const res = await toggleUserStatus(userId, isActive);
            if (!res.success) alert(res.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-3">
            <select 
                disabled={loading}
                value={currentRole}
                onChange={(e) => handleRoleChange(e.target.value as Role)}
                className="text-[10px] font-bold uppercase bg-accent/50 border-none rounded px-2 py-1 outline-none focus:ring-1 ring-primary"
            >
                <option value="USER">User</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
            </select>

            <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleToggleStatus}
                disabled={loading}
                className={`h-8 w-8 ${isActive ? 'text-green-600 hover:bg-green-50' : 'text-destructive hover:bg-destructive/5'}`}
                title={isActive ? "Disable User" : "Enable User"}
            >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
            </Button>
        </div>
    );
}
