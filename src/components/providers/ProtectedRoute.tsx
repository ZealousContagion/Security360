"use client"

import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user && !pathname.includes("/auth")) {
            router.push("/auth/login");
        }
    }, [user, isLoading, router, pathname]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-slate-950">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-slate-400 font-medium animate-pulse">Establishing Secure Session...</p>
            </div>
        );
    }

    if (!user && !pathname.includes("/auth")) {
        return null;
    }

    return <>{children}</>;
}
