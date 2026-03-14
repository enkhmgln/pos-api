import { StatusCodes } from "http-status-codes";
import { HTTPException } from "hono/http-exception";
import { ACCOUNT_STATUS } from "@/constants/constant";
import { ResponseMessage } from "@/constants/response.messages";
import { userRepository } from "@/repositories";
import { tokenService } from "./token.service";

export interface AppUser {
  id: string;
  email: string;
}

export interface AuthResult {
  user: AppUser;
  access_token: string;
  expires_in: number;
}

export interface LoginResult extends AuthResult {
  refresh_token: string;
  refresh_expires_in: number;
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmail(normalizedEmail);
    if (!user) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.UNAUTHORIZED,
      });
    }
    const valid = await Bun.password.verify(password, user.password, "bcrypt");
    if (!valid) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.INVALID_CREDENTIALS,
      });
    }
    if (user.account_status !== ACCOUNT_STATUS.ACTIVE) {
      throw new HTTPException(StatusCodes.FORBIDDEN, {
        message: ResponseMessage.ACCOUNT_NOT_VERIFIED,
      });
    }
    const { accessToken, expiresIn } = await tokenService.encode(
      user.id,
      user.role,
    );
    const { refreshToken, expiresIn: refreshExpiresIn } =
      await tokenService.encodeRefresh(user.id, user.role);
    return {
      user: { id: user.id, email: user.email },
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: refreshToken,
      refresh_expires_in: refreshExpiresIn,
    };
  }

  async refresh(refreshToken: string): Promise<LoginResult> {
    const payload = await tokenService.decodeRefresh(refreshToken);
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, {
        message: ResponseMessage.UNAUTHORIZED,
      });
    }
    const { accessToken, expiresIn } = await tokenService.encode(
      user.id,
      user.role,
    );
    const { refreshToken: newRefreshToken, expiresIn: refreshExpiresIn } =
      await tokenService.encodeRefresh(user.id, user.role);
    return {
      user: { id: user.id, email: user.email },
      access_token: accessToken,
      expires_in: expiresIn,
      refresh_token: newRefreshToken,
      refresh_expires_in: refreshExpiresIn,
    };
  }
}

export const authService = new AuthService();
