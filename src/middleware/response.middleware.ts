import { StatusCodes } from "http-status-codes";
import type { Context, Next } from "hono";
import type { ZodError } from "zod";
import {
  type ResponseMessageType,
  ResponseMessage,
} from "@/constants/response.messages";
import type { ContentfulStatusCode } from "hono/utils/http-status";
export async function responseMiddleware(c: Context, next: Next) {
  c.send_success = <T>(options: {
    data: T;
    message?: ResponseMessageType;
    statusCode?: number;
  }) => {
    const {
      data,
      message = ResponseMessage.REQUEST_SUCCESS,
      statusCode = StatusCodes.OK,
    } = options;
    return c.json(
      { message, data, success: true },
      {
        status: statusCode as ContentfulStatusCode,
      },
    );
  };

  c.send_error = (options: {
    message: ResponseMessageType;
    statusCode?: number;
  }) => {
    const { message, statusCode = StatusCodes.BAD_REQUEST } = options;
    return c.json(
      { message, success: false, data: null },
      {
        status: statusCode as ContentfulStatusCode,
      },
    );
  };

  c.send_paginated = <T>(options: {
    data: T[];
    page: number;
    page_size: number;
    total: number;
    message?: ResponseMessageType;
  }) => {
    const {
      data,
      page,
      page_size,
      total,
      message = ResponseMessage.REQUEST_SUCCESS,
    } = options;
    return c.json(
      { message, data, page, page_size, total, success: true },
      StatusCodes.OK,
    );
  };

  c.send_validation_error = (zodError: ZodError) => {
    const message =
      zodError.issues[0]?.message ?? ResponseMessage.INVALID_INPUT;
    return c.json(
      { message, success: false, data: null },
      StatusCodes.UNPROCESSABLE_ENTITY,
    );
  };

  await next();
}
