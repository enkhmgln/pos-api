import { StatusCodes } from "http-status-codes";
import { HTTPException } from "hono/http-exception";
import { config } from "@/constants/config";
import {
  ACCOUNT_STATUS,
  OTP_PURPOSES,
  type OtpPurpose,
} from "@/constants/constant";
import { ResponseMessage } from "@/constants/response.messages";
import { generateNumericString } from "@/lib";
import { userOtpRepository, userRepository, type User } from "@/repositories";
import { emailService } from "./email.service";
import { tokenService } from "./token.service";

const OTP_LENGTH = 4;

export interface CreateOtpParams {
  email: string;
  purpose: OtpPurpose;
  password?: string;
}

export interface VerifyOtpParams {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpResult {
  user: { id: string; email: string };
  access_token: string;
  expires_in: number;
}

export class OtpService {
  async createOtp(data: CreateOtpParams): Promise<void> {
    const { email, purpose, password } = data;
    const normalizedEmail = email.toLowerCase().trim();
    const expiresAt = new Date(
      Date.now() + config.OTP_EXPIRES_MINUTES * 60 * 1000,
    );
    const otp = generateNumericString(OTP_LENGTH);

    let userId: string;
    if (purpose === OTP_PURPOSES.REGISTER) {
      if (!password) {
        throw new HTTPException(StatusCodes.BAD_REQUEST, {
          message: ResponseMessage.PASSWORD_REQUIRED,
        });
      }
      const existingUser = await userRepository.findByEmail(normalizedEmail);
      if (existingUser) {
        throw new HTTPException(StatusCodes.CONFLICT, {
          message: ResponseMessage.USER_ALREADY_EXISTS,
        });
      }
      const passwordHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 10,
      });
      const created = await userRepository.create({
        email: normalizedEmail,
        password: passwordHash,
        account_status: ACCOUNT_STATUS.ACTIVE,
      });
      const newUser = created[0] as User | undefined;
      if (!newUser) {
        throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
          message: ResponseMessage.FAILED_TO_CREATE_USER,
        });
      }
      userId = newUser.id;
    } else {
      const existingUser = await userRepository.findByEmail(normalizedEmail);
      if (!existingUser) {
        throw new HTTPException(StatusCodes.NOT_FOUND, {
          message: ResponseMessage.USER_NOT_FOUND,
        });
      }
      await userOtpRepository.deleteByUserIdAndPurpose(
        existingUser.id,
        OTP_PURPOSES.RESET_PASSWORD,
      );
      userId = existingUser.id;
    }

    await userOtpRepository.create({
      user_id: userId,
      otp,
      purpose,
      expires_at: expiresAt,
    });
    await emailService.sendOtp(email, otp, config.OTP_EXPIRES_MINUTES);
  }

  async verifyOtp(params: VerifyOtpParams): Promise<VerifyOtpResult> {
    const { email, otp, purpose } = params;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.USER_NOT_FOUND,
      });
    }

    const otpRow = await userOtpRepository.findValidOtp(user.id, purpose, otp);
    if (!otpRow) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.OTP_NOT_FOUND,
      });
    }

    await userOtpRepository.update(otpRow.id, {
      used_at: new Date(),
    });

    const { accessToken, expiresIn } = await tokenService.encode(
      user.id,
      user.role,
    );
    return {
      user: { id: user.id, email: user.email },
      access_token: accessToken,
      expires_in: expiresIn,
    };
  }
}

export const otpService = new OtpService();
