import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createBankAccountSchema,
  updateBankAccountSchema,
} from "../schemas/bankAccountSchemas";
import {
  createBankAccountController,
  listFamilyBankAccountsController,
  updateBankAccountController,
  deleteBankAccountController,
} from "../controllers/bankAccountsController";

const bankAccountRoutes = Router();

bankAccountRoutes.use(authMiddleware);

bankAccountRoutes.post(
  "/",
  validateRequest(createBankAccountSchema),
  createBankAccountController
);
bankAccountRoutes.get("/", listFamilyBankAccountsController);
bankAccountRoutes.put(
  "/:id",
  validateRequest(updateBankAccountSchema),
  updateBankAccountController
);
bankAccountRoutes.delete("/:id", deleteBankAccountController);

export { bankAccountRoutes };
