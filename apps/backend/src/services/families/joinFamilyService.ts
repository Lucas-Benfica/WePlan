import { FamilyRepository } from "../../repositories/familyRepository";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";

interface JoinFamilyRequest {
  userId: string;
  familyId: string;
}

export class JoinFamilyService {
  constructor(private familyRepository: FamilyRepository) {}

  async execute({ userId, familyId }: JoinFamilyRequest) {
    const family = await this.familyRepository.findById(familyId);

    if (!family) {
      throw new NotFoundError("Family not found or invalid invite code.");
    }

    const isAlreadyMember = await this.familyRepository.isMember(
      familyId,
      userId
    );

    if (isAlreadyMember) {
      throw new ConflictError("You are already a member of this family.");
    }

    await this.familyRepository.addMember(familyId, userId);

    return { message: "Successfully joined the family." };
  }
}
