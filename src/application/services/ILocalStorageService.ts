export interface ILocalStorageService {
    addToCache(item: any): void;
    getCache(): any[];
    removeFromCache(itemId: number): void;
    clearCache(): void;
    appendToCache(data: any[]): void;
    updateCache(itemId: number, updateFn: (item: any) => any): void;
}