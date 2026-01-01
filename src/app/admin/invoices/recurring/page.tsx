"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, RefreshCw, MoreHorizontal, Calendar, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/ToastProvider"

export default function RecurringInvoicesPage() {
    const { toast } = useToast()

    const recurring = [
        { id: "REC-001", customer: "Greenwood Estate", frequency: "Monthly", amount: "KES 85,000", nextDate: "2025-02-01", status: "Active" },
        { id: "REC-002", customer: "Westlands Mall", frequency: "Quarterly", amount: "KES 360,000", nextDate: "2025-04-01", status: "Active" },
        { id: "REC-003", customer: "Sunrise Apartments", frequency: "Monthly", amount: "KES 15,000", nextDate: "2025-02-15", status: "Paused" },
    ]

    const handleRunNow = (id: string) => {
        toast({
            title: "Invoice Generated",
            description: `A one-off invoice from template ${id} has been generated.`,
            variant: "success"
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <RefreshCw className="h-8 w-8" /> Recurring Invoices
                    </h2>
                    <p className="text-muted-foreground">Automated billing for service contracts.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Recurring Plan
                </Button>
            </div>

            <Card className="border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle>Active Subscriptions</CardTitle>
                    <CardDescription>Automation plans for regular clients.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Next Bill Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recurring.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.customer}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-normal capitalize">
                                            {item.frequency}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{item.amount}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3 text-muted-foreground" />
                                            {item.nextDate}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={item.status === "Active" ? "success" : "secondary"}>
                                            {item.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleRunNow(item.id)}>
                                                Run Now
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Total Monthly Recurring Revenue (MRR)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">KES 1,240,000</div>
                        <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-semibold">Next Automation Run</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-sm">Feb 1, 2025 (12 Invoices)</div>
                            <Badge variant="outline">Scheduled</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
