export const config = {
  APP_NAME: "Solgoi",
  DATABASE_URL: process.env.DATABASE_URL!,
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  JWT_EXPIRES_IN_SECONDS: 7 * 24 * 60 * 60,
  SMTP: {
    HOST: process.env.SMTP_HOST!,
    PORT: Number(process.env.SMTP_PORT) || 2525,
    USER: process.env.SMTP_USER!,
    PASS: process.env.SMTP_PASS!,
    FROM: process.env.SMTP_FROM!,
  },
  OTP_EXPIRES_MINUTES: Number(process.env.OTP_EXPIRES_MINUTES) || 10,
} as const;
