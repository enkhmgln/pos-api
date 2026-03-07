import { SignJWT, jwtVerify } from "jose";
import { config } from "@/constants/config";
import type { UserRole } from "@/constants/constant";

export interface TokenPayload {
  userId: string;
  role: UserRole;
}

export interface SignResult {
  accessToken: string;
  expiresIn: number;
}

export interface RefreshSignResult {
  refreshToken: string;
  expiresIn: number;
}

export class TokenService {
  private secret() {
    return new TextEncoder().encode(config.JWT_SECRET);
  }

  private refreshSecret() {
    return new TextEncoder().encode(config.JWT_REFRESH_SECRET);
  }

  async encode(userId: string, role: UserRole): Promise<SignResult> {
    const jwt = await new SignJWT({ role })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(config.JWT_EXPIRES_IN)
      .sign(this.secret());
    return {
      accessToken: jwt,
      expiresIn: config.JWT_EXPIRES_IN_SECONDS,
    };
  }

  async encodeRefresh(userId: string, role: UserRole): Promise<RefreshSignResult> {
    const jwt = await new SignJWT({ role })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(userId)
      .setIssuedAt()
      .setExpirationTime(config.JWT_REFRESH_EXPIRES_IN)
      .sign(this.refreshSecret());
    return {
      refreshToken: jwt,
      expiresIn: config.JWT_REFRESH_EXPIRES_IN_SECONDS,
    };
  }

  async decode(token: string): Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, this.secret());
    const userId = payload.sub;
    const role = payload.role as UserRole;
    return { userId: userId!, role };
  }

  async decodeRefresh(token: string): Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, this.refreshSecret());
    const userId = payload.sub;
    const role = payload.role as UserRole;
    return { userId: userId!, role };
  }
}

export const tokenService = new TokenService();
