import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { AddressRepository } from '@/infrastructure/repositories/AddressRepository';
import { Address } from '@/domain/entities/Address';

const userRepository = new UserRepository();
const addressRepository = new AddressRepository();

// Handle POST requests for adding a new address
export async function POST(req: Request) {
    try {
        const body = await req.json(); // Parse JSON request body

        if (!body) {
            return new Response('No body received', { status: 400 });
        }

        const addressId = await addressRepository.create(Address.fromJSON(body)); // Add address using the repository

        return NextResponse.json(
            { message: 'Address added successfully', addressId },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to add address' },
            { status: 400 }
        );
    }
}


// Handle DELETE requests for deleting an address
export async function DELETE(req: Request) {
    try {
        const urlParts = req.url.split('/');
        const addressId = Number(urlParts.pop()); // Extract address ID from the URL
        
        await addressRepository.deleteAddress(addressId); // Delete address by ID

        return NextResponse.json({ message: 'Address deleted successfully' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to delete address' },
            { status: 400 }
        );
    }
}