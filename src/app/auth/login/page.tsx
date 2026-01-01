"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck, Eye, EyeOff, Loader2, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { useAuth } from "@/components/providers/AuthProvider"
import { loginAction } from "@/lib/actions/auth"

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [formData, setFormData] = useState({ username: "", password: "" })

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await loginAction(formData)
            if (result.success) {
                login(result.data, result.data.token)
            } else {
                setError(result.error || "Authentication failed. Please check your credentials.")
            }
        } catch (err) {
            setError("A network error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-primary/20 to-slate-900">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

            <Card className="w-full max-w-md bg-background/60 backdrop-blur-xl border-white/10 shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500">
                <CardHeader className="text-center space-y-2 pt-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary shadow-lg shadow-primary/40 p-4 rounded-2xl transform hover:scale-110 transition-transform">
                            <ShieldCheck className="h-10 w-10 text-black" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-black">Security 360</CardTitle>
                    <CardDescription className="text-slate-800 font-medium">Enterprise Payment System</CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-6 px-8">
                        {error && (
                            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1" htmlFor="username">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                                <Input
                                    id="username"
                                    placeholder="Enter your handle"
                                    className="h-11 pl-10 bg-black/20 border-white/5 focus:border-primary/50 text-black placeholder:text-slate-600 focus:ring-primary/20 transition-all"
                                    required
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400" htmlFor="password">Password</label>
                                <Link href="/auth/forgot-password">
                                    <span className="text-[10px] text-primary hover:text-primary/80 transition-colors font-bold uppercase tracking-tighter">Forgot Secret?</span>
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="h-11 pl-10 pr-10 bg-black/20 border-white/5 focus:border-primary/50 text-black placeholder:text-slate-600 focus:ring-primary/20 transition-all"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-slate-500 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="px-8 pb-10 pt-4">
                        <Button className="w-full h-12 text-base font-bold bg-primary hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying Identity...
                                </>
                            ) : (
                                "Execute Login"
                            )}
                        </Button>
                    </CardFooter>
                </form>

                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm opacity-50" />
            </Card>

            <div className="absolute bottom-8 text-center text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium pointer-events-none">
                Protocol v2.4 // Hardware Encrypted // Distributed Ledger
            </div>
        </div>
    )
}
