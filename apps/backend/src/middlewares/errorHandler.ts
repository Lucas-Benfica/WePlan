import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

class HandledError extends AppError {
  public details?: object;
}

export function errorHandler(
  error: HandledError | Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message,
      details: "details" in error ? error.details : undefined,
    });
  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
