import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createFamilySchema } from "../schemas/familySchemas";
import { createFamilyController, joinFamilyController, listUserFamiliesController, removeMemberController } from "../controllers/familiesController";
import { authMiddleware } from "../middlewares/authMiddleware";

const familyRoutes = Router();

familyRoutes.use(authMiddleware);

familyRoutes.post(
  "/",
  validateRequest(createFamilySchema),
  createFamilyController
);
familyRoutes.get("/", listUserFamiliesController);
familyRoutes.post("/join", joinFamilyController);
familyRoutes.delete('/:familyId/members/:memberId', removeMemberController);

export { familyRoutes };
