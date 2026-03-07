import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { config } from "@/constants/config";
import { generateNumericString } from "@/lib";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { ResponseMessage } from "@/constants/response.messages";
import { emailService } from "./email.service";
import { tokenService } from "./token.service";

const OTP_LENGTH = 4;

export interface AppUser {
  id: string;
  email: string;
}

export interface AuthResult {
  user: AppUser;
  access_token: string;
  expires_in: number;
}

export class AuthService {}

export const authService = new AuthService();
