import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { familyRoutes } from "./familyRoutes";

const router = Router();

router.use(userRoutes);
router.use("/families", familyRoutes);

export { router };
