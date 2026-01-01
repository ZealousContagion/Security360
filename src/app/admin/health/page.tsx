"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Wifi, Server, Database, Globe, Activity, ShieldCheck, HeartPulse } from "lucide-react"

export default function HealthPage() {
    const services = [
        { name: "M-Pesa Gateway", status: "Operational", latency: "124ms", icon: <Wifi className="h-4 w-4" />, color: "text-green-600" },
        { name: "Stripe API", status: "Operational", latency: "210ms", icon: <Globe className="h-4 w-4" />, color: "text-green-600" },
        { name: "Database Cluster", status: "Operational", latency: "12ms", icon: <Database className="h-4 w-4" />, color: "text-green-600" },
        { name: "Email Server (Postmark)", status: "Operational", latency: "45ms", icon: <Server className="h-4 w-4" />, color: "text-green-600" },
    ]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                    <HeartPulse className="h-8 w-8" /> System Health
                </h2>
                <p className="text-muted-foreground">Monitor infrastructure status and automation heartbeats.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {services.map((service, i) => (
                    <Card key={i}>
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                            {service.icon}
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex items-center justify-between">
                                <Badge variant="success" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                    {service.status}
                                </Badge>
                                <div className="text-xs text-muted-foreground">{service.latency}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" /> Automation Heartbeats
                    </CardTitle>
                    <CardDescription>Scheduled tasks and background workers performance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Recurring Invoice Engine</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">Last run: 4 hours ago. Success rate: 100%</div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: "100%" }} />
                            </div>
                        </div>
                        <div className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Audit Sync Worker</span>
                                <Badge variant="success">Active</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">Last run: 2 mins ago. Success rate: 98.4%</div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: "98%" }} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <ShieldCheck className="h-5 w-5" /> Security Compliance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Badge variant="outline" className="border-primary text-primary px-3 py-1">SSL/TLS 1.3 Active</Badge>
                        <Badge variant="outline" className="border-primary text-primary px-3 py-1">AES-256 Storage</Badge>
                        <Badge variant="outline" className="border-primary text-primary px-3 py-1">PCI-DSS Compliant Gates</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
