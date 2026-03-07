import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { getClient } from "@/db";
import { shops } from "@/db/schema/users";
import { BaseRepository } from "./base.repository";

export type Shop = InferSelectModel<typeof shops>;
export type ShopInsert = InferInsertModel<typeof shops>;

class ShopRepository extends BaseRepository<typeof shops, Shop, ShopInsert> {
  constructor() {
    super(shops);
  }

  findByUserId(userId: string) {
    return getClient().query.shops.findFirst({
      where: eq(shops.user_id, userId),
    });
  }
}

export const shopRepository = new ShopRepository();
