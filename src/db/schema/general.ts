import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";
import { users } from "./users";

export const faqs = pgTable("general_faqs", {
  ...baseColumns,
  question: text().notNull(),
  answer: text().notNull(),
  category: text(),
});

export const files = pgTable("general_files", {
  ...baseColumns,
  user_id: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  original_name: text().notNull(),
  stored_name: text().notNull(),
  mime_type: text().notNull(),
  size: integer().notNull(),
  path: text().notNull(),
});
