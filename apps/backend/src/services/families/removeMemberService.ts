import { FamilyRepository } from "../../repositories/familyRepository";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";

interface RemoveMemberRequest {
  adminUserId: string;
  familyId: string;
  memberIdToRemove: string;
}

export class RemoveMemberService {
  constructor(private familyRepository: FamilyRepository) {}

  async execute({
    adminUserId,
    familyId,
    memberIdToRemove,
  }: RemoveMemberRequest) {
    console.log("HERE: ", adminUserId, familyId, memberIdToRemove);
    const adminMember = await this.familyRepository.isMember(
      familyId,
      adminUserId
    );
    if (!adminMember) {
      throw new UnauthorizedError("You are not a member of this family.");
    }

    try {
      await this.familyRepository.removeMember(familyId, memberIdToRemove);
    } catch (error) {
      throw new NotFoundError("Member not found in this family.");
    }

    return { message: "Member removed successfully." };
  }
}
