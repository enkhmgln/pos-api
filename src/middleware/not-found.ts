import { ResponseMessage } from "@/constants/response.messages";
import type { Context } from "hono";
import { StatusCodes } from "http-status-codes";

export function notFoundMiddleware(c: Context) {
  return c.send_error({
    message: ResponseMessage.NOT_FOUND,
    statusCode: StatusCodes.NOT_FOUND,
  });
}
