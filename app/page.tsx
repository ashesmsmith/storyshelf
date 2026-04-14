'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { emitCartUpdate } from '@/lib/utils/cartEvents';

type Category = {
    id: number;
    name: string;
    slug: string;
};

const categories: Category[] = [
    { id: 1, name: 'Fiction', slug: 'fiction' },
    { id: 2, name: 'Romance', slug: 'romance' },
    { id: 3, name: 'Mystery', slug: 'mystery' },
    { id: 4, name: 'Fantasy', slug: 'fantasy' },
    { id: 5, name: 'Self-Help', slug: 'self-help' },
    { id: 6, name: 'Children', slug: 'children' },
];

type FeaturedBook = {
    id: number;
    title: string;
    author: string;
    price: number;
    imageURL?: string | null;
    coverImageUrl?: string | null;
    inventory?: { quantity: number };
    categories?: {
        category: {
            name: string;
        };
    }[];
};

export default function Home() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [featuredBooks, setFeaturedBooks] = useState<FeaturedBook[]>([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmed = search.trim();

        if (!trimmed) return;

        router.push(`/books?search=${encodeURIComponent(trimmed)}`);
    };
    const categoryStyles: Record<string, { icon: string; bg: string; hover: string }> = {
        fiction: { icon: '📖', bg: 'bg-[#f1f5f4]', hover: 'hover:bg-[#84A98C]' },
        romance: { icon: '❤️', bg: 'bg-[#f1f5f4]', hover: 'hover:bg-[#e5989b]' },
        mystery: { icon: '🔍', bg: 'bg-[#f1f5f4]', hover: 'hover:bg-[#577590]' },
        fantasy: { icon: '🧙', bg: 'bg-[#f1f5f4]', hover: 'hover:bg-[#6d597a]' },
        'self-help': { icon: '💡', bg: 'bg-[#f1f5f4]', hover: 'hover:bg-[#dda15e]' },
        children: { icon: '🧸', bg: 'bg-[#f1f5f4]', hover: 'hover:bg-[#90be6d]' },
    };

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/books?isFeatured=true&limit=4');
                const data = await res.json();
                setFeaturedBooks(data.items || []);
            } catch (err) {
                console.error('Error fetching featured books:', err);
                setFeaturedBooks([]);
            } finally {
                setLoadingFeatured(false);
            }
        };

        fetchFeatured();
    }, []);

    return (
        <main>
            <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:items-center md:py-20">
                <div>
                    <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                        Online Bookstore Experience
                    </span>

                    <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight md:text-6xl">
                        A world of books, one place.
                        <span className="block text-[#52796f]">
                            {' '}
                            Explore stories that stay with you.
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-8 text-[#52796f]">
                        Discover stories you will never forget.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/books"
                            className="rounded-full bg-[#2f3e46] px-6 py-3 text-center font-semibold text-white transition hover:opacity-90"
                        >
                            Browse Books
                        </Link>
                    </div>
                </div>

                <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-lg">
                    <div className="rounded-2xl bg-[#edf1eb] p-5">
                        <p className="text-sm font-semibold text-[#354f52]">Quick Search</p>

                        <form
                            onSubmit={handleSearch}
                            className="mt-4 flex flex-col gap-3 sm:flex-row"
                        >
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, author, or ISBN"
                                className="w-full rounded-xl border border-[#cad2c5] bg-white px-4 py-3 outline-none transition focus:border-[#52796f]"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-[#52796f] px-5 py-3 font-semibold text-white transition hover:opacity-90"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <section id="categories" className="mx-auto max-w-7xl px-6 py-8 md:py-14">
                <div className="mb-8">
                    <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                        Categories
                    </span>
                    <h2 className="mt-4 text-3xl font-bold">Explore by genre</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/books?category=${category.slug}`}
                            className={`group rounded-2xl border border-[#cad2c5] px-4 py-6 text-center shadow-sm transition-all duration-500 ease-out
                                ${categoryStyles[category.slug]?.bg}
                                ${categoryStyles[category.slug]?.hover}
                                hover:-translate-y-2 hover:text-white
                                opacity-0 translate-y-6 animate-fadeUp`}
                            style={{
                                animationDelay: `${category.id * 0.08}s`,
                                animationFillMode: 'forwards',
                            }}
                        >
                            <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
                                {categoryStyles[category.slug]?.icon}
                            </div>

                            <p className="mt-3 font-semibold">{category.name}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ==================== SECCIÓN FEATURED BOOKS (CON DATOS REALES) ==================== */}
            <section id="featured" className="mx-auto max-w-7xl px-6 py-8 md:py-14">
                <div className="mb-8">
                    <span className="inline-flex rounded-full border border-[#84A98C]/30 bg-[#84A98C]/20 px-4 py-2 text-sm font-semibold text-[#354f52]">
                        Featured Books
                    </span>
                    <h2 className="mt-4 text-3xl font-bold">Popular picks this week</h2>
                    <p className="mt-2 text-[#52796f]">
                        Descubre nuestras recomendaciones destacadas
                    </p>
                </div>

                {loadingFeatured ? (
                    <p className="text-[#52796f]">Loading featured books...</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                        {featuredBooks.map((book) => (
                            <article
                                key={book.id}
                                className="overflow-hidden rounded-3xl border border-[#cad2c5] bg-white shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#84A98C] to-[#354F52] text-lg font-semibold text-white overflow-hidden">
                                    {book.imageURL || book.coverImageUrl ? (
                                        <Image
                                            src={book.imageURL || book.coverImageUrl || ''}
                                            alt={book.title}
                                            width={220}
                                            height={220}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span>Missing Cover Image</span>
                                    )}
                                </div>

                                <div className="p-5">
                                    <p className="text-sm font-medium text-[#52796f]">
                                        {book.categories?.[0]?.category?.name || 'General'}
                                    </p>

                                    <h3 className="mt-1 text-xl font-semibold text-[#2f3e46] line-clamp-2">
                                        {book.title}
                                    </h3>

                                    <p className="mt-1 text-[#52796f]">{book.author}</p>

                                    <div className="mt-3 flex items-center justify-between text-sm">
                                        <span className="text-[#354f52]">
                                            Stock: {book.inventory?.quantity ?? 0}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 font-medium ${
                                                (book.inventory?.quantity ?? 0) > 0
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {(book.inventory?.quantity ?? 0) > 0
                                                ? 'Available'
                                                : 'Out of stock'}
                                        </span>
                                    </div>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="font-bold text-[#354f52]">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            }).format(book.price)}
                                        </span>

                                        <button
                                            onClick={async () => {
                                                const res = await fetch('/api/cart', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        bookId: book.id,
                                                        quantity: 1,
                                                    }),
                                                });

                                                if (res.status === 401) {
                                                    router.push('/login');
                                                    return;
                                                }

                                                if (!res.ok) {
                                                    alert('Failed to add to cart');
                                                    return;
                                                }

                                                emitCartUpdate();
                                                alert('Added to cart');
                                            }}
                                            disabled={(book.inventory?.quantity ?? 0) <= 0}
                                            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white
                                            ${
                                                (book.inventory?.quantity ?? 0) <= 0
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-[#2f3e46] hover:opacity-90'
                                            }`}
                                        >
                                            {(book.inventory?.quantity ?? 0) <= 0
                                                ? 'Out of Stock'
                                                : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="mx-auto max-w-7xl px-6 py-8 md:py-14">
                <div className="flex flex-col justify-between gap-6 rounded-3xl bg-gradient-to-r from-[#84A98C] to-[#52796f] p-8 text-white md:flex-row md:items-center">
                    <div>
                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                            Get Started
                        </span>
                        <h2 className="mt-4 text-3xl font-bold">
                            Your next great read is just a click away
                        </h2>
                        <p className="mt-2 max-w-2xl text-white/90">
                            Browse our collection, discover new favorites, and build your personal
                            library today.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/books"
                            className="rounded-full bg-white px-6 py-3 text-center font-semibold text-[#2f3e46]"
                        >
                            Shop Now
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-full border border-white px-6 py-3 text-center font-semibold text-white"
                        >
                            Staff Access
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
