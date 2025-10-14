import { Request, Response } from "express";
import { FamilyRepository } from "../repositories/familyRepository";
import { CreateFamilyService } from "../services/families/createFamilyService";

export async function createFamilyController(req: Request, res: Response) {
  const { name } = req.body;
  const adminUserId = req.user.id;

  const familyRepository = new FamilyRepository();
  const createFamilyService = new CreateFamilyService(familyRepository);

  const { family } = await createFamilyService.execute({ name, adminUserId });

  return res.status(201).json(family);
}
