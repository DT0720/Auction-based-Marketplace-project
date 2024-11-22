import { NextResponse } from 'next/server';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';

const productRepository = new ProductRepository();

export async function GET(req: Request) {
  try {

    const productList = await productRepository.findAllProducts(); 

    return NextResponse.json(
      { 
        message: "Products found",
        data: productList
      },
      { status: 200 }
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message, data: [] },
        { status: 400 }
      );
  }
}

