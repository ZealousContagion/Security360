"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { ArrowLeft, Plus, Save } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table"

export default function CreateInvoicePage() {
    // Simple form state
    const [items, setItems] = useState([
        { description: "Guard Services", quantity: 1, price: 0 }
    ])

    const addItem = () => {
        setItems([...items, { description: "", quantity: 1, price: 0 }])
    }

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...items]
        newItems[index] = { ...newItems[index], [field]: value }
        setItems(newItems)
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/invoices">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Invoice</h2>
                    <p className="text-muted-foreground">Draft a new invoice for a customer.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                    <CardDescription>Enter customer and service details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Customer Name</label>
                            <Input placeholder="e.g. Greenwood Estate" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input placeholder="e.g. 0700 000 000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Services</label>
                            <Button variant="outline" size="sm" onClick={addItem} type="button">
                                <Plus className="mr-2 h-3 w-3" /> Add Item
                            </Button>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50%]">Description</TableHead>
                                        <TableHead>Qty</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => updateItem(index, "description", e.target.value)}
                                                    placeholder="Service info"
                                                    className="border-0 focus-visible:ring-0 px-0 h-auto py-1"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 0)}
                                                    className="border-0 focus-visible:ring-0 px-0 h-auto py-1 w-16"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => updateItem(index, "price", parseFloat(e.target.value) || 0)}
                                                    className="border-0 focus-visible:ring-0 px-0 h-auto py-1 w-24"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {(item.quantity * item.price).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <div className="w-48 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{calculateTotal().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">VAT (16%)</span>
                                <span>{(calculateTotal() * 0.16).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>KES {(calculateTotal() * 1.16).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end gap-4">
                    <Button variant="outline">Save as Draft</Button>
                    <Button>
                        <Save className="mr-2 h-4 w-4" /> Save & Send
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
