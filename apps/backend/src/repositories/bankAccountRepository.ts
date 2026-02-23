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
  async updateWithCards(
    id: string,
    data: Prisma.BankAccountUpdateInput,
    cardsToCreate: { nickname: string }[],
    cardsToUpdate: { id: string; nickname: string }[],
    cardIdsToDelete: string[]
  ) {
    return prisma.$transaction(async (tx) => {
      // 1. "Desvincular" transações dos cartões que serão excluídos
      // Mantemos o bankAccountId, mas removemos o creditCardId
      if (cardIdsToDelete.length > 0) {
        await tx.transaction.updateMany({
          where: {
            creditCardId: { in: cardIdsToDelete },
          },
          data: {
            creditCardId: null,
          },
        });

        // 2. Deletar os cartões
        await tx.creditCard.deleteMany({
          where: {
            id: { in: cardIdsToDelete },
          },
        });
      }

      // 3. Atualizar cartões existentes (um por um)
      for (const card of cardsToUpdate) {
        await tx.creditCard.update({
          where: { id: card.id },
          data: { nickname: card.nickname },
        });
      }

      // 4. Criar novos cartões e atualizar a conta
      return tx.bankAccount.update({
        where: { id },
        data: {
          ...data,
          creditCards: {
            create: cardsToCreate, // Cria os novos
          },
        },
        include: {
          creditCards: true,
        },
      });
    });
  }
}
