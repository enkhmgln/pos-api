import { Hono } from "hono";
import { ResponseMessage } from "@/constants/response.messages";
import { requireAuth } from "@/middleware";
import { userService } from "@/services";
import { updateProfileSchema } from "@/validators/user.validators";

export const userController = new Hono();

userController.get("/me", requireAuth, async (c) => {
  const { userId } = c.get("authPayload");
  const data = await userService.getMe(userId);
  return c.send_success({
    data,
    message: ResponseMessage.REQUEST_SUCCESS,
  });
});

userController.patch("/profile", requireAuth, async (c) => {
  const body = await c.req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return c.send_validation_error(parsed.error);
  }
  const { userId } = c.get("authPayload");
  const profile = await userService.updateProfile(userId, parsed.data);
  return c.send_success({
    data: profile,
    message: ResponseMessage.REQUEST_SUCCESS,
  });
});
