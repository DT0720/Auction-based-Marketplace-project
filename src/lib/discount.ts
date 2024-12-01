/**
 * Class representing a promotion manager for handling discounts and notifications.
 */

export default class PromotionManager
 {
    /**
   * Array to store notification messages.
   * @private
   * @type {string[]}
   */

    private notifications: string[] = [];

    /**
   * Creates an instance of PromotionManager.
   * @param {number} minimumPurchaseForDiscount - The minimum purchase amount to qualify for a discount.
   * @param {number} discountPercentage - The discount percentage to apply.
   */

    constructor(private minimumPurchaseForDiscount: number, private discountPercentage: number) {}

    /**
   * Calculates the total price after applying discounts.
   * @param {{ price: number; quantity: number }[]} products - The list of products with price and quantity.
   * @returns {number} The total price after applying the discount.
   */

    public calculateTotalPrice(products: { price: number; quantity: number }[]): number 
    {
        let totalBill = 0;

        products.forEach(product =>
        {
            totalBill += product.price * product.quantity;
        });

        if (totalBill >= this.minimumPurchaseForDiscount) {
            const discount = (totalBill * this.discountPercentage) / 100;
            totalBill -= discount;
            this.sendNotification('A discount of ${this.discountPercentage}% has been applied to your total bill.');
        }

        return totalBill;

    /**
   * Adds a notification message.
   * @param {string} message - The notification message to add.
   */

    }

    /**
   * Checks if a given product list qualifies for a discount.
   * @param {{ price: number; quantity: number }[]} products - The list of products with price and quantity.
   */
    public applyCoupon
    ( 
         couponCode: string,
         products: { price: number; quantity: number }[]
        
    ):number
          
     {
        const validCoupons =
        {
            EID100: 100,  
            SUMMER50: 50, 
            WINTER20: 20, 
        } as const;


        const discountPercentage = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons] || 0;

        if (discountPercentage) 
        {
            
            let totalBill = this.calculateTotalPrice(products);
            totalBill = (totalBill - discountPercentage); 

            this.sendNotification('Coupon ${couponCode} applied! You received a ${discountPercentage}% discount.');
            return totalBill; 

        }

        else
        {
            this.sendNotification('Invalid coupon code: ${couponCode}');
            return this.calculateTotalPrice(products);
        }
    }

    /**
   * Sends notification.
   */
    private sendNotification(message: string): void 
    {
        this.notifications.push(message); 
        console.log('Notification: ${message}'); 
    }

    /**
    *Gets notification
   */
    
    public getNotifications(): string[] 
    {
        return this.notifications; 
    }
}

