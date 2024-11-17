import { User } from './User';

export class PaymentMethod {
  constructor(
    public id: number,
    public userId: number,
    public paymentType: string,
    public cardNumber: string | null = null,
    public expiryDate: Date | null = null,
    public cvv: number | null = null,
    public email: string | null = null,
    public password: string | null = null,
    public user: User | null = null // Relation with the User entity
  ) {}

  // Domain methods for PaymentMethod
  validateCardDetails(): boolean {
    if (this.cardNumber && this.cvv && this.expiryDate) {
      const today = new Date();
      return this.expiryDate > today; // Ensure card expiry date is in the future
    }
    return false;
  }

  isEmailBased(): boolean {
    return this.paymentType.toLowerCase() === 'paypal' && !!this.email && !!this.password;
  }

  obfuscateSensitiveInfo(): PaymentMethod {
    // Creates a new instance with sensitive data masked
    return new PaymentMethod(
      this.id,
      this.userId,
      this.paymentType,
      this.cardNumber ? '**** **** **** ' + this.cardNumber.slice(-4) : null,
      this.expiryDate,
      null, // Hide CVV
      this.email,
      null, // Hide Password
      this.user
    );
  }
}
