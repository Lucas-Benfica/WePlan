import { BankAccountRepository } from "../../repositories/bankAccountRepository";

export class ListFamilyBankAccountsService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(familyId: string) {
    const bankAccounts = await this.bankAccountRepository.findAllByFamilyId(
      familyId
    );
    return { bankAccounts };
  }
}
