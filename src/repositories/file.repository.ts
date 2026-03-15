import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { files } from "@/db/schema/general";
import { BaseRepository } from "./base.repository";

export type FileRecord = InferSelectModel<typeof files>;
export type FileRecordInsert = InferInsertModel<typeof files>;

class FileRepository extends BaseRepository<
  typeof files,
  FileRecord,
  FileRecordInsert
> {
  constructor() {
    super(files);
  }
}

export const fileRepository = new FileRepository();
