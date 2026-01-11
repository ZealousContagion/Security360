'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, Loader2, Save, X, Briefcase } from 'lucide-react';
import { createExpense } from './actions';

interface ActiveJob {
    id: string;
    customerName: string;
}

export function LogExpenseButton({ activeJobs = [] }: { activeJobs?: ActiveJob[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            await createExpense(formData);
            setIsOpen(false);
        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)} className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6 shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Log Expense
            </Button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-md animate-in zoom-in-95 duration-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Log New Expense</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <form action={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Category</label>
                                        <select
                                            name="category"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            required
                                        >
                                            <option value="Materials">Materials</option>
                                            <option value="Fuel">Fuel</option>
                                            <option value="Tools">Tools</option>
                                            <option value="Labor">Labor</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Amount ($)</label>
                                        <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                                        <Briefcase className="w-3 h-3 text-primary" />
                                        Link to Project (Optional)
                                    </label>
                                    <select
                                        name="jobId"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="none">General Business Expense</option>
                                        {activeJobs.map(job => (
                                            <option key={job.id} value={job.id}>{job.customerName} ({job.id.slice(0, 5)})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Description</label>
                                    <Input name="description" placeholder="e.g. Extra cement for site" required />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Date</label>
                                    <Input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>

                                <div className="pt-4 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="text-[10px] font-bold uppercase">Cancel</Button>
                                    <Button 
                                        type="submit" 
                                        disabled={isPending}
                                        className="text-[10px] uppercase tracking-[0.2em] font-black px-8"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                        Commit Log
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}