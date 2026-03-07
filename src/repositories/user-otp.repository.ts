import { and, eq, gt, isNull } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { OtpPurpose } from "@/constants/constant";
import { db } from "@/db";
import { usersOtp } from "@/db/schema/users";
import { BaseRepository } from "./base.repository";

export type UserOtp = InferSelectModel<typeof usersOtp>;
export type UserOtpInsert = InferInsertModel<typeof usersOtp>;

class UserOtpRepository extends BaseRepository<
  typeof usersOtp,
  UserOtp,
  UserOtpInsert
> {
  constructor() {
    super(usersOtp);
  }

  findByUserId(userId: string) {
    return db.query.usersOtp.findMany({
      where: eq(usersOtp.user_id, userId),
    });
  }

  findByUserIdAndPurpose(userId: string, purpose: OtpPurpose) {
    return db.query.usersOtp.findMany({
      where: and(eq(usersOtp.user_id, userId), eq(usersOtp.purpose, purpose)),
    });
  }

  findValidOtp(userId: string, purpose: OtpPurpose, otp: string) {
    return db.query.usersOtp.findFirst({
      where: and(
        eq(usersOtp.user_id, userId),
        eq(usersOtp.purpose, purpose),
        eq(usersOtp.otp, otp),
        isNull(usersOtp.used_at),
        gt(usersOtp.expires_at, new Date()),
      ),
    });
  }

  deleteByUserIdAndPurpose(userId: string, purpose: OtpPurpose) {
    return db
      .delete(usersOtp)
      .where(
        and(
          eq(usersOtp.user_id, userId),
          eq(usersOtp.purpose, purpose),
        ),
      );
  }
}

export const userOtpRepository = new UserOtpRepository();
