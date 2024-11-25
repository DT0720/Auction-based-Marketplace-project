import { IProductRepository } from '@/application/repositories/IProductRepository';
import { Product } from '@/domain/entities/Product';
import { UserAuthException } from '@/domain/errors/UserAuthException';

export class UpdateProduct {
  private productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async updateProduct(data: any): Promise<boolean> {
    
    const product = Product.fromJson(data);

    const success = await this.productRepository.update(product);
    
    if (!success) {
      throw new UserAuthException('Profile update failed');
    }

    return success;
  }

}
