export default class PromotionManager
 {
    private notifications: string[] = [];

    constructor(private minimumPurchaseForDiscount: number, private discountPercentage: number) {}

    // Method to calculate total price after applying discounts
    public calculateTotalPrice(products: { price: number; quantity: number }[]): number 
    {
        let totalBill = 0;

        // Calculate total bill
        products.forEach(product =>
        {
            totalBill += product.price * product.quantity;
        });

        // Apply discount if minimum purchase amount is exceeded
        if (totalBill >= this.minimumPurchaseForDiscount) {
            const discount = (totalBill * this.discountPercentage) / 100;
            totalBill -= discount;
            this.sendNotification(`A discount of ${this.discountPercentage}% has been applied to your total bill.`);
        }

        return totalBill;
    }

    // Method to apply a coupon code
    public applyCoupon
    ( 
         couponCode: string,
         products: { price: number; quantity: number }[]): number
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

            this.sendNotification(`Coupon ${couponCode} applied! You received a ${discountPercentage}% discount.`);
            return totalBill;

        } else {
            this.sendNotification(`Invalid coupon code: ${couponCode}`);
            return this.calculateTotalPrice(products);
        }
    }

    // Method to send notifications
    private sendNotification(message: string): void {
        this.notifications.push(message);
        console.log(`Notification: ${message}`);
    }

    // Method to get all notifications
    public getNotifications(): string[] {
        return this.notifications;
    }
}

