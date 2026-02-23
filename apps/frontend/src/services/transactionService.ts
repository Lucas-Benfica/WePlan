import { api } from "./api";
import type {
  Transaction,
  CreateTransactionData,
  UpdateTransactionData,
} from "../types/Transaction";

export const transactionService = {
  async getAll(familyId: string, month?: number, year?: number) {
    const params: Record<string, string> = {};
    if (month !== undefined) params.month = String(month);
    if (year !== undefined) params.year = String(year);

    const response = await api.get<Transaction[]>("/transactions", {
      headers: { "x-family-id": familyId },
      params,
    });
    return response.data;
  },

  async create(data: CreateTransactionData, familyId: string) {
    const response = await api.post<Transaction>("/transactions", data, {
      headers: { "x-family-id": familyId },
    });
    return response.data;
  },

  async update(id: string, data: UpdateTransactionData) {
    const response = await api.put<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await api.delete(`/transactions/${id}`);
  },
};
