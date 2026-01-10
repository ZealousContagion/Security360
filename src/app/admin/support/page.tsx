import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";

export default function SupportPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase">Support</h1>
                <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-bold mt-1">Get help and contact our team</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Email Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground">Response time usually within 24 hours.</p>
                        <Button variant="outline" className="w-full text-[10px] uppercase tracking-[0.2em] font-bold h-9">Send Email</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Live Chat
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground">Available Monday to Friday, 9am - 5pm.</p>
                        <Button className="w-full text-[10px] uppercase tracking-[0.2em] font-bold h-9">Start Chat</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            Emergency Hotline
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground">For critical system outages only.</p>
                        <p className="text-lg font-bold tracking-tighter">+44 (0) 800 360 360</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm uppercase tracking-widest font-bold flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-primary" />
                            Knowledge Base
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-xs text-muted-foreground">Browse guides and documentation.</p>
                        <Button variant="outline" className="w-full text-[10px] uppercase tracking-[0.2em] font-bold h-9">View Docs</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
