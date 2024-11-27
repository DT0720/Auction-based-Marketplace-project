import { ILocalStorageService } from "@/application/services/ILocalStorageService";
import { StorageKeyEnums } from "@/domain/enums/StorageKeyEnum";

/**
 * LocalStorageService class implements ILocalStorageService to manage local storage operations.
 * Provides methods for adding, retrieving, updating, and removing items from local storage.
 */
export class LocalStorageService implements ILocalStorageService {
    private cacheKey: string;

  /**
   * Constructor to initialize LocalStorageService with a user ID and a storage key.
   * 
   * @param {number} userId - The user ID used to create a unique storage key.
   * @param {string} [key=StorageKeyEnums.CART] - Optional storage key, defaults to CART.
   */    
    constructor(userId: number,key: string = StorageKeyEnums.CART) {
        this.cacheKey = `${userId}_${key}`;
    }


  /**
   * Adds an item to the local storage cache.
   * 
   * @param {any} item - The item to be added to the cache.
   */
    addToCache(item: any): void {
        const cache = this.getCache();
        cache.push(item);
        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    }


  /**
   * Retrieves the cache from local storage.
   * 
   * @returns {any[]} - An array of items from the cache.
   */
    getCache(): any[] {
        return JSON.parse(localStorage.getItem(this.cacheKey) || "[]");
    }


  /**
   * Removes an item from the local storage cache by item ID.
   * 
   * @param {number} itemId - The ID of the item to be removed from the cache.
   */
    removeFromCache(itemId: number): void {
        let cache = this.getCache();
        cache = cache.filter(item => item.id !== itemId);
        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    }


  /**
   * Clears the entire local storage cache for the current key.
   */
    clearCache(): void {
        localStorage.removeItem(this.cacheKey);
    }


  /**
   * Appends multiple items to the local storage cache.
   * 
   * @param {any[]} data - An array of items to be appended to the cache.
   */
    appendToCache(data: any[]): void {
        const cache = this.getCache();
        const updatedCache = [...cache, ...data];
        localStorage.setItem(this.cacheKey, JSON.stringify(updatedCache));
    }
    
  /**
   * Updates an item in the local storage cache by item ID.
   * 
   * @param {number} itemId - The ID of the item to be updated.
   * @param {(item: any) => any} updateFn - A function that takes the item and returns an updated version of the item.
   */
    updateCache(itemId: number, updateFn: (item: any) => any): void {
        const cache = this.getCache();
        const updatedCache = cache.map(item => (item.id === itemId ? updateFn(item) : item));
        localStorage.setItem(this.cacheKey, JSON.stringify(updatedCache));
      }
}