'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Order = {
    id: number;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
};

export default function OrdersSection() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data || []);
            setLoading(false);
        };

        fetchOrders();
    }, []);

    return (
        <section>
            <h2 className="mb-6 text-2xl font-bold">Order History</h2>

            {loading ? (
                <p>Loading orders...</p>
            ) : orders.length === 0 ? (
                <div className="rounded-3xl border border-[#cad2c5] bg-white p-6 shadow-sm">
                    <p className="text-[#52796f]">No orders yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/account/orders/${order.id}`}
                            className="flex justify-between rounded-3xl border border-[#cad2c5] bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1"
                        >
                            <div>
                                <p className="font-semibold">Order #{order.id}</p>
                                <p className="text-sm text-[#52796f]">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-bold">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(order.total)}
                                </p>
                                <p className="text-sm text-[#52796f]">
                                    {order.status} • {order.paymentStatus}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
