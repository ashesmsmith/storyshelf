import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BookImage from '@/components/BookImage';

function getStatusColor(status: string) {
    switch (status) {
        case 'COMPLETED':
            return 'bg-green-100 text-green-700';
        case 'SHIPPED':
            return 'bg-blue-100 text-blue-700';
        case 'PROCESSING':
            return 'bg-yellow-100 text-yellow-700';
        case 'CANCELLED':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}

function getPaymentColor(status: string) {
    switch (status) {
        case 'PAID':
            return 'bg-green-100 text-green-700';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-700';
        case 'FAILED':
            return 'bg-red-100 text-red-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
}

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getCurrentUser();
    if (!user) return notFound();

    const { id } = await params;
    const orderId = parseInt(id);

    if (isNaN(orderId)) return notFound();

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            userId: user.id,
        },
        include: {
            items: {
                include: {
                    book: true,
                },
            },
        },
    });

    if (!order) return notFound();

    return (
        <main className="mx-auto max-w-5xl px-6 py-12">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Order #{order.id}</h1>
                <p className="text-[#52796f]">{new Date(order.createdAt).toLocaleDateString()}</p>
                <Link
                    href="/account"
                    className="mb-6 inline-block text-sm text-[#52796f] hover:underline"
                >
                    ← Back to Account
                </Link>
            </div>

            {/* STATUS */}
            <div className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <div className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                    <h2 className="mb-4 font-semibold">Status</h2>

                    <div className="flex flex-wrap gap-3">
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                order.status
                            )}`}
                        >
                            {order.status}
                        </span>

                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getPaymentColor(
                                order.paymentStatus
                            )}`}
                        >
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* SHIPPING */}
            <div className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">Shipping Address</h2>
                <p>
                    {order.shippingFirstName} {order.shippingLastName}
                </p>
                <p>{order.shippingStreet}</p>
                <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                </p>
                <p>{order.shippingCountry}</p>
            </div>

            {/* ITEMS */}
            <div className="mb-8 rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">Items</h2>

                <div className="space-y-4">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between border-b pb-4"
                        >
                            {/* LEFT: BOOK INFO */}
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-12 overflow-hidden rounded-md border bg-[#f4f5f2]">
                                    {item.book.imageURL ? (
                                        <BookImage
                                            src={item.book.imageURL}
                                            alt={item.book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-xs text-[#52796f]">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="font-medium">{item.book.title}</p>
                                    <p className="text-sm text-[#52796f]">Qty: {item.quantity}</p>
                                </div>
                            </div>

                            {/* RIGHT: PRICE */}
                            <p className="font-semibold">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(item.price * item.quantity)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* TOTALS */}
            <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                <h2 className="mb-4 font-semibold">Summary</h2>

                <div className="space-y-2 text-[#52796f]">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${order.shipping.toFixed(2)}</span>
                    </div>
                </div>

                <div className="mt-4 flex justify-between border-t pt-4 font-bold">
                    <span>Total</span>
                    <span>
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        }).format(order.total)}
                    </span>
                </div>
            </div>
        </main>
    );
}
