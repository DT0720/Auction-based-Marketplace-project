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

    const currentInventory = await sellerInventoryRepository.findByProductId(body.product_id);    

    if (!currentInventory) {
        throw new Error('Inventory not found'); // Throw an error if the product was not created
    }

    if (body.quantity <= 0) {
        throw new Error('Please enter items for sale'); // Throw an error if the product was not created
    }

    if (body.quantity_for_sale > currentInventory.quantity) {
        throw new Error('Quantity for sale cannot be greater than quantity in inventory'); // Throw an error if the product was not created
    }

    const updatedData: any = {};
    updatedData.id = currentInventory.id;
    updatedData.quantity_for_sale = body.quantity_for_sale;
    updatedData.quantity = body.quantity - body.quantity_for_sale;

    console.log(SellerInventory.fromJson(updatedData));

    const success = await sellerInventoryRepository.update(SellerInventory.fromJson(updatedData)); // Create the product using the use case

    return NextResponse.json(
      { message: success ? 'Inventory updated successfully' : 'Failed to update inventory', data: true },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      console.log(error.message);
      return NextResponse.json(
        { message: 'Failed to create product', data: false },
        { status: 400 }
      );
  }
}
