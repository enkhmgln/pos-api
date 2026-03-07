export const ACCOUNT_STATUS = {
  ACTIVE: 0,
  SUSPENDED: 1,
  BANNED: 2,
} as const;

export const USER_ROLES = {
  USER: 0,
  MERCHANT: 1,
} as const;

export const NOTIFICATION_TYPES = {
  SYSTEM: 0,
  MERCHANT: 1,
} as const;

export const OTP_PURPOSES = {
  REGISTER: 0,
  RESET_PASSWORD: 1,
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type AccountStatus =
  (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS];

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

export type OtpPurpose = (typeof OTP_PURPOSES)[keyof typeof OTP_PURPOSES];

export const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
export const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
