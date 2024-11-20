import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { HashingService } from '@/infrastructure/services/HashingService';
import { UpdateProfile } from '@/application/usecases/profileManagement/updateProfile';

const userRepository = new UserRepository();
const hashingService = new HashingService();
const updateProfileUseCase = new UpdateProfile(userRepository, hashingService);

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      return new Response('No body received', { status: 400 });
    }

    const success = await updateProfileUseCase.updateProfile(body); // Sign up the user using the use case

    return NextResponse.json(
      { message: success ? 'Profile Updated successfully' : 'Failed to update profile' },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      
      return NextResponse.json(
        { message: error.message || 'Failed to create profile' },
        { status: 400 }
      );
  }
}
