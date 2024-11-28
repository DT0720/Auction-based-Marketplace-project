// promotionManager.test.ts
import PromotionManager from "@/lib/discount";

describe('PromotionManager - Discount and Coupon Functionality', () => {
    let promotionManager: PromotionManager;

    beforeEach(() => {
        const minimumPurchaseForDiscount = 600;
        const discountPercentage = 10; // 10% discount on purchases over $600
        promotionManager = new PromotionManager(minimumPurchaseForDiscount, discountPercentage);
    });

    describe('calculateTotalPrice', () => {
        it('should calculate total price without discount for purchases below the minimum', () => {
            const products = [
                { price: 100, quantity: 2 }, // Total: 200
                { price: 50, quantity: 6 }, // Total: 300
            ];

            const total = promotionManager.calculateTotalPrice(products);
            expect(total).toBe(500); // No discount applied
        });

        it('should apply discount for purchases equal or above the minimum', () => {
            const products = [
                { price: 200, quantity: 2 }, // Total: 400
                { price: 100, quantity: 3 }, // Total: 300
            ];

            const total = promotionManager.calculateTotalPrice(products);
            expect(total).toBe(630); // Discount: 700 - 70(10%) = 630
        });

        it('should return 0 for an empty product list', () => {
            const products: { price: number; quantity: number }[] = [];

            const total = promotionManager.calculateTotalPrice(products);
            expect(total).toBe(0); // No products
        });
    });

    describe('applyCoupon', () => {
        it('should not apply discount but apply a valid coupon and reduce the total price accordingly', () => {
            const products = [
                { price: 100, quantity: 2 }, // Total: 200
                { price: 150, quantity: 2 }, // Total: 300
            ];

            const total = promotionManager.applyCoupon('EID100', products);
            expect(total).toBe(400); // 500 - 100(coupon discount) = 400
        });

        it('should handle invalid coupon codes gracefully', () => {
            const products = [
                { price: 100, quantity: 1 }, // Total: 100
                { price: 200, quantity: 2 }, // Total: 400
            ];

            const total = promotionManager.applyCoupon('SPRING200', products);
            expect(total).toBe(500); // No coupon discount applied
        });

        it('should apply discount and coupon both on total bill', () => {
            const products = [
                { price: 100, quantity: 6 }, // Total: 600
                { price: 50, quantity: 8 },  // Total: 400
            ];

            const total = promotionManager.applyCoupon('SUMMER50', products);
            expect(total).toBeCloseTo(850); // 1000 - 100(10) - 50(coupon discount) = 850
        });

        it('should return the original total price for an empty product list', () => {
            const products: { price: number; quantity: number }[] = [];

            const total = promotionManager.applyCoupon('SUMMER15', products);
            expect(total).toBe(0); // No products, no discount
        });


        it('should handle cases where applying coupon results in zero total price', () => {
            const products = [
                { price: 75, quantity: 1 }, // Total: 75
                { price: 25, quantity: 1 }, // Total: 25
                
            ];

            const total = promotionManager.applyCoupon('EID100', products);
            expect(total).toBe(0); // 100 - 100(coupon discount) = 0
        });
    });
});