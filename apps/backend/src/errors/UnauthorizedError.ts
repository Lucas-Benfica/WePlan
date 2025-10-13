import { AppError } from "./AppError";

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication token is missing or invalid.') {
    super(message, 401); // 401 Unauthorized
  }
}
