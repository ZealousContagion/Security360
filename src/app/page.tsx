import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 lg:px-10 h-16 flex items-center border-b">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Security 360 Fencing</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Services</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">About</Link>
          <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">Contact</Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-8 bg-white dark:bg-zinc-950">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
            Professional Security Services <br className="hidden sm:inline" /> Payment Portal
          </h1>
          <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
            Secure, fast, and reliable payments for all your security and guarding services. Manage invoices and track payments with ease.
          </p>
        </div>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/pay/INV-2025-001">
            <Button size="lg" className="w-full sm:w-auto text-lg bg-white h-12 px-8">
              Pay an Invoice <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/admin/dashboard">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg bg-yellow-500 h-12 px-8">
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </main>
      <footer className="py-6 border-t text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Security 360. All rights reserved.
      </footer>
    </div>
  );
}
