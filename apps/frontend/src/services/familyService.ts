import { api } from "./api";
import type { Family } from "../types/Family";

interface CreateFamilyRequest {
  name: string;
}

interface JoinFamilyRequest {
  familyId: string;
}

export const familyService = {
  async getMyFamilies() {
    const { data } = await api.get<Family[]>("/families");
    return data;
  },

  async createFamily(data: CreateFamilyRequest) {
    const { data: family } = await api.post<Family>("/families", data);
    return family;
  },

  async joinFamily(data: JoinFamilyRequest) {
    await api.post("/families/join", data);
  },

  async removeMember(familyId: string, memberId: string) {
    await api.delete(`/families/${familyId}/members/${memberId}`);
  },
};
