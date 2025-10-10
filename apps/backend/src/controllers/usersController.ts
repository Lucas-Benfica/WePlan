import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { CreateUserService } from "../services/users/createUserService";
import { AuthenticateUserService } from "../services/users/authenticateUserService";

export async function createUserController(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const userRepository = new UserRepository();
  const createUserService = new CreateUserService(userRepository);

  const { user } = await createUserService.execute({ name, email, password });

  return res.status(201).json(user);
}

export async function authenticateUserController(req: Request, res: Response) {
  const { email, password } = req.body;

  const userRepository = new UserRepository();
  const authenticateUserService = new AuthenticateUserService(userRepository);

  const { token } = await authenticateUserService.execute({ email, password });

  return res.status(200).json({ token });
}
