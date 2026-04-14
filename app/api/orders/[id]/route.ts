import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/utils/getCurrentUser';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const orderId = Number(id);

        if (isNaN(orderId)) {
            return NextResponse.json({ error: 'Invalid Order ID' }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id,
            },
            include: {
                items: { include: { book: true } },
            },
        });

        if (!order) {
            return NextResponse.json({ error: 'Order Not Found' }, { status: 404 });
        }

        return NextResponse.json({ order });
    } catch (err) {
        console.error('GET /api/orders/[id] failed: ', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
