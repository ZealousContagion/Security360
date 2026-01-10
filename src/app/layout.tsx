import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider, UserButton } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Security 360 Pay',
    description: 'Fencing Quotes & Management',
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
