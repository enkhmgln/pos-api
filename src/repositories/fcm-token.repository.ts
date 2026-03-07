import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "@/db";
import { fcmTokens } from "@/db/schema/notifications";
import { BaseRepository } from "./base.repository";

export type FcmToken = InferSelectModel<typeof fcmTokens>;
export type FcmTokenInsert = InferInsertModel<typeof fcmTokens>;

class FcmTokenRepository extends BaseRepository<
  typeof fcmTokens,
  FcmToken,
  FcmTokenInsert
> {
  constructor() {
    super(fcmTokens);
  }

  findByUserId(userId: string) {
    return db.query.fcmTokens.findMany({
      where: eq(fcmTokens.user_id, userId),
    });
  }
}

export const fcmTokenRepository = new FcmTokenRepository();
