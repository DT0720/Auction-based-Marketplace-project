import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { AddressRepository } from '@/infrastructure/repositories/AddressRepository';
import { Address } from '@/domain/entities/Address';

const addressRepository = new AddressRepository();

// Create a new address
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const newAddress = await addressRepository.create(body as Address);

        return NextResponse.json(
            { message: 'Address created successfully', data: newAddress },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to create address' },
            { status: 400 }
        );
    }
}

// Update an existing address
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const success = await addressRepository.update(body as Address);

        return NextResponse.json(
            { message: success ? 'Address updated successfully' : 'Failed to update address' },
            { status: success ? 200 : 400 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to update address' },
            { status: 400 }
        );
    }
}
/**
 * Handles DELETE requests to delete an address
 * @async
 * @function DELETE
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object containing the result of the operation
 */

// Delete an address
export async function DELETE(req: Request) {
    const { id } = await req.json();

    try {
        const url = new URL(req.url);
        const addressId = Number(url.searchParams.get('id'));

        if (!addressId) throw new Error('Address ID is required');

        const success = await addressRepository.delete(addressId);

        return NextResponse.json(
            { message: success ? 'Address deleted successfully' : 'Failed to delete address' },
            { status: success ? 200 : 400 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
}

