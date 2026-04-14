'use client';

import Link from 'next/link';
import Image from 'next/image';
import LogoutButton from './LogoutButton';
import { useEffect, useState } from 'react';
import { CART_UPDATED_EVENT } from '@/lib/utils/cartEvents';

type User = {
    firstName: string;
    role: string;
};

export default function HeaderClient({ user }: { user: User | null }) {
    const [cartCount, setCartCount] = useState(0);

    const fetchCart = async () => {
        try {
            const res = await fetch('/api/cart', {
                cache: 'no-store',
            });

            if (res.status === 401) {
                setCartCount(0);
                return;
            }

            if (!res.ok) return;

            const data = await res.json();

            setCartCount(data.totalItems || 0);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCart();
        };

        init();

        const handler = () => fetchCart();

        window.addEventListener(CART_UPDATED_EVENT, handler);

        return () => {
            window.removeEventListener(CART_UPDATED_EVENT, handler);
        };
    }, [user]);

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6">
            <Link href="/" scroll={false}>
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="StoryShelf logo" width={180} height={60} priority />
                </div>
            </Link>

            <nav className="hidden gap-8 text-sm font-medium md:flex">
                <Link href="/">Home</Link>
                <Link href="/#categories">Categories</Link>
                <Link href="/#featured">Featured</Link>
            </nav>

            <div className="hidden items-center gap-4 md:flex">
                <Link href="/cart" className="relative text-2xl">
                    🛒
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {user ? (
                    <>
                        <Link
                            href={user.role.toUpperCase() === 'EMPLOYEE' ? '/employee/dashboard' : '/account'}
                            className="text-sm text-[#52796f] hover:underline"
                        >
                            Hi, {user.firstName}
                        </Link>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <Link href="/login">Sign In</Link>
                        <Link href="/register">Create Account</Link>
                    </>
                )}
            </div>
        </header>
    );
}
