// src/app/api/products/[id]/route.ts
import { IWalletRepository } from '@/application/repositories/IWalletRepository';
import { WalletRepository } from '@/infrastructure/repositories/WalletRepository';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const walletRepository : IWalletRepository = new WalletRepository();

    try {
        const { id } = await context.params;

        const userId = parseInt(id, 10);

        if (isNaN(userId)) {
          return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
        }

        const wallet = await walletRepository.getWallet(userId);

        if (!wallet) {
            return NextResponse.json({ message: 'Wallet not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Product found successfully', 
            data: wallet.current_balance
         }, 
        { status: 200 });
    } catch (error: any) {
        console.error('Error in GET request:', error);
        return NextResponse.json({ message: 'Error processing request', data: null }, { status: 500 });
    }
}
