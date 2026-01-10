import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, MessageSquare, Phone, MessageCircle, ExternalLink, LifeBuoy } from "lucide-react";
import { SupportTicketForm } from "./SupportTicketForm";
import { SupportFAQ } from "./SupportFAQ";
import { DiagnosticHelper } from "./DiagnosticHelper";

export default function SupportPage() {
    return (
        <div className="space-y-8 pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase text-black">Support & Intelligence</h1>
                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Get technical assistance and operational guidance</p>
                </div>
                <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-2xl shrink-0">
                    <LifeBuoy className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Tickets & Contact */}
                <div className="lg:col-span-2 space-y-8">
                    <SupportTicketForm />
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4 text-green-500" />
                                    WhatsApp Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">Direct line to our technical dispatch team for immediate help.</p>
                                <a href="https://wa.me/263771234567" target="_blank" rel="noopener noreferrer" className="block">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-[10px] font-black uppercase tracking-widest h-10 shadow-lg shadow-green-600/20">
                                        Open WhatsApp
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-primary" />
                                    Emergency Hotline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-muted-foreground uppercase font-bold tracking-tight">For critical system outages or security fencing breaches.</p>
                                <div className="p-3 bg-accent/30 rounded-lg text-center border border-black/5">
                                    <p className="text-lg font-black tracking-tighter text-black">+263 242 123 456</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Right Column: FAQ & Diagnostics */}
                <div className="space-y-8">
                    <SupportFAQ />
                    
                    <DiagnosticHelper />

                    <Card className="bg-black text-white border-none shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <ExternalLink className="w-3 h-3" />
                                Resource Portal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="ghost" className="w-full justify-between text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5 rounded-none px-0 h-10">
                                User Training Manual
                                <ExternalLink className="w-3 h-3 text-primary" />
                            </Button>
                            <Button variant="ghost" className="w-full justify-between text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5 rounded-none px-0 h-10">
                                Video Tutorials
                                <ExternalLink className="w-3 h-3 text-primary" />
                            </Button>
                            <Button variant="ghost" className="w-full justify-between text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5 border-b border-white/5 rounded-none px-0 h-10">
                                Feature Roadmap
                                <ExternalLink className="w-3 h-3 text-primary" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}