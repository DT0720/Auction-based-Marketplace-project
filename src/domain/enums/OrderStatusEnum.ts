/**
 * @enum {string}
 * @description Enum for order status types used in the application
 */
export enum OrderStatusEnum {
    Pending="Pending",
    Shipping="Shipping",
    Shipped="Shipped",
    Received="Received",
    Cancelled="Cancelled",
    Returned="Returned"
}