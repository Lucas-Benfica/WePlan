import type { Category } from "./Category";
import type { BankAccount, CreditCard } from "./BankAccount";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO string
  isPaid: boolean;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relations
  familyId: string;
  categoryId: string;
  category: Category;

  bankAccountId?: string | null;
  bankAccount?: BankAccount | null;

  creditCardId?: string | null;
  creditCard?: CreditCard | null;
}

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  isPaid: boolean;
  paymentMethod?: string;
  categoryId: string;
  bankAccountId?: string;
  creditCardId?: string;
}

export interface UpdateTransactionData {
  description?: string;
  amount?: number;
  type?: TransactionType;
  date?: string;
  isPaid?: boolean;
  paymentMethod?: string | null;
  categoryId?: string;
  bankAccountId?: string | null;
  creditCardId?: string | null;
}
