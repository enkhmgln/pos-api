import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { getClient } from "@/db";

export abstract class BaseRepository<
  TTable extends PgTable,
  TSelect = InferSelectModel<TTable>,
  TInsert = InferInsertModel<TTable>,
> {
  constructor(protected readonly table: TTable) {}

  protected get idColumn(): Parameters<typeof eq>[0] {
    return (this.table as unknown as { id: Parameters<typeof eq>[0] }).id;
  }

  async findById(id: string): Promise<TSelect | undefined> {
    const client = getClient();
    const t = this.table as unknown as PgTable;
    const rows = await client.select().from(t).where(eq(this.idColumn, id)).limit(1);
    return rows[0] as TSelect | undefined;
  }

  async findAll(): Promise<TSelect[]> {
    const client = getClient();
    const t = this.table as unknown as PgTable;
    return client.select().from(t) as Promise<TSelect[]>;
  }

  async create(data: TInsert) {
    const client = getClient();
    const t = this.table as unknown as PgTable;
    return client.insert(t).values(data as Record<string, unknown>).returning();
  }

  async update(id: string, data: Partial<TInsert>) {
    const client = getClient();
    const t = this.table as unknown as PgTable;
    return client.update(t).set(data as Record<string, unknown>).where(eq(this.idColumn, id)).returning();
  }

  async delete(id: string) {
    const client = getClient();
    const t = this.table as unknown as PgTable;
    return client.delete(t).where(eq(this.idColumn, id)).returning();
  }
}
