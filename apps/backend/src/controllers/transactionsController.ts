import { Request, Response } from "express";
import { TransactionRepository } from "../repositories/transactionRepository";
import { CreateTransactionService } from "../services/transactions/createTransactionService";
import { ListTransactionsService } from "../services/transactions/listTransactionsService";
import { UpdateTransactionService } from "../services/transactions/updateTransactionService";
import { DeleteTransactionService } from "../services/transactions/deleteTransactionService";
import { BadRequestError } from "../errors/BadRequestError";

function getFamilyId(req: Request): string {
  const familyId = req.headers["x-family-id"] as string;
  if (!familyId) {
    throw new BadRequestError(
      "Family ID is required in headers (x-family-id)."
    );
  }
  return familyId;
}

export async function createTransactionController(
  req: Request,
  res: Response
) {
  const familyId = getFamilyId(req);
  const createdById = req.user.id;

  const {
    description,
    amount,
    type,
    date,
    isPaid,
    paymentMethod,
    categoryId,
    bankAccountId,
    creditCardId,
  } = req.body;

  const transactionRepository = new TransactionRepository();
  const createService = new CreateTransactionService(transactionRepository);

  const { transaction } = await createService.execute({
    familyId,
    createdById,
    description,
    amount,
    type,
    date,
    isPaid,
    paymentMethod,
    categoryId,
    bankAccountId,
    creditCardId,
  });

  return res.status(201).json(transaction);
}

export async function listTransactionsController(
  req: Request,
  res: Response
) {
  const familyId = getFamilyId(req);

  const month = req.query.month ? Number(req.query.month) : undefined;
  const year = req.query.year ? Number(req.query.year) : undefined;

  const transactionRepository = new TransactionRepository();
  const listService = new ListTransactionsService(transactionRepository);

  const { transactions } = await listService.execute({ familyId, month, year });

  return res.status(200).json(transactions);
}

export async function updateTransactionController(
  req: Request,
  res: Response
) {
  const { id } = req.params;
  const {
    description,
    amount,
    type,
    date,
    isPaid,
    paymentMethod,
    categoryId,
    bankAccountId,
    creditCardId,
  } = req.body;

  const transactionRepository = new TransactionRepository();
  const updateService = new UpdateTransactionService(transactionRepository);

  const { transaction } = await updateService.execute({
    id,
    description,
    amount,
    type,
    date,
    isPaid,
    paymentMethod,
    categoryId,
    bankAccountId,
    creditCardId,
  });

  return res.status(200).json(transaction);
}

export async function deleteTransactionController(
  req: Request,
  res: Response
) {
  const { id } = req.params;

  const transactionRepository = new TransactionRepository();
  const deleteService = new DeleteTransactionService(transactionRepository);

  await deleteService.execute({ id });

  return res.status(204).send();
}
