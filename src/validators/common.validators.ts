import { z } from "zod";

export const emailSchema = z
  .string("И-мэйл хаяг оруулна уу")
  .email("Зөв и-мэйл хаяг оруулна уу");
