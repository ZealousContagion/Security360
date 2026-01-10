'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Bug, Copy, Check } from "lucide-react";

export function DiagnosticHelper() {
    const [copied, setCopied] = useState(false);

    const copyDiagnostics = () => {
        const diagnostics = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            resolution: `${window.innerWidth}x${window.innerHeight}`,
            version: 'S360 Kernel v2.4'
        };

        navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    return (
        <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4 shadow-2xl border border-white/5">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Bug className="w-4 h-4 text-black" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Technical Diagnostics</h4>
                    <p className="text-[8px] text-slate-400 uppercase font-bold">Help us troubleshoot faster</p>
                </div>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-300 uppercase font-medium">
                If you are experiencing a technical bug, click below to copy system debug data to your clipboard and attach it to your support ticket.
            </p>
            <Button 
                variant="outline" 
                onClick={copyDiagnostics}
                className="w-full h-10 border-white/10 text-white hover:bg-white/5 text-[9px] uppercase font-black tracking-widest"
            >
                {copied ? <><Check className="w-3 h-3 mr-2 text-primary" /> Copied!</> : <><Copy className="w-3 h-3 mr-2" /> Copy Debug Info</>}
            </Button>
        </div>
    );
}
