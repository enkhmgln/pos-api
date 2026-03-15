import {
  date,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import {
  ACCOUNT_STATUS,
  USER_ROLES,
  type AccountStatus,
  type OtpPurpose,
  type UserRole,
} from "@/constants/constant";

export const users = pgTable("users", {
  ...baseColumns,
  email: text().notNull().unique(),
  password: text().notNull(),
  account_status: smallint()
    .$type<AccountStatus>()
    .notNull()
    .default(ACCOUNT_STATUS.ACTIVE),
  role: smallint().$type<UserRole>().notNull().default(USER_ROLES.USER),
});

export const userProfiles = pgTable("users_profile", {
  ...baseColumns,
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  first_name: text(),
  last_name: text(),
  phone: text(),
  avatar_file_id: uuid(),
  location: text(),
  birthdate: date(),
});

export const shops = pgTable("users_shop", {
  ...baseColumns,
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text().notNull(),
  currency: text().notNull(),
  timezone: text().notNull(),
  phone: text(),
  address: text(),
});

export const usersOtp = pgTable("users_otp", {
  ...baseColumns,
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  otp: text().notNull(),
  purpose: smallint().$type<OtpPurpose>().notNull(),
  expires_at: timestamp().notNull(),
  used_at: timestamp(),
});
