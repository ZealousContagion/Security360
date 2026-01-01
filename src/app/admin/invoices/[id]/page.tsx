"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer, Mail, Ban, CheckCircle, Download, MoreVertical, ChevronDown, ChevronRight, Zap, ShieldAlert, Ruler } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { useState } from "react"
import * as React from "react"
import { fetchInvoiceAction } from "@/lib/actions/fencing"

export default function AdminInvoiceDetailsPage() {
    const params = useParams()
    const id = params?.id || "INV-2025-001" // Fallback for static demo if needed
    const [showFencingBreakdown, setShowFencingBreakdown] = useState(true)
    const [invoice, setInvoice] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    React.useEffect(() => {
        async function load() {
            try {
                const data = await fetchInvoiceAction(id as string)
                if (data) {
                    setInvoice(data)
                } else {
                    // Fallback to mock for existing demo IDs
                    setInvoice({
                        id: id,
                        customer: "Greenwood Estate Management",
                        email: "accounts@greenwood.co.ke",
                        address: "P.O Box 12345, Nairobi",
                        issueDate: "2025-01-01",
                        dueDate: "2025-01-15",
                        status: "Pending",
                        items: [
                            { description: "Diamond Mesh Fencing Installation", quantity: 150, price: 1200 },
                            { description: "Alarm Response Subscription", quantity: 1, price: 5000 },
                        ],
                        fencingDetails: {
                            type: "Diamond Mesh Fence",
                            length: 150,
                            height: "1.8m",
                            terrain: "Flat",
                            addons: [
                                { name: "Razor wire topping", price: 350, type: "perMeter" },
                                { name: "Standard Gate", price: 15000, type: "flat" }
                            ],
                            installationFee: 5000
                        },
                        subtotal: 242500,
                        tax: 38800,
                        total: 281300,
                    })
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <div className="p-8 text-center">Loading Invoice {id}...</div>
    if (!invoice) return <div className="p-8 text-center text-destructive">Invoice not found.</div>

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/admin/invoices">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Invoice {invoice.id}</h2>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{invoice.customer}</span>
                            <span>•</span>
                            <Badge variant="secondary">{invoice.status}</Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Mail className="mr-2 h-4 w-4" /> Resend
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button variant="default" size="sm">
                        Record Payment
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Invoice Document */}
                <Card className="md:col-span-2">
                    <CardHeader className="border-b pb-6">
                        <div className="flex justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Security 360 Ltd</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    <p>Security House, Mombasa Rd</p>
                                    <p>Nairobi, Kenya</p>
                                    <p>+254 700 000 000</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <h3 className="font-semibold text-lg text-muted-foreground">INVOICE</h3>
                                <p className="font-medium text-lg">{invoice.id}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">
                        {invoice.fencingDetails && (
                            <div className="border rounded-lg overflow-hidden mb-6">
                                <button
                                    className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                    onClick={() => setShowFencingBreakdown(!showFencingBreakdown)}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="p-1 bg-primary/10 rounded">
                                            <Ruler className="h-4 w-4 text-primary" />
                                        </div>
                                        <h4 className="font-bold text-sm">Fencing Job Breakdown: <span className="text-primary">{invoice.fencingDetails.type}</span></h4>
                                        <Badge variant="outline" className="text-[10px] ml-2">{invoice.fencingDetails.length}m</Badge>
                                    </div>
                                    {showFencingBreakdown ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>

                                {showFencingBreakdown && (
                                    <div className="p-4 bg-background border-t space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                            <div>
                                                <p className="text-muted-foreground mb-1 uppercase tracking-wider font-bold">Base Material</p>
                                                <p className="font-medium">{invoice.fencingDetails.type}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1 uppercase tracking-wider font-bold">Total Length</p>
                                                <p className="font-medium">{invoice.fencingDetails.length} Meters</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1 uppercase tracking-wider font-bold">Height</p>
                                                <p className="font-medium">{invoice.fencingDetails.height}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground mb-1 uppercase tracking-wider font-bold">Terrain</p>
                                                <p className="font-medium">{invoice.fencingDetails.terrain}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Security Add-ons</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {invoice.fencingDetails.addons.map((addon: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-secondary/20">
                                                        <div className="flex items-center gap-2">
                                                            {addon.name.toLowerCase().includes('electric') ? <Zap className="h-3 w-3 text-accent" /> : <ShieldAlert className="h-3 w-3 text-destructive" />}
                                                            <span>{addon.name}</span>
                                                        </div>
                                                        <span className="font-mono text-muted-foreground">
                                                            {addon.type === 'perMeter' ? `${(addon.price * invoice.fencingDetails.length).toLocaleString()} (incl.)` : `${addon.price.toLocaleString()} (flat)`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 text-[10px] text-muted-foreground italic border-t">
                                            <p>* All materials are UV-stabilized and weather-resistant.</p>
                                            <p>Installation includes: {invoice.fencingDetails.installationFee.toLocaleString()} (applied to subtotal)</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-8 text-sm">
                            <div>
                                <h4 className="font-semibold mb-2 text-muted-foreground">Bill To</h4>
                                <p className="font-medium text-base">{invoice.customer}</p>
                                <p>{invoice.address}</p>
                                <p>{invoice.email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold mb-1 text-muted-foreground">Issue Date</h4>
                                    <p>{invoice.issueDate}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1 text-muted-foreground">Due Date</h4>
                                    <p>{invoice.dueDate}</p>
                                </div>
                            </div>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50%]">Item Description</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoice.items.map((item: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium">{item.description}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{item.price.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">{(item.quantity * item.price).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <div className="flex justify-end">
                            <div className="w-1/2 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{invoice.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (16%)</span>
                                    <span>{invoice.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold border-t pt-2">
                                    <span>Total Due</span>
                                    <span>KES {invoice.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Actions & Timeline */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Payment Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-4 space-y-2">
                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-slate-500">?</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-medium">Awaiting Payment</p>
                                    <p className="text-xs text-muted-foreground">Due in 14 days</p>
                                </div>
                                <Button className="w-full mt-4" variant="outline">
                                    Mark as Void <Ban className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">Activity Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-3 text-sm">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-medium">Invoice Created</p>
                                        <p className="text-xs text-muted-foreground">Jan 1, 2025 at 09:00 AM</p>
                                        <p className="text-xs">by Administrator</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <div className="mt-0.5 h-2 w-2 rounded-full bg-slate-200 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-medium text-muted-foreground">Email Sent</p>
                                        <p className="text-xs text-muted-foreground">Jan 1, 2025 at 09:05 AM</p>
                                        <p className="text-xs text-muted-foreground">to {invoice.email}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
