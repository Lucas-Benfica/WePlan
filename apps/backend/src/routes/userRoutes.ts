import { Router } from "express";
import { createUserController } from "../controllers/usersController";

const userRoutes = Router();

userRoutes.post("/users", createUserController);

export { userRoutes };
