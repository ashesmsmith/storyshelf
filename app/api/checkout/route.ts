// IMPORTANT
// Cart = OrderStatus PENDING + PaymentStatus PENDING
// Checkout Order = OrderStatus PROCESSING + PaymentStatus PENDING
// Paid Order = OrderStatus PROCESSING + PaymentStatus PAID

import { NextRequest, NextResponse } from 'next/server';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { recalcOrderTotals } from '@/lib/utils/order';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const form = await req.json();
        const { orderId } = form;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const { order } = await prisma.$transaction(async (tx) => {
            const cartOrder = await tx.order.findFirst({
                where: {
                    userId: user.id,
                    status: OrderStatus.PENDING,
                    paymentStatus: PaymentStatus.PENDING,
                },
            });

            if (!cartOrder) {
                throw new Error('Cart is Empty');
            }

            const cartItems = await tx.orderItem.findMany({
                where: { orderId: cartOrder.id },
                include: { book: true },
            });

            if (!cartItems.length) {
                throw new Error('Cart is Empty');
            }

            const totals = await recalcOrderTotals(cartOrder.id);

            const order = await tx.order.update({
                where: { id: cartOrder.id },
                data: {
                    status: OrderStatus.PROCESSING,
                    paymentStatus: PaymentStatus.PENDING,
                    ...totals,
                    shippingFirstName: form.firstName,
                    shippingLastName: form.lastName,
                    shippingStreet: form.street,
                    shippingCity: form.city,
                    shippingState: form.state,
                    shippingZip: form.zip,
                    shippingCountry: form.country,
                },
            });

            return { order };
        });

        return NextResponse.json({
            orderId: order.id,
        });
    } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : 'Checkout failed';
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
