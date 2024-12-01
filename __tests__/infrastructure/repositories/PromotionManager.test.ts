 /**
 * Test suite for the 'PromotionManager' class.
 * Verifies the discount and coupon functionality through various scenarios.
 */
import PromotionManager from "@/lib/discount";

describe('PromotionManager - Discount and Coupon Functionality', () =>
 {
     /**
     * Test suite for the 'calculateTotalPrice' method.
     * Validates the calculation of the total price under different conditions.
     */

    let promotionManager: PromotionManager;

    beforeEach(() =>
    {
        const minimumPurchaseForDiscount = 600;
        const discountPercentage = 10; // 10% discount on purchases over $600
        promotionManager = new PromotionManager(minimumPurchaseForDiscount, discountPercentage);
    });

    describe('calculateTotalPrice', () => 
    {
         /**
         * Test case: should calculate total price without discount for purchases below the minimum.
         * Ensures no discount is applied when the purchase total does not meet the minimum requirement.
         */

        it('should calculate total price without discount for purchases below the minimum', () => 
        {
            // Test implementation
            const products =
            [
                { price: 100, quantity: 2 }, // Total: 200
                { price: 50, quantity: 6 }, // Total: 300
            ];

            const total = promotionManager.calculateTotalPrice(products);
            expect(total).toBe(500); // No discount applied
        });

         /**
         * Test case: should apply discount for purchases equal or above the minimum.
         * Confirms the discount is applied correctly when the purchase total meets or exceeds the threshold.
         */

        it('should apply discount for purchases equal or above the minimum', () => 
        {
            // Test implementation
            const products =
            [
                { price: 200, quantity: 2 }, // Total: 400
                { price: 100, quantity: 3 }, // Total: 300
            ];

            const total = promotionManager.calculateTotalPrice(products);
            expect(total).toBe(630); // Discount: 700 - 70(10%) = 630
        });

         /**
         * Test case: should return 0 for an empty product list.
         * Ensures that the total price is calculated as zero when no products are provided.
         */

        it('should return 0 for an empty product list', () => 
        {
            // Test implementation
            const products: { price: number; quantity: number }[] = [];

            const total = promotionManager.calculateTotalPrice(products);
            expect(total).toBe(0); // No products
        });
    });

     /**
     * Test suite for the `applyCoupon` method.
     * Focuses on applying coupon codes and their interaction with discounts.
     */

    describe('applyCoupon', () => 
    {
        /**
         * Test case: should not apply discount but apply a valid coupon and reduce the total price accordingly.
         * Validates correct application of a valid coupon when discounts are not eligible.
         */

        it('should not apply discount but apply a valid coupon and reduce the total price accordingly', () =>
        {
            // Test implementation
            const products = 
            [
                { price: 100, quantity: 2 }, // Total: 200
                { price: 150, quantity: 2 }, // Total: 300
            ];

            const total = promotionManager.applyCoupon('EID100', products);
            expect(total).toBe(400); // 500 - 100(coupon discount) = 400
        });

         /**
         * Test case: should handle invalid coupon codes gracefully.
         * Ensures that invalid coupon codes are rejected without affecting the total price.
         */

        it('should handle invalid coupon codes gracefully', () => 
        {
            // Test implementation
            const products = 
            [
                { price: 100, quantity: 1 }, // Total: 100
                { price: 200, quantity: 2 }, // Total: 400
            ];

            const total = promotionManager.applyCoupon('SPRING200', products);
            expect(total).toBe(500); // No coupon discount applied
        });

         /**
         * Test case: should apply discount and coupon both on total bill.
         * Confirms the correct application of both discount and coupon on the final total.
         */

        it('should apply discount and coupon both on total bill', () =>
         {
             // Test implementation
            const products =
            [
                { price: 100, quantity: 6 }, // Total: 600
                { price: 50, quantity: 8 },  // Total: 400
            ];

            const total = promotionManager.applyCoupon('SUMMER50', products);
            expect(total).toBeCloseTo(850); // 1000 - 100(10) - 50(coupon discount) = 850
        });

        /**
         * Test case: should return the original total price for an empty product list.
         * Ensures that coupons and discounts do not alter the result for an empty product list.
         */

        it('should return the original total price for an empty product list', () =>
        {
            // Test implementation
            const products: { price: number; quantity: number }[] = [];

            const total = promotionManager.applyCoupon('SUMMER15', products);
            expect(total).toBe(0); // No products, no discount
        });

        /**
         * Test case: should handle cases where applying coupon results in zero total price.
         * Validates behavior when a coupon results in a total price of zero.
         */

        it('should handle cases where applying coupon results in zero total price', () => 
        {
            // Test implementation
            const products = 
            [
                { price: 75, quantity: 1 }, // Total: 75
                { price: 25, quantity: 1 }, // Total: 25
                
            ];

            const total = promotionManager.applyCoupon('EID100', products);
            expect(total).toBe(0); // 100 - 100(coupon discount) = 0
        });
    });
});