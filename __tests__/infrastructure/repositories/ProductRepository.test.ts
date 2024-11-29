import { IProductRepository } from '@/application/repositories/IProductRepository';
import { ProductTypeEnum, ProductTypeEnumKey } from '@/domain/enums/ProductTypeEnum';
import { ProductRepository } from '@/infrastructure/repositories/ProductRepository';

describe('ProductRepository', () => {
  let productRepository: IProductRepository;

  beforeEach(() => {
    productRepository = new ProductRepository(); // Uses the global prisma mock
  });

  it('should fetch the products by product category', async () => {
   
    // Act
    const products = await productRepository.findByCategory(ProductTypeEnum.LADY_FASHION as keyof typeof ProductTypeEnum);

    console.log("Test is: " + JSON.stringify(products));
    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});

describe('ProductRepository', () => {
  let productRepository: IProductRepository;
  
  beforeEach(() => {
    productRepository = new ProductRepository(); // Uses the global prisma mock
  });
  
  it('should fetch the products by product price', async () => {
     
    // Act
    const products = await productRepository.findByPrice(2100);
  
    console.log("Test is: " + JSON.stringify(products));
    // if(success){
    //   const user = await userRepository.findById(2);
    //   console.log(user);
    // }
  });
});

describe('ProductRepository', () => {
   let productRepository: IProductRepository;
  
    beforeEach(() => {
      productRepository = new ProductRepository(); // Uses the global prisma mock
    });
  
    it('should fetch the products by product name', async () => {
     
      // Act
      const products = await productRepository.findByProductName("");
  
      console.log("Test is: " + JSON.stringify(products));
      // if(success){
      //   const user = await userRepository.findById(2);
      //   console.log(user);
      // }
    });
});
  