import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Receipt, Plus, PieChart } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function ExpensesPage() {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
    });

    const totalSpending = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
    
    // Calculate category breakdown
    const categories = Array.from(new Set(expenses.map(e => e.category)));
    const breakdown = categories.map(cat => {
        const amount = expenses.filter(e => e.category === cat).reduce((acc, e) => acc + Number(e.amount), 0);
        return {
            label: cat,
            value: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0,
            color: cat === 'Materials' ? 'bg-primary' : cat === 'Fuel' ? 'bg-secondary' : 'bg-muted-foreground'
        };
    }).sort((a, b) => b.value - a.value);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Expenses</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Track business costs and materials</p>
                </div>
                <Button className="text-[10px] uppercase tracking-[0.2em] font-bold h-10 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Log Expense
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <PieChart className="w-3 h-3 text-primary" />
                            Expense Category Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 pt-2">
                            {breakdown.length === 0 ? (
                                <p className="text-xs text-muted-foreground uppercase tracking-widest text-center py-4">No data available</p>
                            ) : breakdown.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-[9px] uppercase font-bold tracking-widest">
                                        <span>{item.label}</span>
                                        <span>{item.value}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-accent rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-center items-center p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold uppercase text-sm tracking-tight">Monthly Spending</h3>
                        <p className="text-3xl font-black tracking-tighter text-primary">£{totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <Button variant="outline" className="text-[9px] uppercase tracking-widest px-4 h-8 font-bold">Download Report</Button>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest font-bold">Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Date</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Category</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold">Description</TableHead>
                                <TableHead className="uppercase text-[10px] tracking-widest font-bold text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {expenses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="p-12 text-center text-muted-foreground uppercase text-[10px] tracking-widest">
                                        No expenses logged yet.
                                    </TableCell>
                                </TableRow>
                            ) : expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell className="text-xs text-muted-foreground uppercase">
                                        {new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </TableCell>
                                    <TableCell><span className="text-[10px] font-bold uppercase bg-accent px-2 py-0.5 rounded">{expense.category}</span></TableCell>
                                    <TableCell className="text-xs font-medium uppercase tracking-tight">{expense.description}</TableCell>
                                    <TableCell className="text-right font-bold">£{Number(expense.amount).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

