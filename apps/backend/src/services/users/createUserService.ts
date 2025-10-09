import { hash } from "bcryptjs";
import { UserRepository } from "../../repositories/userRepository";
import { User } from "@prisma/client";
import { ConflictError } from "../../errors/ConflictError";

interface CreateUserServiceRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateUserServiceResponse {
  user: Omit<User, "password">;
}

export class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: CreateUserServiceRequest): Promise<CreateUserServiceResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new ConflictError("User with this email already exists.");
    }

    const passwordHash = await hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      password: passwordHash,
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
    };
  }
}
