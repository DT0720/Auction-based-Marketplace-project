
export class Wallet {
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
