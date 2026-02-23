import { api } from "./api";
import type { Category } from "../types/Category";

export const categoryService = {
  async getAll(familyId: string) {
    const response = await api.get<Category[]>("/categories", {
      headers: {
        "x-family-id": familyId,
      },
    });
    return response.data;
  },
};
