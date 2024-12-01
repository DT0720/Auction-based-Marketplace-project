import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { AddressRepository } from '@/infrastructure/repositories/AddressRepository';
import { Address } from '@/domain/entities/Address';

const addressRepository = new AddressRepository();

/**
 * Handles GET requests to find addresses by user ID
 * @async
 * @function GET
 * @param {Request} req - The request object
 * @param {Object} context - The context object containing route parameters
 * @param {Promise<{ id: string }>} context.params - The route parameters containing the user ID
 * @returns {Promise<Response>} - The response object containing the addresses or an error message
 */

//Find addresses by user ID
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;

        const userId = parseInt(id, 10);

        if (!userId) throw new Error('User ID is required');

        const addresses = await addressRepository.findByUserId(userId);

        return NextResponse.json(
            { message: 'Addresses retrieved successfully', data: addresses },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to retrieve addresses' },
            { status: 400 }
        );
    }
}
