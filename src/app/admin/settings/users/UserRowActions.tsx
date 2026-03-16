'use client';

import React, { useState } from 'react';
import { toggleUserStatus } from './actions';
import { Role } from '@/lib/rbac';
import { Loader2, Power } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditUserModal } from './EditUserModal';

interface UserRowActionsProps {
    userId: string;
    userName: string;
    userEmail: string;
    currentRole: Role;
    isActive: boolean;
}

export function UserRowActions({ userId, userName, userEmail, currentRole, isActive }: UserRowActionsProps) {
    const [loading, setLoading] = useState(false);

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
        <div className="flex items-center justify-end gap-2">
            <EditUserModal user={{ id: userId, name: userName, email: userEmail, role: currentRole }} />

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
