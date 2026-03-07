import {
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import {
  NOTIFICATION_TYPES,
  type NotificationType,
} from "@/constants/constant";
import { users } from "./users";

export const notifications = pgTable("notifications", {
  ...baseColumns,
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text(),
  body: text().notNull(),
  type: smallint()
    .$type<NotificationType>()
    .notNull()
    .default(NOTIFICATION_TYPES.SYSTEM),
  read_at: timestamp({ withTimezone: true }),
  data: jsonb(),
});

export const fcmTokens = pgTable("notifications_fcm_tokens", {
  ...baseColumns,
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text().notNull(),
  device_id: text(),
});
