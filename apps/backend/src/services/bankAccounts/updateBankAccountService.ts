import { BankAccountRepository } from "../../repositories/bankAccountRepository";
import { NotFoundError } from "../../errors/NotFoundError";

interface UpdateBankAccountRequest {
  id: string;
  name?: string;
  bank?: string;
  bankLogo?: string;
  initialBalance?: number;
  hasCreditCard?: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
}

export class UpdateBankAccountService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(data: UpdateBankAccountRequest) {
    const existingAccount = await this.bankAccountRepository.findById(data.id);

    if (!existingAccount) {
      throw new NotFoundError("Bank account not found.");
    }

    const updatedAccount = await this.bankAccountRepository.update(data.id, {
      name: data.name,
      bank: data.bank,
      bankLogo: data.bankLogo,
      initialBalance: data.initialBalance,
      hasCreditCard: data.hasCreditCard,
      creditCardLimit: data.creditCardLimit,
      invoiceClosingDay: data.invoiceClosingDay,
      invoiceDueDay: data.invoiceDueDay,
    });

    return { bankAccount: updatedAccount };
  }
}
