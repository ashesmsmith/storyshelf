'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { emitCartUpdate } from '@/lib/utils/cartEvents';

type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    imageURL?: string | null;
    inventory?: { quantity: number };
    categories?: {
        category: {
            name: string;
            slug: string;
        };
    }[];
};

type Category = {
    id: number;
    name: string;
    slug: string;
};

export default function BooksClient() {
    const params = useSearchParams();
    const router = useRouter();

    const search = params.get('search') || '';
    const category = params.get('category') || '';

    const [books, setBooks] = useState<Book[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [quantities, setQuantities] = useState<Record<number, number>>({});
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    const [query, setQuery] = useState(search);

    // Reset page to 1 if search or category changes
    useEffect(() => {
        setPage(1);
    }, [search, category]);

    // Fetch Books
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);

            try {
                const query = new URLSearchParams();

                if (search) query.append('search', search);
                if (category) query.append('category', category);

                query.append('page', page.toString());
                query.append('limit', '12');

                const res = await fetch(`/api/books?${query.toString()}`);
                const data = await res.json();

                setBooks(data.items || []);
                setHasNextPage(data.hasNextPage);
            } catch (err) {
                console.error(err);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [search, category, page]);

    // Fetch Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories?limit=15');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Update URL with new search/category
    const updateURL = (updates: Record<string, string>) => {
        const url = new URLSearchParams(params.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) url.set(key, value);
            else url.delete(key);
        });

        router.push(`/books?${url.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateURL({ search: query });
    };

    // Add to Cart Handler
    const addToCart = async (bookId: number, quantity = 1) => {
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, quantity }),
            });

            if (res.status === 401) {
                router.push('/login');
                return;
            }

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || 'Failed to add to cart');
                return;
            }

            emitCartUpdate();
            alert('Added to cart!');
        } catch (err) {
            console.error(err);
            alert('Something went wrong');
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <h1 className="text-3xl font-bold text-[#2f3e46]">
                {category ? `Category: ${category}` : 'All Books'}
            </h1>

            {/* Search & Filter */}
            <form onSubmit={handleSearch} className="mt-6 flex gap-3">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search books..."
                    className="w-full rounded-xl border px-4 py-3"
                />
                <button className="bg-[#2f3e46] text-white px-6 rounded-xl">Search</button>
            </form>

            {/* Categories */}
            {!loadingCategories && categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => updateURL({ category: '' })}
                        className={!category ? 'font-bold' : ''}
                    >
                        All
                    </button>

                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateURL({ category: cat.slug })}
                            className={category === cat.slug ? 'font-bold' : ''}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}

            {/*States*/}
            {loading && <p className="mt-6 text-[#52796f]">Loading books...</p>}
            {!loading && books.length === 0 && (
                <p className="mt-6 text-[#52796f]">No books found.</p>
            )}

            {/* Book Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {books.map((book) => {
                    const qty = quantities[book.id] || 1;
                    const stock = book.inventory?.quantity ?? 0;
                    const outOfStock = stock <= 0;

                    {
                        /* Book Card */
                    }
                    return (
                        <div
                            key={book.id}
                            className="overflow-hidden rounded-3xl border border-[#cad2c5] bg-white shadow-sm hover:shadow-md transition"
                        >
                            {/* IMAGE */}
                            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#84A98C] to-[#354F52] text-lg font-semibold text-white overflow-hidden">
                                {book.imageURL ? (
                                    <Image
                                        src={book.imageURL}
                                        alt={book.title}
                                        width={150}
                                        height={150}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>Missing Cover Image</span>
                                )}
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-semibold">{book.title}</h3>
                                <p className="text-sm text-[#52796f]">{book.author}</p>
                                <p className="mt-2 font-semibold">${book.price.toFixed(2)}</p>
                                <p className="text-sm">Stock: {stock}</p>

                                {/* Quantity Selector */}
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() =>
                                            setQuantities((prev) => ({
                                                ...prev,
                                                [book.id]: Math.max(qty - 1, 1),
                                            }))
                                        }
                                    >
                                        -
                                    </button>

                                    <span>{qty}</span>

                                    <button
                                        onClick={() =>
                                            setQuantities((prev) => ({
                                                ...prev,
                                                [book.id]: qty + 1,
                                            }))
                                        }
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    disabled={outOfStock}
                                    onClick={() => addToCart(book.id, qty)}
                                    className={`mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold text-white
                                        ${
                                            outOfStock
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-[#2f3e46] hover:opacity-90'
                                        }`}
                                >
                                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div className="mt-10 flex items-center justify-center gap-4">
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="rounded-lg border px-4 py-2 disabled:opacity-50"
                >
                    Previous
                </button>

                <span className="text-sm text-gray-600">Page {page}</span>

                <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNextPage}
                    className={`rounded-lg border px-4 py-2 ${
                        !hasNextPage ? 'disabled:opacity-50' : ''
                    }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
