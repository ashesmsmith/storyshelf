'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { emitCartUpdate } from '@/lib/utils/cartEvents';

export default function LoginPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Unable to sign in.');
                return;
            }

            emitCartUpdate();
            router.push(data.redirectTo || '/');
            router.refresh();
        } catch {
            setError('Unexpected error while signing in.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="mx-auto max-w-md px-6 py-12">
            <div className="mb-8">
                <p className="text-sm uppercase tracking-wide text-[#52796f]">StoryShelf Access</p>
                <h1 className="mt-2 text-3xl font-semibold">Sign In</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in with your customer or employee account.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                        className="w-full rounded-xl border border-[#cad2c5] px-4 py-3 outline-none transition focus:border-[#52796f]"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {error && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-[#354f52] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p className="mt-6 text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-[#52796f] underline">
                    Create one
                </Link>
            </p>
        </main>
    );
}
