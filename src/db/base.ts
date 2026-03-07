import { timestamp, uuid } from "drizzle-orm/pg-core";

export const baseColumns = {
  id: uuid().defaultRandom().primaryKey(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp().defaultNow().notNull(),
};
