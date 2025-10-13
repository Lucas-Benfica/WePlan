import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { UserRepository } from "../../repositories/userRepository";
import { InvalidCredentialsError } from "../../errors/InvalidCredentialsError";

interface AuthenticateUserServiceRequest {
  email: string;
  password: string;
}

interface AuthenticateUserServiceResponse {
  token: string;
}

export class AuthenticateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserServiceRequest): Promise<AuthenticateUserServiceResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatch = await compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    // Gerar o token JWT
    const token = sign(
      {}, // Payload (podemos adicionar dados como roles aqui no futuro)
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "1d", // Duração do token (expira em 1 dia)
      }
    );

    return { token };
  }
}
