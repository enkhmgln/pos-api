import { z } from "zod";
import { OTP_PURPOSES } from "@/constants/constant";
import { emailSchema } from "./common.validators";

const purposeSchema = z.union(
  [z.literal(OTP_PURPOSES.REGISTER), z.literal(OTP_PURPOSES.RESET_PASSWORD)],
  { message: "Зөв баталгаажуулах зорилга оруулна уу" },
);
export const createOtpSchema = z.object({
  email: emailSchema,
  purpose: purposeSchema,
  password: z.string().min(1).optional(),
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: z
    .string("Баталгаажуулах код оруулна уу")
    .length(4, "Баталгаажуулах код 4 оронтой байна"),
  purpose: purposeSchema,
});

export type CreateOtpInput = z.infer<typeof createOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
