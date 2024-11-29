import { NextRequest, NextResponse } from 'next/server';
import { AddressRepository } from '@/infrastructure/repositories/AddressRepository';
import { Address } from '@/domain/entities/Address';

const addressRepository = new AddressRepository();

// Handle GET requests for fetching user addresses
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const userId = parseInt(id, 10);
        const addresses = await addressRepository.findByUserId(userId); // Fetch addresses by user ID

        return NextResponse.json({
            data: addresses,
            message: "Address received successfully"
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch addresses' },
            { status: 400 }
        );
    }
}
