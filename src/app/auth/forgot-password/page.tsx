"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"

export default function ForgotPasswordPage() {
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center mb-2">
                        <ShieldCheck className="h-10 w-10 text-primary opacity-20" />
                    </div>
                    <CardTitle className="text-xl font-bold">Account Recovery</CardTitle>
                    <CardDescription>
                        {submitted
                            ? "Check your email for reset instructions."
                            : "Enter your email to receive a password reset link."}
                    </CardDescription>
                </CardHeader>

                {submitted ? (
                    <CardContent className="space-y-6 text-center animate-in fade-in">
                        <div className="mx-auto bg-green-50 p-3 rounded-full w-fit">
                            <CheckCircle2 className="h-12 w-12 text-green-600" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            If an account exists for that email, we have sent password reset instructions.
                        </p>
                        <Link href="/auth/login">
                            <Button variant="outline" className="w-full">Return to Login</Button>
                        </Link>
                    </CardContent>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="email">Email Address</label>
                                <Input id="email" type="email" placeholder="name@company.com" required className="h-11" />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                            <Button className="w-full h-11" type="submit">Send Reset Link</Button>
                            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                            </Link>
                        </CardFooter>
                    </form>
                )}
            </Card>
        </div>
    )
}
