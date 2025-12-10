import { FamilyRepository } from "../../repositories/familyRepository";

export class ListUserFamiliesService {
  constructor(private familyRepository: FamilyRepository) {}

  async execute(userId: string) {
    const families = await this.familyRepository.findAllByUserId(userId);
    return { families };
  }
}
