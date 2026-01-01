"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { MessageSquare, LifeBuoy, MoreHorizontal, Search, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { Input } from "@/components/ui/Input"

export default function SupportPage() {
    const tickets = [
        { id: "TK-4412", subject: "M-Pesa Payment Not Reflected", customer: "Greenwood Estate", priority: "High", status: "Open", date: "10 mins ago" },
        { id: "TK-4410", subject: "Wrong VAT applied on Invoice #992", customer: "Westlands Mall", priority: "Medium", status: "In Progress", date: "2 hours ago" },
        { id: "TK-4395", subject: "Request for Guard Substitution", customer: "Sunrise Apartments", priority: "Low", status: "Resolved", date: "1 day ago" },
        { id: "TK-4390", subject: "Portal Login Issue", customer: "Nairobi Biz Park", priority: "High", status: "Closed", date: "3 days ago" },
    ]

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Open": return <Clock className="h-3 w-3 text-amber-600" />
            case "In Progress": return <AlertTriangle className="h-3 w-3 text-blue-600" />
            case "Resolved": return <CheckCircle2 className="h-3 w-3 text-green-600" />
            default: return null
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <LifeBuoy className="h-8 w-8" /> Support Hub
                    </h2>
                    <p className="text-muted-foreground">Manage client inquiries and service tickets.</p>
                </div>
                <Button>
                    <MessageSquare className="mr-2 h-4 w-4" /> New Ticket
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Tickets", count: 124, color: "text-slate-600" },
                    { label: "Open", count: 12, color: "text-amber-600" },
                    { label: "Resolved", count: 98, color: "text-green-600" },
                    { label: "Unassigned", count: 2, color: "text-destructive" },
                ].map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="p-4 pb-0">
                            <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                            <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tickets..." className="pl-8" />
                </div>
            </div>

            <Card className="border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle>Active Tickets</CardTitle>
                    <CardDescription>Support requests queued for administrative action.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ticket #</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Priority</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                                    <TableCell className="text-sm">{ticket.customer}</TableCell>
                                    <TableCell>
                                        <Badge variant={ticket.priority === "High" ? "destructive" : "secondary"}>
                                            {ticket.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.status)}
                                            <span className="text-sm">{ticket.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{ticket.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
