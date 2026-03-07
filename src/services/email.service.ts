import nodemailer from "nodemailer";
import { config } from "@/constants/config";

export class EmailService {
  private readonly transporter = nodemailer.createTransport({
    host: config.SMTP.HOST,
    port: config.SMTP.PORT,
    secure: config.SMTP.PORT === 465,
    auth:
      config.SMTP.USER && config.SMTP.PASS
        ? { user: config.SMTP.USER, pass: config.SMTP.PASS }
        : undefined,
  });

  async sendOtp(
    to: string,
    otp: string,
    expiresInMinutes: number,
  ): Promise<void> {
    const html = `
    <p>Your ${config.APP_NAME} verification code is:</p>
    <p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p>
    <p>It expires in ${expiresInMinutes} minutes. Don't share this code with anyone.</p>
  `;
    await this.transporter.sendMail({
      from: config.SMTP.FROM,
      to,
      subject: `Verify your ${config.APP_NAME} account`,
      html,
    });
  }
}

export const emailService = new EmailService();
