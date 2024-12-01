/**
 * @class Wallet
 * @classdesc Represents a user's wallet for handling payments
 */
export class Wallet {
  /**
     * @constructor
     * @param {number} wallet_id - The unique identifier of the wallet
     * @param {number} user_id - The ID of the user associated with the wallet
     * @param {string | null} payment_type - The type of payment method (e.g., credit card, PayPal)
     * @param {string | null} card_number - The card number for the payment method
     * @param {Date | null} expiry_date - The expiry date of the card
     * @param {number} cvv - The CVV code of the card
     * @param {string | null} email - The email associated with the payment method
     * @param {string} password - The password for the payment method
     * @param {number} current_balance - The current balance in the wallet
     */
    constructor(
        public wallet_id: number,
        public user_id: number,
        public payment_type: string | null,
        public card_number: string | null,
        public expiry_date: Date | null,
        public cvv: number,
        public email: string | null,
        public password: string,
        public current_balance: number,
      ) {}
       /**
     * Creates a `Wallet` instance from a JSON object
     * @param {any} data - The JSON object containing wallet data
     * @returns {Wallet} - The Wallet instance created from the JSON data
     */

    static fromJson(data : any) : Wallet{
        return new Wallet(
          data.id,
          data.user_id,
          data.payment_type,
          data.card_number,
          data.expiry_date,
          data.cvv,
          data.email,
          data.password,
          data.current_balance,
        );
    }
}
