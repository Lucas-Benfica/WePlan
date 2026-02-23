import { TransactionRepository } from "../../repositories/transactionRepository";
import { NotFoundError } from "../../errors/NotFoundError";

interface DeleteTransactionRequest {
  id: string;
}

export class DeleteTransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({ id }: DeleteTransactionRequest) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundError("Transaction not found.");
    }

    await this.transactionRepository.delete(id);
  }
}
