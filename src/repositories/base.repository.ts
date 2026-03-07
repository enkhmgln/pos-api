import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";

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
    const t = this.table as unknown as PgTable;
    const rows = await db.select().from(t).where(eq(this.idColumn, id)).limit(1);
    return rows[0] as TSelect | undefined;
  }

  async findAll(): Promise<TSelect[]> {
    const t = this.table as unknown as PgTable;
    return db.select().from(t) as Promise<TSelect[]>;
  }

  async create(data: TInsert) {
    const t = this.table as unknown as PgTable;
    return db.insert(t).values(data as Record<string, unknown>).returning();
  }

  async update(id: string, data: Partial<TInsert>) {
    const t = this.table as unknown as PgTable;
    return db.update(t).set(data as Record<string, unknown>).where(eq(this.idColumn, id)).returning();
  }

  async delete(id: string) {
    const t = this.table as unknown as PgTable;
    return db.delete(t).where(eq(this.idColumn, id)).returning();
  }
}
