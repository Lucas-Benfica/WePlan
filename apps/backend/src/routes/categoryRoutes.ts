import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { listCategoriesController } from "../controllers/categoriesController";

const categoryRoutes = Router();

categoryRoutes.use(authMiddleware);

categoryRoutes.get("/", listCategoriesController);

export { categoryRoutes };
