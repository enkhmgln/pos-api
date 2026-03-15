import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { StatusCodes } from "http-status-codes";
import { HTTPException } from "hono/http-exception";
import { ALLOWED_FILE_TYPES, MAX_SIZE_BYTES } from "@/constants/constant";
import { config } from "@/constants/config";
import { ResponseMessage } from "@/constants/response.messages";
import { fileRepository, type FileRecord } from "@/repositories";

const UPLOAD_DIR_NAME = "uploads";

export class FileService {
  private getUploadDir(): string {
    return join(process.cwd(), config.UPLOAD_DIR);
  }

  private ensureUploadDir(): void {
    const dir = this.getUploadDir();
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  private getExtension(filename: string): string {
    const i = filename.lastIndexOf(".");
    return i === -1 ? "" : filename.slice(i);
  }

  async upload(
    userId: string,
    file: { name: string; type: string; size: number; data: Blob },
  ): Promise<FileRecord> {
    if (file.size > MAX_SIZE_BYTES) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.UPLOAD_FILE_TOO_LARGE,
      });
    }
    if (
      !ALLOWED_FILE_TYPES.includes(
        file.type as (typeof ALLOWED_FILE_TYPES)[number],
      )
    ) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.INVALID_FILE_TYPE,
      });
    }
    this.ensureUploadDir();
    const ext = this.getExtension(file.name) || ".bin";
    const storedName = `${crypto.randomUUID()}${ext}`;
    const absolutePath = join(this.getUploadDir(), storedName);
    await Bun.write(absolutePath, file.data);
    const relativePath = `${UPLOAD_DIR_NAME}/${storedName}`;
    const created = await fileRepository.create({
      user_id: userId,
      original_name: file.name,
      stored_name: storedName,
      mime_type: file.type,
      size: file.size,
      path: relativePath,
    });
    const result = created[0];
    if (!result) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: ResponseMessage.INTERNAL_SERVER_ERROR,
      });
    }
    return result as FileRecord;
  }

  async getById(id: string): Promise<FileRecord> {
    const record = await fileRepository.findById(id);
    if (!record) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: ResponseMessage.FILE_NOT_FOUND,
      });
    }
    return record;
  }

  getAbsolutePath(record: FileRecord): string {
    return join(this.getUploadDir(), record.stored_name);
  }
}

export const fileService = new FileService();
