// import { NextResponse } from 'next/server';
// import { UserRepository } from '@/infrastructure/repositories/UserRepository';
// import { HashingService } from '@/infrastructure/services/HashingService';
// import { UpdateProfile } from '@/application/usecases/profileManagement/updateProfile';

// const userRepository = new UserRepository();
// const hashingService = new HashingService();
// const updateProfileUseCase = new UpdateProfile(userRepository, hashingService);

// // Fetch user profile details
// async function fetchUserProfile(userId: number): Promise<any> {
//     const response = await fetch(`/api/users/${userId}`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch user profile');
//     }
//     return await response.json();
// }

// // Fetch user addresses
// async function fetchUserAddresses(userId: number): Promise<any[]> {
//     const response = await fetch(`/api/users/${userId}/addresses`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch addresses');
//     }
//     return await response.json();
// }

// // Add a new address for the user
// async function addUserAddress(userId: number, addressData: any): Promise<any> {
//     const response = await fetch(`/api/users/${userId}/addresses`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(addressData),
//     });
//     if (!response.ok) {
//         throw new Error('Failed to add address');
//     }
//     return await response.json();
// }

// // Delete an address by ID
// async function deleteUserAddress(userId: number, addressId: number): Promise<void> {
//     const response = await fetch(`/api/users/${userId}/addresses/${addressId}`, {
//         method: 'DELETE',
//     });
//     if (!response.ok) {
//         throw new Error('Failed to delete address');
//     }
// }

// // Fetch user orders
// async function fetchUserOrders(userId: number): Promise<any[]> {
//     const response = await fetch(`/api/users/${userId}/orders`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch orders');
//     }
//     return await response.json();
// }

// // Fetch user reviews
// async function fetchUserReviews(userId: number): Promise<any[]> {
//     const response = await fetch(`/api/users/${userId}/reviews`);
//     if (!response.ok) {
//         throw new Error('Failed to fetch reviews');
//     }
//     return await response.json();
// }

import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';

const userRepository = new UserRepository();

// Handle GET requests for fetching user profile
export async function GET(req: Request) {
    try {
        const userId = req.url.split('/').pop(); // Extract user ID from the URL
        const userProfile = await userRepository.findById(Number(userId)); // Fetch user profile by ID

        if (!userProfile) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(userProfile, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || 'Failed to fetch user profile' },
            { status: 400 }
        );
    }
}



