import { NextResponse } from 'next/server';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';
import { IProductRepository } from '@/application/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';

const productRepository : IProductRepository = new ProductRepository();

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      throw new Error('No body received');  // Throw an error if no body is received
    }

    const product = await productRepository.create(Product.fromJson(body)); // Sign up the user using the use case

    if (!product) {
      throw new Error('Error during creating product'); // Throw an error if the product was not created
    }

    const success = product == null ? false : true;

    return NextResponse.json(
      { message: success ? 'Product created successfully' : 'Failed to create product', data: product },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      console.log(error.message);
      return NextResponse.json(
        { message: 'Failed to create product', data: null },
        { status: 400 }
      );
  }
}
