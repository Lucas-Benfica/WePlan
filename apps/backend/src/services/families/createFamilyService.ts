import { FamilyRepository } from "../../repositories/familyRepository";
import { Family } from "@prisma/client";
import { ConflictError } from "../../errors/ConflictError";

interface CreateFamilyServiceRequest {
  name: string;
  adminUserId: string;
}

interface CreateFamilyServiceResponse {
  family: Family;
}

export class CreateFamilyService {
  constructor(private familyRepository: FamilyRepository) {}

  async execute({
    name,
    adminUserId,
  }: CreateFamilyServiceRequest): Promise<CreateFamilyServiceResponse> {
    const family = await this.familyRepository.createWithAdminMember(
      name,
      adminUserId
    );

    return { family };
  }
}
