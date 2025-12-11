/*
  Warnings:

  - A unique constraint covering the columns `[familyId,name,type]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `color` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_familyId_fkey";

-- DropIndex
DROP INDEX "public"."Category_familyId_name_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_familyId_name_type_key" ON "Category"("familyId", "name", "type");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
