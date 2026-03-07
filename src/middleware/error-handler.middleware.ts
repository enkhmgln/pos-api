import { StatusCodes } from "http-status-codes";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import {
  type ResponseMessageType,
  ResponseMessage,
} from "@/constants/response.messages";

const validMessages = new Set<string>(
  Object.values(ResponseMessage) as string[],
);

function toResponseMessage(msg: string, status: number): ResponseMessageType {
  return validMessages.has(msg)
    ? (msg as ResponseMessageType)
    : status >= StatusCodes.INTERNAL_SERVER_ERROR
      ? ResponseMessage.INTERNAL_SERVER_ERROR
      : ResponseMessage.REQUEST_UNSUCCESS;
}

export function globalErrorHandler(err: Error, c: Context): Response {
  console.log("Error:", err);
  if (err instanceof HTTPException) {
    const message = toResponseMessage(err.message, err.status);
    return c.send_error({ message, statusCode: err.status });
  }

  if (err instanceof SyntaxError) {
    return c.send_error({
      message: ResponseMessage.INVALID_JSON,
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  return c.send_error({
    message: ResponseMessage.INTERNAL_SERVER_ERROR,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  });
}
