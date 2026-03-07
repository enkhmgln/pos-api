import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "@/constants/response.messages";
import { otpService } from "@/services/otp.service";
import { createOtpSchema, verifyOtpSchema } from "@/validators/auth.validators";

export const authController = new Hono();

authController.post("/otp", async (c) => {
  const body = await c.req.json();
  const parsed = createOtpSchema.safeParse(body);
  if (!parsed.success) {
    return c.send_validation_error(parsed.error);
  }
  await otpService.createOtp(parsed.data);
  return c.send_success({
    data: parsed.data.email,
    message: ResponseMessage.OTP_CREATED,
    statusCode: StatusCodes.CREATED,
  });
});

authController.post("/otp/verify", async (c) => {
  const body = await c.req.json();
  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success) {
    return c.send_validation_error(parsed.error);
  }
  const result = await otpService.verifyOtp(parsed.data);
  return c.send_success({ data: result });
});
