import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { HashingService } from '@/infrastructure/services/HashingService';
import { User } from '@/domain/entities/User';

const userRepository = new UserRepository();
const hashingService = new HashingService();

// Handle POST requests for signupa
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      throw new Error('No body received');  // Throw an error if no body is received
    }

    const found = await userRepository.findByEmail(body.email); // Sign up the user using the use case

    if (found) {
      throw new Error('User already exists'); // Throw an error if the user already exists
    }

    body.password = await hashingService.hash(body.password); // Hash the user password

    const success = await userRepository.create(User.fromJson(body)); // Sign up the user using the use case

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
