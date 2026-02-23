import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transactionSchemas";
import {
  createTransactionController,
  listTransactionsController,
  updateTransactionController,
  deleteTransactionController,
} from "../controllers/transactionsController";

const transactionRoutes = Router();

transactionRoutes.use(authMiddleware);

transactionRoutes.post(
  "/",
  validateRequest(createTransactionSchema),
  createTransactionController
);
transactionRoutes.get("/", listTransactionsController);
transactionRoutes.put(
  "/:id",
  validateRequest(updateTransactionSchema),
  updateTransactionController
);
transactionRoutes.delete("/:id", deleteTransactionController);

export { transactionRoutes };
