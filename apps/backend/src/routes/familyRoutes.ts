import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createFamilySchema } from "../schemas/familySchemas";
import { createFamilyController } from "../controllers/familiesController";
import { authMiddleware } from "../middlewares/authMiddleware";

const familyRoutes = Router();

familyRoutes.use(authMiddleware);

familyRoutes.post(
  "/",
  validateRequest(createFamilySchema),
  createFamilyController
);

export { familyRoutes };
