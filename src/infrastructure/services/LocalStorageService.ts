import { ILocalStorageService } from "@/application/services/ILocalStorageService";
import { StorageKeyEnums } from "@/domain/enums/StorageKeyEnum";

export class LocalStorageService implements ILocalStorageService {
    private cacheKey: string;

    constructor(userId: number,key: string = StorageKeyEnums.CART) {
        this.cacheKey = `${userId}_${key}`;
    }

    addToCache(item: any): void {
        const cache = this.getCache();
        cache.push(item);
        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    }

    getCache(): any[] {
        return JSON.parse(localStorage.getItem(this.cacheKey) || "[]");
    }

    removeFromCache(itemId: number): void {
        let cache = this.getCache();
        cache = cache.filter(item => item.id !== itemId);
        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
    }

    clearCache(): void {
        localStorage.removeItem(this.cacheKey);
    }

    appendToCache(data: any[]): void {
        const cache = this.getCache();
        const updatedCache = [...cache, ...data];
        localStorage.setItem(this.cacheKey, JSON.stringify(updatedCache));
    }

    updateCache(itemId: number, updateFn: (item: any) => any): void {
        const cache = this.getCache();
        const updatedCache = cache.map(item => (item.id === itemId ? updateFn(item) : item));
        localStorage.setItem(this.cacheKey, JSON.stringify(updatedCache));
      }
}