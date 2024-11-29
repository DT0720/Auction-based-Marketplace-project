export default class PromotionManager
 // Array to store notification messages
 {
    private notifications: string[] = [];

    // Constructor to initialize the minimum purchase amount and discount percentage
    constructor(private minimumPurchaseForDiscount: number, private discountPercentage: number) {}

    // Method to calculate total price after applying discounts
    public calculateTotalPrice(products: { price: number; quantity: number }[]): number 
    {
        let totalBill = 0;

         // Calculate the total bill by summing up the price * quantity for each product
        products.forEach(product =>
        {
            totalBill += product.price * product.quantity;
        });

        // Apply discount if minimum purchase amount is equal or exceeded
        if (totalBill >= this.minimumPurchaseForDiscount) {
            const discount = (totalBill * this.discountPercentage) / 100;
            totalBill -= discount;
            this.sendNotification('A discount of ${this.discountPercentage}% has been applied to your total bill.');
        }

        // Return the final total bill amount
        return totalBill;
    }

    // Method to apply a coupon code to the total bill
    public applyCoupon
    ( 
         couponCode: string,
         products: { price: number; quantity: number }[]
        
    ):number
          
     // Predefined valid coupon codes and their respective discount values
     {
        const validCoupons =
        {
            EID100: 100,  // Flat $100 discount
            SUMMER50: 50, // Flat $50 discount
            WINTER20: 20, // Flat $20 discount
        } as const;

        // Determine the discount percentage based on the provided coupon code
        const discountPercentage = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons] || 0;

        if (discountPercentage) 
        {
            // If the coupon is valid, calculate the total price after applying the discount
            let totalBill = this.calculateTotalPrice(products);
            totalBill = (totalBill - discountPercentage); // Subtract the coupon discount value

            this.sendNotification('Coupon ${couponCode} applied! You received a ${discountPercentage}% discount.');
            return totalBill; // Return the final total bill

        }

        // If the coupon is invalid, send a notification and return the original total price
        else
        {
            this.sendNotification('Invalid coupon code: ${couponCode}');
            return this.calculateTotalPrice(products);
        }
    }

    // Method to send notifications
    private sendNotification(message: string): void 
    {
        this.notifications.push(message); // Add the message to the notifications array
        console.log('Notification: ${message}'); // Log the notification
    }

    // Method to get all notifications
    public getNotifications(): string[] 
    {
        return this.notifications; // Return the notifications array
    }
}

