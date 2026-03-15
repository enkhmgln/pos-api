import { z } from "zod";

export const updateProfileSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar_file_id: z
    .string()
    .uuid("Файлын ID буруу байна")
    .optional()
    .or(z.literal("")),
  location: z.string().optional(),
  birthdate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Огноо YYYY-MM-DD форматай байна")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
