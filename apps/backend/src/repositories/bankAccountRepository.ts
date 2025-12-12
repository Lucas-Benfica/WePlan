import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export class BankAccountRepository {
  async create(data: Prisma.BankAccountCreateInput) {
    return prisma.bankAccount.create({
      data,
      include: {
        creditCards: true, // Retorna os cartões criados junto
      },
    });
  }

  async findAllByFamilyId(familyId: string) {
    return prisma.bankAccount.findMany({
      where: { familyId },
      include: {
        creditCards: true, // Inclui os cartões de crédito associados
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async findById(id: string) {
    return prisma.bankAccount.findUnique({
      where: { id },
      include: { creditCards: true },
    });
  }

  async update(id: string, data: Prisma.BankAccountUpdateInput) {
    return prisma.bankAccount.update({
      where: { id },
      data,
      include: {
        creditCards: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.bankAccount.delete({
      where: { id },
    });
  }
}
