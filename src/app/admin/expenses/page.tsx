"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Receipt, ShoppingCart, Truck, MoreHorizontal, TrendingDown, DollarSign, Loader2 } from "lucide-react"
import { fetchExpensesAction } from "@/lib/actions/payments"

export default function ExpensesPage() {
    const [expenses, setExpenses] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadExpenses = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchExpensesAction()
            setExpenses(data)
        } catch (error) {
            console.error("Failed to load expenses:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadExpenses()
    }, [loadExpenses])

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Receipt className="h-8 w-8" /> Expense Management
                    </h2>
                    <p className="text-muted-foreground">Track operational costs and manage service vendors.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Log New Expense
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-rose-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Global Burn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
                        <div className="text-xs text-rose-600 flex items-center mt-1">
                            <TrendingDown className="mr-1 h-3 w-3" /> Live data from backend
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{new Set(expenses.map(e => e.category)).size}</div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Transaction Volume</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expenses.length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle>Operational Ledger</CardTitle>
                    <CardDescription>Comprehensive tracking of business expenditures.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                                <p className="text-muted-foreground animate-pulse">Synchronizing expense reports...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : expenses.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                            No expenses logged in the system.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    expenses.map((exp) => (
                                        <TableRow key={exp.id} className="group hover:bg-rose-50/20 transition-colors">
                                            <TableCell className="font-mono text-[10px] text-muted-foreground">
                                                {exp.id.split('-')[0].toUpperCase()}
                                            </TableCell>
                                            <TableCell className="font-medium text-primary">{exp.description}</TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">
                                                    {exp.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-bold text-rose-600">{formatCurrency(exp.amount)}</TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(exp.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="success" className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-bold">
                                                    {exp.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="opacity-100 lg:opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
