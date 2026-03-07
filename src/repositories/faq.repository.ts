import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { faqs } from "@/db/schema/general";
import { BaseRepository } from "./base.repository";

export type Faq = InferSelectModel<typeof faqs>;
export type FaqInsert = InferInsertModel<typeof faqs>;

class FaqRepository extends BaseRepository<typeof faqs, Faq, FaqInsert> {
  constructor() {
    super(faqs);
  }
}

export const faqRepository = new FaqRepository();
