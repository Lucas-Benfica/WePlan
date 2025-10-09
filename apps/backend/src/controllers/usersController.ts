import { Request, Response } from "express";
import { createUserBodySchema } from "../schemas/userSchemas";
import { UserRepository } from "../repositories/userRepository";
import { CreateUserService } from "../services/users/createUserService";
import { BadRequestError } from "../errors/BadRequestError";

export async function createUserController(req: Request, res: Response) {
  const validationResult = createUserBodySchema.safeParse(req.body);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.issues.reduce((acc, issue) => {
      const key = issue.path[0] as string;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(issue.message);
      return acc;
    }, {} as Record<string, string[]>);

    throw new BadRequestError("Invalid input data.", fieldErrors);
  }

  const { name, email, password } = validationResult.data;

  const userRepository = new UserRepository();
  const createUserService = new CreateUserService(userRepository);

  const { user } = await createUserService.execute({ name, email, password });

  return res.status(201).json(user);
}
