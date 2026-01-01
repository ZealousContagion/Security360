import { Footer } from "@/components/layout/Footer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/30">
            <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}
