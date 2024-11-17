import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { UserUseCases } from '@/application/usecases/userAuth/userAuth';
import { HashingService } from '@/infrastructure/services/HashingService';

const userRepository = new UserRepository();
const hashingService = new HashingService();
const userUseCases = new UserUseCases(userRepository,hashingService);

export async function POST(req: Request) {
  return NextResponse.json(
    { message: 'GET method is not allowed for this endpoint.' },
    { status: 200 }
  );
}
