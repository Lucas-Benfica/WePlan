import { prisma } from "../lib/prisma";
import { Prisma, Family } from "@prisma/client";

export class FamilyRepository {
  async createWithAdminMember(familyName: string, adminUserId: string) {
    // Transação para garantir a atomicidade
    const family = await prisma.$transaction(async (tx) => {
      // 1. Criar a família
      const newFamily = await tx.family.create({
        data: {
          name: familyName,
        },
      });

      // Adicionar o criador como o primeiro membro com o papel de 'admin'
      await tx.familyMember.create({
        data: {
          familyId: newFamily.id,
          userId: adminUserId,
          role: "admin",
        },
      });

      return newFamily;
    });

    return family;
  }

  
}
