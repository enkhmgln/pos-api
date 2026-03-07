import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "@/db";
import { userProfiles } from "@/db/schema/users";
import { BaseRepository } from "./base.repository";

export type UserProfile = InferSelectModel<typeof userProfiles>;
export type UserProfileInsert = InferInsertModel<typeof userProfiles>;

class UserProfileRepository extends BaseRepository<
  typeof userProfiles,
  UserProfile,
  UserProfileInsert
> {
  constructor() {
    super(userProfiles);
  }

  findByUserId(userId: string) {
    return db.query.userProfiles.findFirst({
      where: eq(userProfiles.user_id, userId),
    });
  }
}

export const userProfileRepository = new UserProfileRepository();
