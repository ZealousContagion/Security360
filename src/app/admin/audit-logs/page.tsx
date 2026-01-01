"use client"

import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { History, User, Shield, Info } from "lucide-react"

export default function AuditLogsPage() {
    const logs = [
        { id: 1, action: "Invoice Created", entity: "INV-2025-004", user: "Admin (admin@security360.com)", timestamp: "2025-01-02 14:30:45", level: "Info" },
        { id: 2, action: "Payment Method Updated", entity: "M-PESA Config", user: "SuperAdmin (john@security360.com)", timestamp: "2025-01-02 12:15:20", level: "Warning" },
        { id: 3, action: "Invoice Sent", entity: "INV-2025-001", user: "System (Automation)", timestamp: "2025-01-02 09:00:01", level: "Info" },
        { id: 4, action: "Failed Login Attempt", entity: "IP: 192.168.1.100", user: "Unknown", timestamp: "2025-01-01 23:45:12", level: "Destructive" },
        { id: 5, action: "Customer Deleted", entity: "CUST-099", user: "Manager (sarah@security360.com)", timestamp: "2025-01-01 16:20:10", level: "Destructive" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <History className="h-8 w-8 text-primary" /> Audit Logs
                    </h2>
                    <p className="text-muted-foreground">Track all administrative activities and security events.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Security & Operations Ledger</CardTitle>
                    <CardDescription>A complete history of changes in the business arena.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Target Entity</TableHead>
                                <TableHead>Performed By</TableHead>
                                <TableHead>Level</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                                        {log.timestamp}
                                    </TableCell>
                                    <TableCell className="font-medium">{log.action}</TableCell>
                                    <TableCell className="text-sm font-mono">{log.entity}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-sm">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            {log.user}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            log.level === "Destructive" ? "destructive" :
                                                log.level === "Warning" ? "secondary" : "default"
                                        }>
                                            {log.level}
                                        </Badge>
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
