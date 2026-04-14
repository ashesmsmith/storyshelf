'use client';

import { useEffect, useState } from 'react';
import BookImage from '@/components/BookImage';
import { PaymentStatus, OrderStatus } from '@prisma/client';

type OrderItem = {
    id: number;
    quantity: number;
    price: number;
    book: {
        id: number;
        title: string;
        imageURL?: string | null;
    };
};

type Order = {
    id: number;
    total: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    items: OrderItem[];
};

export default function CheckoutSuccessPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const orderId = new URLSearchParams(window.location.search).get('orderId');

        if (!orderId) {
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}`);

                if (!res.ok) {
                    console.error('Failed to fetch order');
                    setOrder(null);
                    return;
                }

                const data = await res.json();
                setOrder(data.order);
            } catch (err) {
                console.error('Error fetching order:', err);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!order) return <p className="p-6">Order not found</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold">Order Confirmed 🎉</h1>

            <p>Order ID: {order.id}</p>

            <p>Payment Status: {order.paymentStatus === PaymentStatus.PAID ? 'Paid' : 'Pending'}</p>

            <div className="mt-6 space-y-4">
                {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 border p-4 rounded">
                        <BookImage
                            src={item.book.imageURL || ''}
                            alt={item.book.title}
                            className="w-24 h-32 object-cover"
                        />
                        <div>
                            <h2>{item.book.title}</h2>
                            <p>Qty: {item.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 font-bold text-right">Total: ${order.total.toFixed(2)}</div>
        </div>
    );
}
