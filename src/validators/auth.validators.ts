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

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string("Нууц үг оруулна уу")
    .min(1, "Нууц үг хоосон байж болохгүй"),
});

export const refreshSchema = z.object({
  refresh_token: z
    .string("Refresh token оруулна уу")
    .min(1, "Refresh token хоосон байж болохгүй"),
});

export type CreateOtpInput = z.infer<typeof createOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
