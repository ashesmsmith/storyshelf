import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '6');

        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
            },
            take: limit,
            orderBy: {
                name: 'asc',
            },
        });

        return new Response(JSON.stringify(categories), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return new Response(JSON.stringify([]), { status: 500 });
    }
}
