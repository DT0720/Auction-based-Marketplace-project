import { NextResponse } from 'next/server';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';

const productRepository = new ProductRepository();

export async function GET(req: Request) {
  try {

    const productList = await productRepository.findAllProducts(); 

    if(productList.length == 0){
      return new Error("No Products Found");
    }

    return NextResponse.json(
      { 
        message: "Products found",
        data: productList
      },
      { status: 201}
    );

  } catch (error: any) {
      return NextResponse.json(
        { message: error.message || 'Products Not Found!!', data: [] },
        { status: 400 }
      );
  }
}

