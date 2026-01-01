"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { BarChart3, Download, Filter, Calendar, FileText, PieChart, TrendingUp } from "lucide-react"
import { useToast } from "@/components/ui/ToastProvider"

export default function ReportsPage() {
    const { toast } = useToast()
    const [isExporting, setIsExporting] = React.useState(false)

    const handleExport = (format: string) => {
        setIsExporting(true)
        setTimeout(() => {
            setIsExporting(false)
            toast({
                title: "Report Exported",
                description: `Your financial report has been downloaded as ${format}.`,
                variant: "success"
            })
        }, 2000)
    }

    const statistics = [
        { label: "Total Revenue", value: "KES 4,250,000", trend: "+12.5%", color: "text-green-600" },
        { label: "Fencing Revenue", value: "KES 1,120,000", trend: "+25.8%", color: "text-primary" },
        { label: "Collection Rate", value: "94.2%", trend: "+5.1%", color: "text-blue-600" },
        { label: "Quote Conversion", value: "68.5%", trend: "+3.2%", color: "text-emerald-600" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2">
                        <BarChart3 className="h-8 w-8" /> Advanced Analytics
                    </h2>
                    <p className="text-muted-foreground">Comprehensive financial reporting and collection tracking.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" /> This Month
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {statistics.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className={`mt-1 flex items-center text-xs ${stat.color}`}>
                                <TrendingUp className="mr-1 h-3 w-3" />
                                {stat.trend} from last period
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Breakdown</CardTitle>
                        <CardDescription>Monthly breakdown across service lines and fencing types.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Lines</h4>
                                {[
                                    { name: "Guarding Services", value: 45, color: "bg-primary" },
                                    { name: "Fencing Installation", value: 30, color: "bg-emerald-500" },
                                    { name: "Technical/CCTV", value: 15, color: "bg-blue-500" },
                                    { name: "Rapid Response", value: 10, color: "bg-amber-500" },
                                ].map((cat, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>{cat.name}</span>
                                            <span className="font-medium">{cat.value}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fencing Revenue by Type</h4>
                                {[
                                    { name: "Diamond Mesh", value: 40, color: "bg-primary/80" },
                                    { name: "Electric Fence", value: 35, color: "bg-accent" },
                                    { name: "Razor Wire", value: 15, color: "bg-destructive/80" },
                                    { name: "Game Fence", value: 10, color: "bg-emerald-600/80" },
                                ].map((cat, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{cat.name}</span>
                                            <span>{cat.value}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Export Financial Data</CardTitle>
                        <CardDescription>Generate reports for accounting and auditing.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => handleExport("CSV")}
                            disabled={isExporting}
                        >
                            <FileText className="mr-3 h-5 w-5 text-green-600" />
                            <div>
                                <div className="text-left font-medium">Export all Invoices (CSV)</div>
                                <div className="text-xs text-muted-foreground">Ready for Excel or Sage 50.</div>
                            </div>
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => handleExport("PDF")}
                            disabled={isExporting}
                        >
                            <PieChart className="mr-3 h-5 w-5 text-blue-600" />
                            <div>
                                <div className="text-left font-medium">Tax Summary Report (PDF)</div>
                                <div className="text-xs text-muted-foreground">Monthly VAT collection summary.</div>
                            </div>
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                            onClick={() => handleExport("XLSX")}
                            disabled={isExporting}
                        >
                            <TrendingUp className="mr-3 h-5 w-5 text-amber-600" />
                            <div>
                                <div className="text-left font-medium">Collection Performance (Excel)</div>
                                <div className="text-xs text-muted-foreground">Analysis of payment speed by client.</div>
                            </div>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Historical Reports</CardTitle>
                    <CardDescription>Recently generated documents.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report Name</TableHead>
                                <TableHead>Date Generated</TableHead>
                                <TableHead>Format</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">December 2024 VAT Report</TableCell>
                                <TableCell>2025-01-01</TableCell>
                                <TableCell><Badge variant="secondary">PDF</Badge></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm">Download</Button></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Q4 Collections Ledger</TableCell>
                                <TableCell>2024-12-31</TableCell>
                                <TableCell><Badge variant="secondary">CSV</Badge></TableCell>
                                <TableCell className="text-right"><Button variant="ghost" size="sm">Download</Button></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
