import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

export const validateRequest =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.issues.reduce((acc, issue) => {
        const key = issue.path.join(".");
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(issue.message);
        return acc;
      }, {} as Record<string, string[]>);
      throw new BadRequestError("Invalid input data.", fieldErrors);
    }

    // Isso remove quaisquer propriedades extras que o usuário possa ter enviado
    if (validationResult.data.body) {
      req.body = validationResult.data.body;
    }
    if (validationResult.data.query) {
      req.query = validationResult.data.query as typeof req.query;
    }
    if (validationResult.data.params) {
      req.params = validationResult.data.params as typeof req.params;
    }

    return next();
  };
