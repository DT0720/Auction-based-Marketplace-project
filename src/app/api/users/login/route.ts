import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { UserUseCases } from '@/application/usecases/userAuth/userAuth';
import { HashingService } from '@/infrastructure/services/HashingService';

const userRepository = new UserRepository();
const hashingService = new HashingService();
const userUseCases = new UserUseCases(userRepository,hashingService);

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      return new Response('No body received', { status: 400 });
    }

    const user = await userUseCases.login(body); // Login the user using the use case

    return NextResponse.json(
      { message: user ? 'Login Success' : 'Login Failed' },
      { status: user ? 201 : 400 },
      { data : user }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Failed to Login' },
        { status: 400 }
      );
  }
}

