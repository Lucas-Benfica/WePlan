import { Request, Response } from "express";
import { FamilyRepository } from "../repositories/familyRepository";
import { CreateFamilyService } from "../services/families/createFamilyService";
import { ListUserFamiliesService } from "../services/families/listUserFamiliesService";
import { JoinFamilyService } from "../services/families/joinFamilyService";
import { RemoveMemberService } from "../services/families/removeMemberService";

export async function createFamilyController(req: Request, res: Response) {
  const { name } = req.body;
  const adminUserId = req.user.id;

  const familyRepository = new FamilyRepository();
  const createFamilyService = new CreateFamilyService(familyRepository);

  const { family } = await createFamilyService.execute({ name, adminUserId });

  return res.status(201).json(family);
}

export async function listUserFamiliesController(req: Request, res: Response) {
  const userId = req.user.id;
  const familyRepository = new FamilyRepository();
  const listUserFamiliesService = new ListUserFamiliesService(familyRepository);

  const { families } = await listUserFamiliesService.execute(userId);

  return res.status(200).json(families);
}

export async function joinFamilyController(req: Request, res: Response) {
  const { familyId } = req.body;
  const userId = req.user.id;

  const familyRepository = new FamilyRepository();
  const joinService = new JoinFamilyService(familyRepository);

  await joinService.execute({ userId, familyId });

  return res.status(200).json({ message: "Successfully joined the family." });
}

export async function removeMemberController(req: Request, res: Response) {
  const { familyId, memberId } = req.body;
  const adminUserId = req.user.id;

  const familyRepository = new FamilyRepository();
  const removeMemberService = new RemoveMemberService(familyRepository);

  await removeMemberService.execute({
    adminUserId,
    familyId,
    memberIdToRemove: memberId,
  });

  return res.status(200).json({ message: "Member removed successfully." });
}
