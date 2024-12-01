import { NextResponse } from 'next/server';
import { UserRepository } from '@/infrastructure/repositories/UserRepository';
import { generateToken } from '@/lib/tokenUtils';
import { WalletRepository } from '@/infrastructure/repositories/WalletRepository';
import { SellerRepository } from '@/infrastructure/repositories/SellerRepository';
import { BuyerRepository } from '@/infrastructure/repositories/BuyerRepository';

const userRepository = new UserRepository();
const walletRepository = new WalletRepository();
const sellerRepository = new SellerRepository();
const buyerRepository = new BuyerRepository();


/**
 * Handles POST requests for user login
 * @async
 * @function POST
 * @param {Request} req - The request object
 * @returns {Promise<Response>} - The response object containing the result of the operation
 */

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
    
    let userIdByType;

    if(user.type.toLocaleLowerCase() == 's'){
      userIdByType = await sellerRepository.findById(user.user_id);
    }else{
      userIdByType = await buyerRepository.findById(user.user_id);
    }

    const wallet = await walletRepository.getWallet(user.user_id);

    const token = generateToken({
      user: user.toJson(), 
      credit: wallet ? wallet.current_balance : 0,
      buyer_seller_id: userIdByType ? userIdByType.id : null
    });

    return NextResponse.json(
      { 
        message: user ? 'Login Success' : 'Login Failed', 
        data: {
          user: user ? user : null,
          credit: wallet ? wallet.current_balance : null,
          buyer_seller_id: userIdByType ? userIdByType.id : null,
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

