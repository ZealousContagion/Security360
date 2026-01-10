'use client';

import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './ui/Button';
import { Trash2, Check } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signatureData: string) => void;
}

export function SignaturePad({ onSave }: SignaturePadProps) {
    const sigCanvas = useRef<SignatureCanvas>(null);

    const clear = () => {
        sigCanvas.current?.clear();
    };

    const save = () => {
        if (sigCanvas.current?.isEmpty()) {
            alert("Please provide a signature first.");
            return;
        }
        const data = sigCanvas.current?.getTrimmedCanvas().toDataURL('image/png');
        if (data) {
            onSave(data);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-muted rounded-lg bg-white overflow-hidden">
                <SignatureCanvas 
                    ref={sigCanvas}
                    penColor='black'
                    canvasProps={{
                        className: "signature-canvas w-full h-48 cursor-crosshair"
                    }}
                />
            </div>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    onClick={clear}
                    className="flex-1 text-[10px] uppercase font-black"
                >
                    <Trash2 className="w-3 h-3 mr-2" />
                    Clear
                </Button>
                <Button 
                    onClick={save}
                    className="flex-1 text-[10px] uppercase font-black bg-black text-white hover:bg-black/90"
                >
                    <Check className="w-3 h-3 mr-2 text-primary" />
                    Confirm Signature
                </Button>
            </div>
        </div>
    );
}
