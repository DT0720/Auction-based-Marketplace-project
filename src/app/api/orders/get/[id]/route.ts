// src/app/api/orders/get/[id]/route.ts

import { IOrderRepository } from '@/application/repositories/IOrderRepository';
import { OrderRepository } from '@/infrastructure/repositories/OrderRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const orderRespository : IOrderRepository = new OrderRepository();

    try {
        const { id } = await context.params;

        const buyerId = parseInt(id, 10);

        if (isNaN(buyerId)) {
          return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
        }

        const order = await orderRespository.getByBuyerId(buyerId);

        if (!order) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product found successfully', data: order }, { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
