'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Loader2, Save } from 'lucide-react';

interface CustomerFormProps {
    customer?: {
        id: string;
        name: string;
        email?: string | null;
        phone?: string | null;
        address?: string | null;
    };
    action: (formData: FormData) => Promise<void>;
}

export function CustomerForm({ customer, action }: CustomerFormProps) {
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await action(formData);
        } catch (error) {
            console.error(error);
            alert("Failed to save customer");
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
                            defaultValue={customer?.name} 
                            placeholder="e.g. John Doe / Acme Corp" 
                            required 
                            className="font-bold"
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Email Address</label>
                            <Input 
                                name="email" 
                                type="email"
                                defaultValue={customer?.email || ''} 
                                placeholder="john@example.com" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Phone Number</label>
                            <Input 
                                name="phone" 
                                type="tel"
                                defaultValue={customer?.phone || ''} 
                                placeholder="+263 77 123 4567" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest mb-1 text-muted-foreground">Physical Address</label>
                        <Input 
                            name="address" 
                            defaultValue={customer?.address || ''} 
                            placeholder="123 Example St, Harare" 
                        />
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
                            {customer ? 'Update Customer' : 'Create Customer'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
