import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "@/constants/response.messages";
import { requireAuth } from "@/middleware";
import { fileService } from "@/services";
import {
  fileIdParamSchema,
  uploadFileSchema,
} from "@/validators/file.validators";

export const fileController = new Hono();

fileController.post("/upload", requireAuth, async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return c.send_error({
      message: ResponseMessage.INVALID_INPUT,
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }
  const fileValidation = uploadFileSchema.safeParse({
    size: file.size,
    type: file.type,
  });
  if (!fileValidation.success) {
    return c.send_validation_error(fileValidation.error);
  }
  const { userId } = c.get("authPayload");
  const record = await fileService.upload(userId, {
    name: file.name,
    type: file.type,
    size: file.size,
    data: file,
  });
  const baseUrl = new URL(c.req.url).origin;
  return c.send_success({
    data: {
      ...record,
      url: `${baseUrl.replace(/\/$/, "")}/${record.path}`,
    },
    message: ResponseMessage.REQUEST_SUCCESS,
    statusCode: StatusCodes.CREATED,
  });
});

fileController.get("/:id", async (c) => {
  const paramResult = fileIdParamSchema.safeParse({ id: c.req.param("id") });
  if (!paramResult.success) {
    return c.send_validation_error(paramResult.error);
  }
  const record = await fileService.getById(paramResult.data.id);
  const baseUrl = new URL(c.req.url).origin;
  return c.send_success({
    data: {
      ...record,
      url: `${baseUrl.replace(/\/$/, "")}/${record.path}`,
    },
    message: ResponseMessage.REQUEST_SUCCESS,
  });
});

fileController.get("/:id/download", async (c) => {
  const paramResult = fileIdParamSchema.safeParse({ id: c.req.param("id") });
  if (!paramResult.success) {
    return c.send_validation_error(paramResult.error);
  }
  const record = await fileService.getById(paramResult.data.id);
  const absolutePath = fileService.getAbsolutePath(record);
  const blob = Bun.file(absolutePath);
  return new Response(blob, {
    headers: {
      "Content-Type": record.mime_type,
      "Content-Disposition": `inline; filename="${encodeURIComponent(record.original_name)}"`,
    },
  });
});
