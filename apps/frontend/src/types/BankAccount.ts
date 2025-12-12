export interface CreditCard {
  id: string;
  nickname: string;
}

export interface BankAccount {
  id: string;
  name: string;
  bank: string;
  bankLogo?: string;
  initialBalance: number;
  hasCreditCard: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
  creditCards?: CreditCard[];
}
