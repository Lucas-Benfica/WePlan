import { api } from "./api";
import type { BankAccount } from "../types/BankAccount";

interface CreateCreditCardInput {
  nickname: string;
}

interface CreateBankAccountRequest {
  name: string;
  bank: string;
  bankLogo?: string;
  initialBalance: number;
  hasCreditCard: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
  creditCards?: CreateCreditCardInput[];
}

interface UpdateBankAccountRequest {
  name?: string;
  bank?: string;
  bankLogo?: string;
  initialBalance?: number;
  hasCreditCard?: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
}

export const bankAccountService = {
  async create(data: CreateBankAccountRequest, familyId: string) {
    const response = await api.post<BankAccount>("/bank-accounts", data, {
      headers: {
        "x-family-id": familyId,
      },
    });
    return response.data;
  },

  async getAll(familyId: string) {
    const response = await api.get<BankAccount[]>("/bank-accounts", {
      headers: {
        "x-family-id": familyId,
      },
    });
    return response.data;
  },

  async update(id: string, data: UpdateBankAccountRequest) {
    const response = await api.put<BankAccount>(`/bank-accounts/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/bank-accounts/${id}`);
  },
};
