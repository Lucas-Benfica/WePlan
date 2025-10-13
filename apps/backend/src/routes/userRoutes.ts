import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createUserSchema,
  authenticateUserSchema,
} from "../schemas/userSchemas";
import {
  createUserController,
  authenticateUserController,
  getUserProfileController,
} from "../controllers/usersController";
import { authMiddleware } from "../middlewares/authMiddleware";

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
userRoutes.get("/me", authMiddleware, getUserProfileController);

export { userRoutes };
