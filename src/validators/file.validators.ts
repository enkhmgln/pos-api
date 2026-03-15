import { z } from "zod";
import { ALLOWED_FILE_TYPES, MAX_SIZE_BYTES } from "@/constants/constant";

export const uploadFileSchema = z.object({
  size: z
    .number()
    .max(MAX_SIZE_BYTES, "Файл хэт их байна. 10 MB хэмжээтэй байна."),
  type: z.enum(ALLOWED_FILE_TYPES, {
    message: "Файлын төрөл зөвшөөрөгдөөгүй байна",
  }),
});

export const fileIdParamSchema = z.object({
  id: z.string().uuid("Файлын ID оруулна уу"),
});

export type FileIdParam = z.infer<typeof fileIdParamSchema>;
