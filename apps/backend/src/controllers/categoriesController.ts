import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { BadRequestError } from "../errors/BadRequestError";

export async function listCategoriesController(req: Request, res: Response) {
  const familyId = req.headers["x-family-id"] as string;

  if (!familyId) {
    throw new BadRequestError(
      "Family ID is required in headers (x-family-id)."
    );
  }

  const categories = await prisma.category.findMany({
    where: { familyId },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return res.status(200).json(categories);
}
