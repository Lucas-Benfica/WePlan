import { BankAccountRepository } from "../../repositories/bankAccountRepository";
import { NotFoundError } from "../../errors/NotFoundError";

interface DeleteBankAccountRequest {
  id: string;
}

export class DeleteBankAccountService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute({ id }: DeleteBankAccountRequest) {
    const account = await this.bankAccountRepository.findById(id);

    if (!account) {
      throw new NotFoundError("Bank account not found.");
    }

    // Se houver transações vinculadas, o Prisma lançará um erro
    // Sem transações, funciona direto.
    // Futuramente impedir a deleção ou deletar as transações em cascata.

    await this.bankAccountRepository.delete(id);
  }
}
