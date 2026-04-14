import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
    title: 'StoryShelf - Bookstore',
    description: 'Inventory Tracking & E-Commerce',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[#f4f5f2] text-[#2f3e46] antialiased">
                <Header />

                <main className="flex-1">{children}</main>

                <footer className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-[#52796f] md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="font-semibold text-[#2f3e46]">StoryShelf</p>
                        <p>Inventory Tracking & E-Commerce</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Link href="/books">Books</Link>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                        <Link href="/employee/dashboard">Employee Area</Link>
                    </div>
                </footer>
            </body>
        </html>
    );
}
