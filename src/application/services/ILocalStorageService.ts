export interface ILocalStorageService {
    /**
     * Adds an item to the local storage cache.
     * 
     * @param {any} item - The item to be added to the cache.
     */
    addToCache(item: any): void;
    /**
     * Retrieves the cache from local storage.
     * 
     * @returns {any[]} - An array of items from the cache.
     */
    getCache(): any[];
    /**
     * Removes an item from the local storage cache by item ID.
     * 
     * @param {number} itemId - The ID of the item to be removed from the cache.
     */
    removeFromCache(itemId: number): void;
    /**
     * Clears the entire local storage cache.
     */
    clearCache(): void;
    /**
     * Appends an array of items to the local storage cache.
     * 
     * @param {any[]} data - An array of items to be appended to the cache.
     */
    appendToCache(data: any[]): void;
    /**
     * Updates an item in the local storage cache.
     * 
     * @param {number} itemId - The ID of the item to be updated.
     * @param {(item: any) => any} updateFn - The function to be used to update the item.
     */
    updateCache(itemId: number, updateFn: (item: any) => any): void;
}