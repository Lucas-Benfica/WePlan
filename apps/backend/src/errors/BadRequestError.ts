import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  // O 'details' serve para enviar os erros de validação do Zod
  constructor(message: string, public details?: object) {
    super(message, 400); // Status code 400
  }
}
