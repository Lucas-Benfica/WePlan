import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { UnauthorizedError } from "../errors/UnauthorizedError";

interface TokenPayload {
  sub: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new UnauthorizedError("Authorization token not provided.");
  }

  // Formato "Bearer eyJhbGciOiJIUzI1Ni..."
  const [, token] = authorization.split(" ");

  try {
    // Verificar se o token é válido
    const decoded = verify(token, process.env.JWT_SECRET as string);

    // Extrair o ID do user e anexá-lo à requisição
    const { sub: userId } = decoded as TokenPayload;
    req.user = { id: userId };

    return next();
  } catch {
    throw new UnauthorizedError();
  }
}
