import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

interface FindAllFilters {
  month?: number;
  year?: number;
}

export class TransactionRepository {
  async create(data: Prisma.TransactionCreateInput) {
    return prisma.transaction.create({
      data,
      include: {
        category: true,
        bankAccount: true,
        creditCard: true,
      },
    });
  }

  async findAllByFamilyId(familyId: string, filters?: FindAllFilters) {
    const where: Prisma.TransactionWhereInput = { familyId };

    if (filters?.month !== undefined && filters?.year !== undefined) {
      const startDate = new Date(filters.year, filters.month - 1, 1);
      const endDate = new Date(filters.year, filters.month, 0, 23, 59, 59, 999);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.transaction.findMany({
      where,
      include: {
        category: true,
        bankAccount: {
          include: {
            creditCards: true,
          },
        },
        creditCard: true,
      },
      orderBy: {
        date: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        bankAccount: true,
        creditCard: true,
      },
    });
  }

  async update(id: string, data: Prisma.TransactionUpdateInput) {
    return prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
        bankAccount: true,
        creditCard: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.transaction.delete({
      where: { id },
    });
  }
}
