import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { familyRoutes } from "./familyRoutes";
import { bankAccountRoutes } from "./bankAccountRoutes";

const router = Router();

router.use(userRoutes);
router.use("/families", familyRoutes);
router.use("/bank-accounts", bankAccountRoutes);

export { router };
