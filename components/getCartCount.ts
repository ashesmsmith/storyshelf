import prisma from '@/lib/prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function getCartCount(userId: number): Promise<number> {
    const items = await prisma.orderItem.findMany({
        where: {
            order: {
                userId,
                status: OrderStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
            },
        },
        select: {
            quantity: true,
        },
    });

    return items.reduce((sum, item) => sum + item.quantity, 0);
}
