"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Bell, Mail, Smartphone, AlertCircle, CheckCircle2, Info, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function NotificationsPage() {
    const logs = [
        { id: 1, type: "Payment", message: "Invoice INV-2025-002 paid by Westlands Mall", time: "2 mins ago", level: "Success" },
        { id: 2, type: "System", message: "M-Pesa Gateway experienced minor latency", time: "1 hour ago", level: "Warning" },
        { id: 3, type: "Support", message: "New ticket TK-4412 created by Greenwood Estate", time: "3 hours ago", level: "Info" },
        { id: 4, type: "Billing", message: "12 Recurring invoices generated for January", time: "1 day ago", level: "Success" },
        { id: 5, type: "Security", message: "Failed login attempt from IP 192.168.1.1", time: "2 days ago", level: "Critical" },
    ]

    const getLevelBadge = (level: string) => {
        switch (level) {
            case "Success": return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> {level}</Badge>
            case "Warning": return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 border-none"><AlertCircle className="h-3 w-3" /> {level}</Badge>
            case "Critical": return <Badge variant="destructive" className="gap-1 font-bold animate-pulse"><AlertCircle className="h-3 w-3" /> {level}</Badge>
            default: return <Badge variant="outline" className="gap-1"><Info className="h-3 w-3" /> {level}</Badge>
        }
    }

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <Bell className="h-8 w-8" /> Activity Hub
                    </h2>
                    <p className="text-muted-foreground">Real-time alerts and communication history logs.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">Mark all as read</Button>
                    <Button size="sm">Settings</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-600" /> Automated Emails
                        </CardTitle>
                        <CardDescription>Manage triggers for client notifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Invoice Created", status: true },
                            { name: "Payment Received", status: true },
                            { name: "Card Expiring soon", status: true },
                            { name: "Overdue Reminder", status: false },
                        ].map((trigger, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-md">
                                <span className="text-sm font-medium">{trigger.name}</span>
                                <Badge variant={trigger.status ? "success" : "secondary"}>
                                    {trigger.status ? "Active" : "Disabled"}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-green-600" /> Webhooks & Push
                        </CardTitle>
                        <CardDescription>External service integration status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-slate-900 rounded-lg text-slate-300 font-mono text-sm overflow-hidden truncate">
                            https://api.security360.co.ke/v1/webhooks
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Configure your custom webhook URL to receive real-time JSON payloads for every payment event.
                        </p>
                        <Button variant="outline" className="w-full">Test Connection</Button>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle>Recent Activity Log</CardTitle>
                    <CardDescription>A centralized ledger of all system events.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {logs.map((log) => (
                            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="pt-1">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${log.type === "Payment" ? "bg-green-100 text-green-700" :
                                                log.type === "Security" ? "bg-red-100 text-red-700" :
                                                    "bg-blue-100 text-blue-700"
                                            }`}>
                                            <Bell className="h-4 w-4" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-900">{log.message}</div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-tight">
                                            {log.type} • {log.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {getLevelBadge(log.level)}
                                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
