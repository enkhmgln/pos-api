import { toNull } from "@/lib";
import { userProfileRepository, type UserProfile } from "@/repositories";
import type { UpdateProfileInput } from "@/validators/user.validators";

export class UserService {
  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
  ): Promise<UserProfile> {
    const profile = await userProfileRepository.findByUserId(userId);
    const payload = {
      ...(data.first_name !== undefined && {
        first_name: toNull(data.first_name),
      }),
      ...(data.last_name !== undefined && {
        last_name: toNull(data.last_name),
      }),
      ...(data.phone !== undefined && { phone: toNull(data.phone) }),
      ...(data.avatar_url !== undefined && {
        avatar_url: toNull(data.avatar_url),
      }),
      ...(data.location !== undefined && {
        location: toNull(data.location),
      }),
      ...(data.birthdate !== undefined && {
        birthdate: toNull(data.birthdate),
      }),
    };
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
