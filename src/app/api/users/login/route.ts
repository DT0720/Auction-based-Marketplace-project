import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { generateToken } from '@/lib/tokenUtils';
import { WalletRepository } from '@/infrastructure/repositories/WalletRepository';

const userRepository = new UserRepository();
const walletRepository = new WalletRepository();

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      return new Response('No body received', { status: 400 });
    }

    const user = await userRepository.findByEmail(body.email); 

    if(!user){
      return new Response('No User found', { status: 400 });
    }
    
    const wallet = await walletRepository.getWallet(user.user_id);

    const token = generateToken({
      user: user.toJson(), 
      credit: wallet ? wallet.current_balance : 0
    });

    return NextResponse.json(
      { 
        message: user ? 'Login Success' : 'Login Failed', 
        data: {
          user: user ? user : null,
          credit: wallet ? wallet.current_balance : null,
          token: token
        } 
      },
      { status: user ? 201 : 400 }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Failed to Login', data: null },
        { status: 400 }
      );
  }
}

