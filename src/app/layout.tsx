import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider, UserButton } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Security 360 Pay',
    description: 'Fencing Quotes & Management',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'S360 Pay',
    },
};

export const viewport: Viewport = {
    themeColor: '#FFB700',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider afterSignInUrl="/admin/dashboard" afterSignUpUrl="/admin/dashboard">
            <html lang="en">
                <body className={inter.className} suppressHydrationWarning>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
