import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createUserSchema,
  authenticateUserSchema,
} from "../schemas/userSchemas";
import {
  createUserController,
  authenticateUserController,
} from "../controllers/usersController";

const userRoutes = Router();

userRoutes.post(
  "/users",
  validateRequest(createUserSchema),
  createUserController
);
userRoutes.post(
  "/login",
  validateRequest(authenticateUserSchema),
  authenticateUserController
);

export { userRoutes };
