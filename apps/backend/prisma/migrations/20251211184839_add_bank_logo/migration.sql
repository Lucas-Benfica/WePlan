-- DropForeignKey
ALTER TABLE "public"."FamilyMember" DROP CONSTRAINT "FamilyMember_familyId_fkey";

-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "bankLogo" TEXT;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
