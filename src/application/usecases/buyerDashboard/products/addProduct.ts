import { ILocalStorageService } from "@/application/services/ILocalStorageService";
import { LocalStorageService } from "@/infrastructure/services/LocalStorageService";
import { getProductById } from "../../sellerDashboard/products/getProductById";

/**
 * Adds a product to the user's cart, either by updating the quantity if it already exists or adding a new product.
 *
 * @async
 * @function addProductToCart
 * @param {number} userId - The unique ID of the user adding the product to their cart.
 * @param {number} product_id - The unique ID of the product to be added to the cart.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the product is successfully added or updated in the cart, or `false` if an error occurs.
 *
 * @throws {Error} Throws an error if the product is not found or any other unexpected error occurs during the operation.
 *
 * @description This function checks if the product already exists in the user's cart (stored in local storage). 
 * - If the product exists, it updates the quantity by incrementing it by 1.
 * - If the product does not exist, it adds the product to the cart with an initial quantity of 1.
 * The function logs the updated cart content to the console and returns `true` if the operation is successful.
 * If any error occurs (e.g., product not found or local storage issues), the function returns `false`.
 *
 * @example
 * const userId = 123;
 * const productId = 456;
 * const success = await addProductToCart(userId, productId);
 * if (success) {
 *     console.log('Product added or updated in the cart.');
 * } else {
 *     console.error('Failed to add the product to the cart.');
 * }
 */
export async function addProductToCart(userId: number, product_id: number): Promise<boolean> {
    try{
        const localStorageService: ILocalStorageService = new LocalStorageService(userId);

        const product = await getProductById(product_id);

        if(!product){
            throw new Error('Product not found');
        }

        const cache = localStorageService.getCache();
        const existingProduct = cache.find(item => item.id === product_id);

        if (existingProduct) {
            console.log("Updating product");
            localStorageService.updateCache(product_id, (item) => ({
                ...item,
                quantity: item.quantity + 1,
            }));
        } else {
            // Add the product with the given quantity if it doesn't exist
            console.log("Adding product");
            localStorageService.addToCache({ ...product, quantity: 1 });
        }

        console.log(localStorageService.getCache());

        return true;
    }catch(error: any){
        console.error(error.message);
        return false;
    }
    
}

