"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Shield, User, CreditCard, Percent, ChevronRight } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Settings</h2>
                <p className="text-muted-foreground">Manage your account and platform preferences.</p>
            </div>

            <div className="grid gap-6">
                {/* Business Arena Settings */}
                <Card className="border-t-4 border-t-primary">
                    <CardHeader>
                        <CardTitle>Business Configuration</CardTitle>
                        <CardDescription>Setup your financial and operational parameters.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            <Link href="/admin/settings/payments" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Payment Methods</div>
                                        <div className="text-sm text-muted-foreground">Configure M-Pesa, Bank, and Card gateways.</div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                            <Link href="/admin/settings/tax" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <Percent className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Tax & VAT</div>
                                        <div className="text-sm text-muted-foreground">Manage local tax rates and exemptions.</div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" /> Profile Settings
                        </CardTitle>
                        <CardDescription>Update your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input defaultValue="Administrator" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <Input defaultValue="admin@security360.com" />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end bg-muted/20 py-3">
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" /> Security
                        </CardTitle>
                        <CardDescription>Two-factor authentication and password management.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-md">
                            <div className="space-y-1">
                                <div className="font-medium">Two-Factor Authentication (2FA)</div>
                                <div className="text-sm text-muted-foreground">Add an extra layer of security to your account.</div>
                            </div>
                            <Button variant="outline">Enable</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
