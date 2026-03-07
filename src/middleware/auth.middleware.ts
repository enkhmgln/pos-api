import { StatusCodes } from "http-status-codes";
import type { Context, Next } from "hono";
import { ResponseMessage } from "@/constants/response.messages";
import { tokenService } from "@/services/token.service";

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.send_error({
      message: ResponseMessage.UNAUTHORIZED,
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
  const token = authHeader.slice(7);
  try {
    const payload = await tokenService.decode(token);
    c.set("authPayload", payload);
    await next();
  } catch {
    return c.send_error({
      message: ResponseMessage.UNAUTHORIZED,
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  }
}
