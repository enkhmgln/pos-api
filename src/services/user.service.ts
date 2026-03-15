import { mapDefined, toNull } from "@/lib";
import { userProfileRepository, type UserProfile } from "@/repositories";
import type { UpdateProfileInput } from "@/validators/user.validators";

export class UserService {
  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<UserProfile> {
    const profile = await userProfileRepository.findByUserId(userId);
    const payload = mapDefined(data, (v) => toNull(v as string));
    if (profile) {
      const updated = await userProfileRepository.update(profile.id, payload);
      return updated[0] as UserProfile;
    }
    const created = await userProfileRepository.create({
      user_id: userId,
      ...payload,
    });
    return created[0] as UserProfile;
  }
}

export const userService = new UserService();
