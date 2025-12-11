import { prisma } from "../lib/prisma";
import { Prisma, Family } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../utils/defaultCategories";

export class FamilyRepository {
  async createWithAdminMember(familyName: string, adminUserId: string) {
    const family = await prisma.$transaction(async (tx) => {
      // 1. Criar a família
      const newFamily = await tx.family.create({
        data: {
          name: familyName,
        },
      });

      // 2. Adicionar o criador como admin
      await tx.familyMember.create({
        data: {
          familyId: newFamily.id,
          userId: adminUserId,
          role: "admin",
        },
      });

      // 3. Criar as Categorias Padrão
      await tx.category.createMany({
        data: DEFAULT_CATEGORIES.map((category) => ({
          ...category,
          familyId: newFamily.id,
        })),
      });

      return newFamily;
    });

    return family;
  }

  async findById(familyId: string) {
    return prisma.family.findUnique({
      where: { id: familyId },
    });
  }

  async findAllByUserId(userId: string) {
    return prisma.family.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  async isMember(familyId: string, userId: string) {
    const member = await prisma.familyMember.findUnique({
      where: {
        userId_familyId: {
          userId,
          familyId,
        },
      },
    });
    return !!member;
  }

  async addMember(familyId: string, userId: string, role = "member") {
    return prisma.familyMember.create({
      data: {
        familyId,
        userId,
        role,
      },
    });
  }

  async removeMember(familyId: string, userId: string) {
    return prisma.familyMember.delete({
      where: {
        userId_familyId: {
          userId,
          familyId,
        },
      },
    });
  }
}
