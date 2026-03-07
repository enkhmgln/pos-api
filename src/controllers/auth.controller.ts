import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "@/constants/response.messages";
import { requireAuth } from "@/middleware";
import { authService, otpService } from "@/services";
import {
  createOtpSchema,
  loginSchema,
  verifyOtpSchema,
} from "@/validators/auth.validators";

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

authController.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.send_validation_error(parsed.error);
  }
  const result = await authService.login(
    parsed.data.email,
    parsed.data.password,
  );
  return c.send_success({ data: result });
});

authController.post("/refresh", requireAuth, async (c) => {
  const payload = c.get("authPayload");
  const result = await authService.refresh(payload);
  return c.send_success({ data: result });
});
