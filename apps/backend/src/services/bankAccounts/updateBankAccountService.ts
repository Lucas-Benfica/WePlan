import { BankAccountRepository } from "../../repositories/bankAccountRepository";
import { NotFoundError } from "../../errors/NotFoundError";

interface UpdateCardInput {
  id?: string;
  nickname: string;
}
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
  creditCards?: UpdateCardInput[]; // (novos e antigos)
}

export class UpdateBankAccountService {
  constructor(private bankAccountRepository: BankAccountRepository) {}

  async execute(data: UpdateBankAccountRequest) {
    const existingAccount = await this.bankAccountRepository.findById(data.id);

    if (!existingAccount) {
      throw new NotFoundError("Bank account not found.");
    }

    // --- SINCRONIZAÇÃO DE CARTÕES ---
    let cardsToCreate: { nickname: string }[] = [];
    let cardsToUpdate: { id: string; nickname: string }[] = [];
    let cardIdsToDelete: string[] = [];

    if (data.creditCards) {
      // a. Separar quem veio do front (novos vs existentes)
      cardsToCreate = data.creditCards
        .filter((c) => !c.id) // Sem ID = Novo
        .map((c) => ({ nickname: c.nickname }));

      cardsToUpdate = data.creditCards
        .filter((c) => c.id) // Com ID = Existente
        .map((c) => ({ id: c.id!, nickname: c.nickname }));

      // b. Descobrir quem foi removido
      // IDs que vieram do front
      const incomingIds = cardsToUpdate.map((c) => c.id);

      // IDs que estão no banco
      const existingIds = existingAccount.creditCards.map((c) => c.id);

      // Quem está no banco MAS NÃO está na lista do front deve ser deletado
      cardIdsToDelete = existingIds.filter((id) => !incomingIds.includes(id));
    }

    // 2. Chamar o repositório com as instruções
    const updatedAccount = await this.bankAccountRepository.updateWithCards(
      data.id,
      {
        name: data.name,
        bank: data.bank,
        bankLogo: data.bankLogo,
        initialBalance: data.initialBalance,
        hasCreditCard: data.hasCreditCard,
        creditCardLimit: data.creditCardLimit,
        invoiceClosingDay: data.invoiceClosingDay,
        invoiceDueDay: data.invoiceDueDay,
        // creditCards: não passamos aqui direto, pois o repositório vai lidar
      },
      cardsToCreate,
      cardsToUpdate,
      cardIdsToDelete
    );

    return { bankAccount: updatedAccount };
  }
}
