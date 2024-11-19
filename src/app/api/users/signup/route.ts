import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { HashingService } from '@/infrastructure/services/HashingService';
import { UserUseCases } from '@/application/usecases/userAuth/userAuth';

const userRepository = new UserRepository();
const hashingService = new HashingService();
const userUseCases = new UserUseCases(userRepository, hashingService);

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      return new Response('No body received', { status: 400 });
    }

    const success = await userUseCases.signUp(body); // Sign up the user using the use case

    return NextResponse.json(
      { message: success ? 'User created successfully' : 'Failed to create user' },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      
      return NextResponse.json(
        { message: error.message || 'Failed to create user' },
        { status: 400 }
      );
  }
}
