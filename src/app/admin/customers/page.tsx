"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"
import { Plus, Search, MoreHorizontal, Mail, Phone, Users, FileText, Loader2, MapPin } from "lucide-react"
import { Input } from "@/components/ui/Input"
import { EmptyState } from "@/components/ui/EmptyState"
import { fetchCustomersAction } from "@/lib/actions/customers"

export default function CustomersPage() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [customers, setCustomers] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const loadCustomers = React.useCallback(async () => {
        try {
            setIsLoading(true)
            const data = await fetchCustomersAction()
            setCustomers(data)
        } catch (error) {
            console.error("Failed to load customers:", error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => {
        loadCustomers()
    }, [loadCustomers])

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-primary">Customer Relations</h2>
                    <p className="text-muted-foreground">Manage client directory and financial health.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add New Customer
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search CRM directory..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl bg-muted/20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing Customer Records...</p>
                </div>
            ) : filtered.length === 0 ? (
                <EmptyState
                    title="No customers found"
                    description={searchQuery ? `No matches for "${searchQuery}" in our database.` : "Your customer database is currently empty."}
                    icon={Users}
                    actionLabel="Add Customer"
                    onAction={() => alert("Add customer clicked")}
                />
            ) : (
                <Card className="border-t-4 border-t-primary shadow-lg overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4">
                        <CardTitle>Enterprise Directory</CardTitle>
                        <CardDescription>Comprehensive list of registered clients and their billing status.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Client Identity</TableHead>
                                        <TableHead>Channel Info</TableHead>
                                        <TableHead>Account Status</TableHead>
                                        <TableHead>Billing Volume</TableHead>
                                        <TableHead className="text-right">Management</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((customer) => (
                                        <TableRow key={customer.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell className="py-4">
                                                <div className="font-bold text-primary">{customer.name}</div>
                                                <div className="text-[10px] text-muted-foreground font-mono">UUID: {customer.id.split('-')[0]}...</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs text-muted-foreground gap-1">
                                                    <span className="flex items-center gap-1.5 font-medium text-foreground/80"><Mail className="h-3 w-3" /> {customer.email}</span>
                                                    <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {customer.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={customer.isActive ? "success" : "secondary"} className="uppercase text-[10px] font-bold tracking-wider">
                                                    {customer.isActive ? "Active" : "Archived"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-mono">{customer.invoiceCount} Invoices</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/customers/${customer.id}/statement`}>
                                                        <Button variant="ghost" size="sm" className="gap-2 text-primary hover:bg-primary/10">
                                                            <FileText className="h-4 w-4" /> Statement
                                                        </Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" title="Edit Profile"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
