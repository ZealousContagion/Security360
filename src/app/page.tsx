import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white text-black p-6">
            <div className="max-w-2xl w-full text-center space-y-8">
                <div className="space-y-2">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">Fencing Management</h2>
                    <h1 className="text-6xl font-black tracking-tighter uppercase">Security 360</h1>
                </div>
                
                <p className="text-lg text-muted-foreground font-light leading-relaxed max-w-md mx-auto">
                    The modern standard for fencing quotes and automated invoice management.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                    <Link href="/sign-in" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-48 h-12 text-sm uppercase tracking-widest font-bold">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="/sign-up" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-48 h-12 text-sm uppercase tracking-widest border-black hover:bg-black hover:text-white transition-all">
                            Register
                        </Button>
                    </Link>
                </div>
            </div>
            
            <footer className="absolute bottom-10 text-[10px] uppercase tracking-widest text-muted-foreground">
                &copy; 2026 Security 360 Pay. All Rights Reserved.
            </footer>
        </main>
    );
}
