import { TransactionRepository } from "../../repositories/transactionRepository";
import { NotFoundError } from "../../errors/NotFoundError";

interface UpdateTransactionRequest {
  id: string;
  description?: string;
  amount?: number;
  type?: string;
  date?: string;
  isPaid?: boolean;
  paymentMethod?: string | null;
  categoryId?: string;
  bankAccountId?: string | null;
  creditCardId?: string | null;
}

export class UpdateTransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(data: UpdateTransactionRequest) {
    const existing = await this.transactionRepository.findById(data.id);

    if (!existing) {
      throw new NotFoundError("Transaction not found.");
    }

    const transaction = await this.transactionRepository.update(data.id, {
      ...(data.description !== undefined && { description: data.description }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.isPaid !== undefined && {
        isPaid: data.isPaid,
        paidAt: data.isPaid ? new Date() : null,
      }),
      ...(data.paymentMethod !== undefined && {
        paymentMethod: data.paymentMethod,
      }),
      ...(data.categoryId !== undefined && {
        category: { connect: { id: data.categoryId } },
      }),
      // bankAccountId: null desvincula; string conecta
      ...(data.bankAccountId === null
        ? { bankAccount: { disconnect: true } }
        : data.bankAccountId !== undefined
        ? { bankAccount: { connect: { id: data.bankAccountId } } }
        : {}),
      // creditCardId: null desvincula; string conecta
      ...(data.creditCardId === null
        ? { creditCard: { disconnect: true } }
        : data.creditCardId !== undefined
        ? { creditCard: { connect: { id: data.creditCardId } } }
        : {}),
    });

    return { transaction };
  }
}
