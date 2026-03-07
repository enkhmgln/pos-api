export const ResponseMessage = {
  // Success
  REQUEST_SUCCESS: "Request successful",

  // Client errors
  INVALID_INPUT: "Invalid input",
  INVALID_JSON: "Invalid or empty request body",
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not found",
  REQUEST_UNSUCCESS: "Request failed. Please try again",
  UPLOAD_FILE_TOO_LARGE: "File too large. Max 10 MB.",

  // Server / external
  INTERNAL_SERVER_ERROR: "Internal server error",
  EXTERNAL_SERVICE_ERROR: "External service error",
} as const;

export type ResponseMessageType =
  (typeof ResponseMessage)[keyof typeof ResponseMessage];
