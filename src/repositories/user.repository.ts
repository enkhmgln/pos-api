import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { BaseRepository } from "./base.repository";

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

class UserRepository extends BaseRepository<typeof users, User, UserInsert> {
  constructor() {
    super(users);
  }

  findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase().trim()),
    });
  }
}

export const userRepository = new UserRepository();
