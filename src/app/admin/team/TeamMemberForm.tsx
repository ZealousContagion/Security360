'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2, Save } from 'lucide-react';

interface TeamMemberFormProps {
    member?: {
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
    };
    action: (formData: FormData) => Promise<void>;
}

export function TeamMemberForm({ member, action }: TeamMemberFormProps) {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await action(formData);
        } catch (error: any) {
            console.error(error);
            alert("Error: " + error.message);
            setIsPending(false);
        }
    };

    return (
        <form action={handleSubmit}>
            <Card>
                <CardContent className="pt-6 space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Full Name</label>
                        <Input 
                            name="name" 
                            defaultValue={member?.name} 
                            placeholder="e.g. John Doe" 
                            required 
                            className="font-bold"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Email Address</label>
                        <Input 
                            name="email" 
                            type="email"
                            defaultValue={member?.email} 
                            placeholder="john@security360.co.zw" 
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Role</label>
                            <Input 
                                name="role" 
                                defaultValue={member?.role} 
                                placeholder="e.g. Field Technician / Sales / Admin" 
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Status</label>
                            <select
                                name="status"
                                defaultValue={member?.status || 'ACTIVE'}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="AWAY">AWAY</option>
                                <option value="INACTIVE">INACTIVE</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button 
                            type="submit" 
                            disabled={isPending}
                            className="text-[10px] uppercase tracking-[0.2em] font-black h-10 px-8"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {member ? 'Update Member' : 'Create Member'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
