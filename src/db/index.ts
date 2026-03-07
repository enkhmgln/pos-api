import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "@/constants/config";
import * as schema from "./schema";

const client = postgres(config.DATABASE_URL, { max: 1 });

export const db = drizzle(client, { schema });
