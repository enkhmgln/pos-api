export const ResponseMessage = {
  // Success
  REQUEST_SUCCESS: "Хүсэлт амжилттай",

  // Client errors
  INVALID_INPUT: "Буруу утга",
  INVALID_JSON: "Алдаатай JSON утга",
  BAD_REQUEST: "Алдаатай хүсэлт",
  UNAUTHORIZED: "Зөвшөөрөлгүй",
  FORBIDDEN: "Эрх хүрэхгүй байна",
  NOT_FOUND: "Олдсонгүй",
  REQUEST_UNSUCCESS: "Хүсэлт амжилтгүй. Дахин оролдоно уу",
  UPLOAD_FILE_TOO_LARGE: "Файл хэт их байна. 10 MB хэмжээтэй байна.",

  // Server / external
  INTERNAL_SERVER_ERROR: "Дотоод сервер алдаа гарлаа",
  USER_ALREADY_EXISTS: "Хэрэглэгч бүртгэлтэй байна",
  OTP_NOT_FOUND: "Баталгаажуулах код олдсонгүй",
  OTP_EXPIRED: "Баталгаажуулах код хугацаа дууссан",
  FAILED_TO_CREATE_USER: "Хэрэглэгч үүсгэхэд алдаа гарлаа",
  USER_NOT_FOUND: "Хэрэглэгч олдсонгүй",
  PASSWORD_REQUIRED: "Нууц үг оруулна уу",
  OTP_CREATED: "И-мэйл хаягт баталгаажуулах код илгээлээ",
} as const;

export type ResponseMessageType =
  (typeof ResponseMessage)[keyof typeof ResponseMessage];
