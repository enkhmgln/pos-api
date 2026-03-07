import type { ResponseMessageType } from "@/constants/response.messages";
import type { Response } from "hono";
import type { ZodError } from "zod";

export interface SendSuccessOptions<T> {
  data: T;
  message?: ResponseMessageType;
  statusCode?: number;
}

export interface SendErrorOptions {
  message: ResponseMessageType;
  statusCode?: number;
}

export interface SendPaginatedOptions<T> {
  data: T[];
  page: number;
  page_size: number;
  total: number;
  message?: ResponseMessageType;
}

import type { TokenPayload } from "@/services/token.service";

declare module "hono" {
  interface ContextVariableMap {
    authPayload: TokenPayload;
  }
  interface Context {
    send_success: <T>(options: SendSuccessOptions<T>) => Response;
    send_error: (options: SendErrorOptions) => Response;
    send_paginated: <T>(options: SendPaginatedOptions<T>) => Response;
    send_validation_error: (zodError: ZodError) => Response;
  }
}
