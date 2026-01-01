"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Search, Book, FileQuestion, GraduationCap, Shield, ExternalLink, ChevronRight } from "lucide-react"

export default function HelpPage() {
    const articles = [
        { title: "Onboarding New Clients", category: "Operations", time: "5 min read" },
        { title: "Handling Failed M-Pesa Transactions", category: "Accountancy", time: "8 min read" },
        { title: "Guard Deployment SOPs", category: "Security", time: "12 min read" },
        { title: "VAT & Tax Filing Guide", category: "Compliance", time: "15 min read" },
    ]

    return (
        <div className="space-y-6 max-w-5xl">
            <div className="text-center space-y-4 py-8 bg-primary rounded-2xl text-primary-foreground mb-8">
                <h2 className="text-3xl font-bold">Staff Knowledge Base</h2>
                <p className="opacity-80">Documentation and SOPs for the Security 360 Team.</p>
                <div className="max-w-xl mx-auto px-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                        <Input
                            placeholder="Search procedures, guides, and docs..."
                            className="pl-11 h-12 bg-white text-slate-900 border-none shadow-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:border-primary transition-colors cursor-pointer group">
                    <CardHeader>
                        <Shield className="h-8 w-8 text-primary mb-2" />
                        <CardTitle>Standard Orders</CardTitle>
                        <CardDescription>Security policies and patrol protocols.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-primary text-sm flex items-center gap-1 font-medium group-hover:underline">
                        View SOPs <ChevronRight className="h-4 w-4" />
                    </CardContent>
                </Card>
                <Card className="hover:border-primary transition-colors cursor-pointer group">
                    <CardHeader>
                        <Book className="h-8 w-8 text-blue-600 mb-2" />
                        <CardTitle>Admin Guides</CardTitle>
                        <CardDescription>How to use the Business Arena platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-primary text-sm flex items-center gap-1 font-medium group-hover:underline">
                        Open Library <ChevronRight className="h-4 w-4" />
                    </CardContent>
                </Card>
                <Card className="hover:border-primary transition-colors cursor-pointer group">
                    <CardHeader>
                        <GraduationCap className="h-8 w-8 text-amber-600 mb-2" />
                        <CardTitle>Training Material</CardTitle>
                        <CardDescription>Video courses and certification tests.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-primary text-sm flex items-center gap-1 font-medium group-hover:underline">
                        Start Learning <ChevronRight className="h-4 w-4" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileQuestion className="h-5 w-5" /> Recent Articles
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {articles.map((art, i) => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                                <div className="space-y-1">
                                    <div className="font-medium text-slate-900">{art.title}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span>{art.category}</span>
                                        <span>•</span>
                                        <span>{art.time}</span>
                                    </div>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
