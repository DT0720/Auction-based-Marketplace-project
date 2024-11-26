import { ILocalStorageService } from "@/application/services/ILocalStorageService";
import { LocalStorageService } from "@/infrastructure/services/LocalStorageService";
import { getProductById } from "../../sellerDashboard/products/getProductById";

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

