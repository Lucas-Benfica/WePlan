import { Request, Response } from "express";
import { BankAccountRepository } from "../repositories/bankAccountRepository";
import { CreateBankAccountService } from "../services/bankAccounts/createBankAccountService";
import { ListFamilyBankAccountsService } from "../services/bankAccounts/listFamilyBankAccountsService";
import { BadRequestError } from "../errors/BadRequestError";
import { DeleteBankAccountService } from "../services/bankAccounts/deleteBankAccountService";
import { UpdateBankAccountService } from "../services/bankAccounts/updateBankAccountService";

export async function createBankAccountController(req: Request, res: Response) {
  const {
    name,
    bank,
    bankLogo,
    initialBalance,
    hasCreditCard,
    creditCardLimit,
    invoiceClosingDay,
    invoiceDueDay,
    creditCards,
  } = req.body;

  const familyId = req.headers["x-family-id"] as string;

  if (!familyId) {
    throw new BadRequestError(
      "Family ID is required in headers (x-family-id)."
    );
  }

  const bankAccountRepository = new BankAccountRepository();
  const createService = new CreateBankAccountService(bankAccountRepository);

  const { bankAccount } = await createService.execute({
    familyId,
    name,
    bank,
    bankLogo,
    initialBalance,
    hasCreditCard,
    creditCardLimit,
    invoiceClosingDay,
    invoiceDueDay,
    creditCards,
  });

  return res.status(201).json(bankAccount);
}

export async function listFamilyBankAccountsController(
  req: Request,
  res: Response
) {
  const familyId = req.headers["x-family-id"] as string;

  if (!familyId) {
    throw new BadRequestError(
      "Family ID is required in headers (x-family-id)."
    );
  }

  const bankAccountRepository = new BankAccountRepository();
  const listService = new ListFamilyBankAccountsService(bankAccountRepository);

  const { bankAccounts } = await listService.execute(familyId);

  return res.status(200).json(bankAccounts);
}

export async function updateBankAccountController(req: Request, res: Response) {
  const { id } = req.params;
  const {
    name,
    bank,
    bankLogo,
    initialBalance,
    hasCreditCard,
    creditCardLimit,
    invoiceClosingDay,
    invoiceDueDay,
    creditCards,
  } = req.body;

  const bankAccountRepository = new BankAccountRepository();
  const updateService = new UpdateBankAccountService(bankAccountRepository);

  const { bankAccount } = await updateService.execute({
    id,
    name,
    bank,
    bankLogo,
    initialBalance,
    hasCreditCard,
    creditCardLimit,
    invoiceClosingDay,
    invoiceDueDay,
    creditCards,
  });

  return res.status(200).json(bankAccount);
}

export async function deleteBankAccountController(req: Request, res: Response) {
  const { id } = req.params;

  const bankAccountRepository = new BankAccountRepository();
  const deleteService = new DeleteBankAccountService(bankAccountRepository);

  await deleteService.execute({ id });

  return res.status(204).send();
}
