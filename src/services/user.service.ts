import { StatusCodes } from "http-status-codes";
import { HTTPException } from "hono/http-exception";
import { mapDefined, toNull } from "@/lib";
import { ResponseMessage } from "@/constants/response.messages";
import {
  userProfileRepository,
  userRepository,
  shopRepository,
  type UserProfile,
  type Shop,
} from "@/repositories";
import type { UpdateProfileInput } from "@/validators/user.validators";

export interface MeResponse {
  user: {
    id: string;
    email: string;
    account_status: number;
    role: number;
    created_at: Date;
    updated_at: Date;
  };
  profile: UserProfile | null;
  shop: Shop | null;
}

export class UserService {
  async getMe(userId: string): Promise<MeResponse> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: ResponseMessage.USER_NOT_FOUND,
      });
    }
    const [profile, shop] = await Promise.all([
      userProfileRepository.findByUserId(userId),
      shopRepository.findByUserId(userId),
    ]);
    return {
      user: {
        id: user.id,
        email: user.email,
        account_status: user.account_status,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      profile: profile ?? null,
      shop: shop ?? null,
    };
  }

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
