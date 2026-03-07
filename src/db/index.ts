import { AsyncLocalStorage } from "async_hooks";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "@/constants/config";
import * as schema from "./schema";

const client = postgres(config.DATABASE_URL, { max: 1 });

export const db = drizzle(client, { schema });
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export type DbClient = typeof db | DbTransaction;

const txStorage = new AsyncLocalStorage<DbTransaction>();

export function getClient(): DbClient {
  return txStorage.getStore() ?? db;
}

export async function runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
  return db.transaction(async (tx) => txStorage.run(tx, fn));
}
