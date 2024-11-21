import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';

const userRepository = new UserRepository();

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      return new Response('No body received', { status: 400 });
    }

    const user = await userRepository.findByEmail(body.email); 

    return NextResponse.json(
      { message: user ? 'Login Success' : 'Login Failed', data: user ? user : null },
      { status: user ? 201 : 400 }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Failed to Login' },
        { status: 400 }
      );
  }
}

