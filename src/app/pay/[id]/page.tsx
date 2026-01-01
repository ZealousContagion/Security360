"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ShieldCheck, CreditCard, Smartphone, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Info, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

// Mock Data
const INVOICE = {
    id: "INV-2025-001",
    customer: "Greenwood Estate Management",
    services: [
        { name: "Diamond Mesh Fencing Installation", amount: 180000 },
        { name: "Alarm Response Subscription", amount: 5000 },
        { name: "Security Gate & Access Control", amount: 15000 },
    ],
    fencingDetails: {
        type: "Diamond Mesh Fence",
        length: 150,
        height: "1.8m",
        terrain: "Flat",
        addons: [
            { name: "Razor wire topping", amount: 52500 }
        ]
    },
    total: 252500,
    currency: "KES",
    status: "Pending",
    dueDate: "2025-01-15",
};

export default function InvoicePaymentPage() {
    const params = useParams();
    const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "card">("mpesa");
    const [paymentStatus, setPaymentStatus] = useState<"pending" | "processing" | "success" | "failed">("pending");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handlePayment = () => {
        setPaymentStatus("processing");
        // Simulate API call
        setTimeout(() => {
            setPaymentStatus("success");
        }, 2000);
    };

    const [showFenceDetails, setShowFenceDetails] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(amount);
    };

    if (paymentStatus === "success") {
        return (
            <Card className="w-full max-w-md border-t-4 border-t-accent shadow-lg animate-in fade-in zoom-in-95 duration-500">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-accent/10 p-3 rounded-full mb-4 w-fit">
                        <CheckCircle2 className="h-10 w-10 text-accent" />
                    </div>
                    <CardTitle className="text-2xl text-accent">Payment Successful</CardTitle>
                    <CardDescription>Thank you for your payment.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
                        <p className="text-sm text-muted-foreground">Invoice</p>
                        <p className="font-semibold">{INVOICE.id}</p>
                        <div className="h-px bg-border my-2" />
                        <p className="text-sm text-muted-foreground">Amount Paid</p>
                        <p className="font-semibold text-xl">{formatCurrency(INVOICE.total)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        A confirmation has been sent to your email and phone.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" variant="outline" onClick={() => window.print()}>Download Receipt</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
            {/* Invoice Summary */}
            <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-primary">Security 360</span>
                </div>

                <Card className="shadow-md border-0 bg-white/80 backdrop-blur">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardDescription>Invoice for</CardDescription>
                                <CardTitle className="text-xl">{INVOICE.customer}</CardTitle>
                            </div>
                            <Badge variant="secondary" className="text-xs uppercase">{INVOICE.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Due Date: {INVOICE.dueDate}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {INVOICE.services.map((service, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span>{service.name}</span>
                                    <span className="font-medium text-muted-foreground">{formatCurrency(service.amount)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Fencing Breakdown */}
                        {INVOICE.fencingDetails && (
                            <div className="mt-4 border rounded-md overflow-hidden transition-all duration-300">
                                <button
                                    className="w-full flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/50 text-xs font-bold"
                                    onClick={() => setShowFenceDetails(!showFenceDetails)}
                                >
                                    <span>VIEW FENCE DETAILS</span>
                                    {showFenceDetails ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>
                                {showFenceDetails && (
                                    <div className="p-3 bg-white border-t space-y-3 animate-in slide-in-from-top-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Material Type</span>
                                            <span className="font-medium">{INVOICE.fencingDetails.type}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Total Length</span>
                                            <span className="font-medium">{INVOICE.fencingDetails.length}m</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Height</span>
                                            <span className="font-medium">{INVOICE.fencingDetails.height}</span>
                                        </div>
                                        <div className="space-y-1.5 pt-2 border-t">
                                            <span className="text-[10px] text-muted-foreground font-bold">ADD-ONS</span>
                                            {INVOICE.fencingDetails.addons.map((addon, i) => (
                                                <div key={i} className="flex justify-between text-[11px]">
                                                    <span className="flex items-center gap-1"><ShieldAlert className="h-3 w-3 text-destructive" /> {addon.name}</span>
                                                    <span>{formatCurrency(addon.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-2 bg-primary/5 rounded border border-primary/10 flex items-start gap-2 text-[10px] text-primary">
                                            <Info className="h-3 w-3 mt-0.5 shrink-0" />
                                            <p>All materials are industry-standard and include professional installation.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="border-t pt-4 flex justify-between items-center">
                            <span className="font-semibold">Total Due</span>
                            <span className="text-2xl font-bold text-primary">{formatCurrency(INVOICE.total)}</span>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Secure SSL Encryption</span>
                </div>
            </div>

            {/* Payment Form */}
            <Card className="shadow-lg h-fit">
                <CardHeader>
                    <CardTitle>Pay Invoice</CardTitle>
                    <CardDescription>Select a payment method to proceed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Payment Method Selector */}
                    <div className="grid grid-cols-2 gap-4">
                        <div
                            className={cn(
                                "cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-all",
                                paymentMethod === "mpesa" ? "border-primary bg-primary/5" : "border-muted"
                            )}
                            onClick={() => setPaymentMethod("mpesa")}
                        >
                            <Smartphone className={cn("h-6 w-6", paymentMethod === "mpesa" ? "text-primary" : "text-muted-foreground")} />
                            <span className={cn("font-medium text-sm", paymentMethod === "mpesa" ? "text-primary" : "text-muted-foreground")}>M-Pesa</span>
                        </div>
                        <div
                            className={cn(
                                "cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-all",
                                paymentMethod === "card" ? "border-primary bg-primary/5" : "border-muted"
                            )}
                            onClick={() => setPaymentMethod("card")}
                        >
                            <CreditCard className={cn("h-6 w-6", paymentMethod === "card" ? "text-primary" : "text-muted-foreground")} />
                            <span className={cn("font-medium text-sm", paymentMethod === "card" ? "text-primary" : "text-muted-foreground")}>Card</span>
                        </div>
                    </div>

                    {/* Mobile Money Input */}
                    {paymentMethod === "mpesa" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-medium">Phone Number</label>
                            <Input
                                placeholder="07XX XXX XXX"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">You will receive an M-Pesa prompt on this number.</p>
                        </div>
                    )}

                    {/* Card Inputs Placeholder */}
                    {paymentMethod === "card" && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Card Number</label>
                                <Input placeholder="XXXX XXXX XXXX XXXX" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Expiry</label>
                                    <Input placeholder="MM/YY" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">CVC</label>
                                    <Input placeholder="123" />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full h-11 text-lg"
                        onClick={handlePayment}
                        disabled={paymentStatus === "processing"}
                    >
                        {paymentStatus === "processing" ? "Processing..." : `Pay ${formatCurrency(INVOICE.total)}`}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
