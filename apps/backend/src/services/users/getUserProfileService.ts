import { User } from "@prisma/client";
import { UserRepository } from "../../repositories/userRepository";
import { NotFoundError } from "../../errors/NotFoundError";

interface GetUserProfileServiceRequest {
  userId: string;
}

interface GetUserProfileServiceResponse {
  user: Omit<User, "password">;
}

export class GetUserProfileService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword };
  }
}
