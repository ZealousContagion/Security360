"use client"

import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { CreditCard, Smartphone, Landmark, Check } from "lucide-react"

export default function PaymentSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Payment Methods</h2>
                <p className="text-muted-foreground">Configure how you receive payments from clients.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-green-600" /> M-Pesa Integration
                        </CardTitle>
                        <CardDescription>Setup Lipa Na M-Pesa STK Push and C2B.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Shortcode / Paybill</label>
                                <Input defaultValue="123456" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Consumer Key</label>
                                <Input type="password" defaultValue="****************" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t bg-muted/20 py-3">
                        <Button>Save M-Pesa Config</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-600" /> Card & Global Payments
                        </CardTitle>
                        <CardDescription>Configure Stripe or PayPal for international card payments.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-500">S</div>
                                <div>
                                    <div className="font-medium">Stripe</div>
                                    <div className="text-sm text-muted-foreground">Connect your Stripe account.</div>
                                </div>
                            </div>
                            <Button variant="outline">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-md bg-green-50/50 border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-blue-100 rounded flex items-center justify-center font-bold text-blue-600">P</div>
                                <div>
                                    <div className="font-medium">PayPal</div>
                                    <div className="text-sm text-muted-foreground text-green-700 flex items-center gap-1">
                                        <Check className="h-3 w-3" /> Connected as business@security360.com
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-destructive">Disconnect</Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-amber-600" /> Bank Transfer
                        </CardTitle>
                        <CardDescription>Direct bank deposit instructions shown on invoices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bank Details (Plain Text)</label>
                            <textarea
                                className="w-full min-h-[100px] p-3 rounded-md border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                defaultValue={"Bank Name: KCB Bank\nAccount Name: Security 360 Limited\nAccount Number: 1100 2222 3333\nBranch: Corporate"}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t bg-muted/20 py-3">
                        <Button>Update Bank Info</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
