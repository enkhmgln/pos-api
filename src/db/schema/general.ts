import { pgTable, text } from "drizzle-orm/pg-core";
import { baseColumns } from "../base";

export const faqs = pgTable("general_faqs", {
  ...baseColumns,
  question: text().notNull(),
  answer: text().notNull(),
  category: text(),
});
