import { TransactionRepository } from "../../repositories/transactionRepository";

interface ListTransactionsRequest {
  familyId: string;
  month?: number;
  year?: number;
}

export class ListTransactionsService {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute({ familyId, month, year }: ListTransactionsRequest) {
    const transactions = await this.transactionRepository.findAllByFamilyId(
      familyId,
      { month, year }
    );

    return { transactions };
  }
}
