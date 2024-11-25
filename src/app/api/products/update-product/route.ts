import { NextResponse } from 'next/server';
import { UpdateProduct } from '@/application/usecases/sellerDashboard/products/updateProduct';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';

const productRepository = new ProductRepository();
const updateProductUseCase = new UpdateProduct(productRepository);

// Handle POST requests for signup
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON request body

    if (!body) {
      return new Response('No body received', { status: 400 });
    }

    const success = await updateProductUseCase.updateProduct(body); // Sign up the user using the use case

    return NextResponse.json(
      { message: success ? 'Product Updated successfully' : 'Failed to update product' },
      { status: success ? 201 : 400 }
    );

  } catch (error: any) {
      
      return NextResponse.json(
        { message: error.message || 'Failed to create product' },
        { status: 400 }
      );
  }
}
