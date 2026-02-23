import { TransactionRepository } from "../../repositories/transactionRepository";

interface CreateTransactionRequest {
  familyId: string;
  createdById: string;
  description: string;
  amount: number;
  type: string;
  date: string;
  isPaid: boolean;
  paymentMethod?: string;
  categoryId: string;
  bankAccountId?: string;
  creditCardId?: string;
}

export class CreateTransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(data: CreateTransactionRequest) {
    const transaction = await this.transactionRepository.create({
      description: data.description,
      amount: data.amount,
      type: data.type,
      date: new Date(data.date),
      isPaid: data.isPaid,
      paymentMethod: data.paymentMethod,
      paidAt: data.isPaid ? new Date() : null,
      family: { connect: { id: data.familyId } },
      category: { connect: { id: data.categoryId } },
      createdBy: { connect: { id: data.createdById } },
      ...(data.bankAccountId && {
        bankAccount: { connect: { id: data.bankAccountId } },
      }),
      ...(data.creditCardId && {
        creditCard: { connect: { id: data.creditCardId } },
      }),
    });

    return { transaction };
  }
}
