import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { familyRoutes } from "./familyRoutes";
import { bankAccountRoutes } from "./bankAccountRoutes";
import { transactionRoutes } from "./transactionRoutes";
import { categoryRoutes } from "./categoryRoutes";

const router = Router();

router.use(userRoutes);
router.use("/families", familyRoutes);
router.use("/bank-accounts", bankAccountRoutes);
router.use("/transactions", transactionRoutes);
router.use("/categories", categoryRoutes);

export { router };
