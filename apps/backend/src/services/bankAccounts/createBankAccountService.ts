import { BankAccountRepository } from "../../repositories/bankAccountRepository";

interface CreateCreditCardInput {
  nickname: string;
}

interface CreateBankAccountRequest {
  familyId: string;
  name: string;
  bank: string;
  bankLogo?: string;
  initialBalance: number;
  hasCreditCard: boolean;
  creditCardLimit?: number;
  invoiceClosingDay?: number;
  invoiceDueDay?: number;
  creditCards?: CreateCreditCardInput[];
}

export class CreateBankAccountService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(data: CreateBankAccountRequest) {
    const createdAccount = await this.bankAccountRepository.create({
      family: { connect: { id: data.familyId } },
      name: data.name,
      bank: data.bank,
      bankLogo: data.bankLogo,
      initialBalance: data.initialBalance,
      hasCreditCard: data.hasCreditCard,
      creditCardLimit: data.creditCardLimit,
      invoiceClosingDay: data.invoiceClosingDay,
      invoiceDueDay: data.invoiceDueDay,
      creditCards: {
        create:
          data.creditCards?.map((card) => ({
            nickname: card.nickname,
          })) || [],
      },
    });

    return { bankAccount: createdAccount };
  }
}
