import { NextResponse } from 'next/server';
import { ISellerInvertoryRepository } from '@/application/repositories/ISellerInventoryRepository';
import { SellerInventoryRepository } from '@/infrastructure/repositories/SellerInventoryRepository';
import { SellerInventory } from '@/domain/entities/SellerInventory';

const sellerInventoryRepository : ISellerInvertoryRepository = new SellerInventoryRepository();

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      throw new Error('No body received');  // Throw an error if no body is received
    }

    const inventory = await sellerInventoryRepository.create(SellerInventory.fromJson(body)); // Create the inventory using the use case

    if (!inventory) {
      throw new Error('Error during creating product'); // Throw an error if the product was not created
    }

    const success = inventory == null ? false : true;

    return NextResponse.json(
      { message: success ? 'Inventory created successfully' : 'Failed to create Inventory', data: inventory },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      console.log(error.message);
      return NextResponse.json(
        { message: 'Failed to create inventory', data: null },
        { status: 400 }
      );
  }
}
