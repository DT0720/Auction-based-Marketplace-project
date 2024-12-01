import { IProductRepository } from "@/application/repositories/IProductRepository";
import { Product } from "@/domain/entities/Product";
import { UserAuthException } from "@/domain/errors/UserAuthException";

/**
 * Use case for updating a product in the repository.
 */

export class UpdateProduct {
    private productRepository: IProductRepository;

    /**
     * Constructs an instance of the `UpdateProduct` use case.
     *
     * @param {IProductRepository} productRepository - The repository interface for managing products.
     */

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Updates a product in the repository.
     *
     * @param {any} data - The data for the product to be updated.
     * @returns {Promise<boolean>} - A promise that resolves to `true` if the update is successful, otherwise `false`.
     * @throws {UserAuthException} - Throws an exception if the update fails.
     */

    async updateProduct(data: any): Promise<boolean> {
        const product = Product.fromJson(data);

        const success = await this.productRepository.update(product);

        if (!success) {
            throw new UserAuthException("Profile update failed");
        }

        return success;
    }
}
