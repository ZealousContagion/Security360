"use client"

import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Percent, Check, AlertCircle } from "lucide-react"

export default function TaxSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-primary">Tax & VAT Configuration</h2>
                <p className="text-muted-foreground">Manage global tax rates and VAT regulations for your invoices.</p>
            </div>

            <div className="grid gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-5 w-5" /> Global VAT Rate
                        </CardTitle>
                        <CardDescription>This rate will be applied by default to all new invoices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="space-y-2 flex-1 max-w-[200px]">
                                <label className="text-sm font-medium">Standard Rate (%)</label>
                                <Input type="number" defaultValue="16" />
                            </div>
                            <div className="pt-8">
                                <Badge variant="success">Active</Badge>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Note: Tax changes will only apply to future invoices. Existing invoices will maintain their original rates.
                        </p>
                    </CardContent>
                    <CardFooter className="justify-end border-t bg-muted/20 py-3">
                        <Button>Update VAT Rate</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tax-Exempt Categories</CardTitle>
                        <CardDescription>Manage services or items that are exempt from global VAT.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            <li className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                    <div className="font-medium">International Escort Services</div>
                                    <div className="text-xs text-muted-foreground">Zero-rated for export services</div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                            </li>
                            <li className="flex items-center justify-between p-3 border rounded-md">
                                <div>
                                    <div className="font-medium">NGO Training Programs</div>
                                    <div className="text-xs text-muted-foreground">Tax exempt for educational grants</div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-destructive">Remove</Button>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter className="justify-start border-t bg-muted/20 py-3">
                        <Button variant="outline" size="sm">Add Exempt Category</Button>
                    </CardFooter>
                </Card>

                <Card className="bg-amber-50 border-amber-200">
                    <CardHeader>
                        <CardTitle className="text-amber-800 flex items-center gap-2 text-base">
                            <AlertCircle className="h-4 w-4" /> Compliance Notice
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-amber-700">
                            You are currently generating invoices under the standard PIT (Public Income Tax) regime. Ensure your KRA iTax integration is updated if you switch to VAT-registered status.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
