-- DropForeignKey
ALTER TABLE "public"."CreditCard" DROP CONSTRAINT "CreditCard_bankAccountId_fkey";

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
