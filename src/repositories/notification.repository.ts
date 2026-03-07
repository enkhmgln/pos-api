import { eq } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema/notifications";
import { BaseRepository } from "./base.repository";

export type Notification = InferSelectModel<typeof notifications>;
export type NotificationInsert = InferInsertModel<typeof notifications>;

class NotificationRepository extends BaseRepository<
  typeof notifications,
  Notification,
  NotificationInsert
> {
  constructor() {
    super(notifications);
  }

  findByUserId(userId: string) {
    return db.query.notifications.findMany({
      where: eq(notifications.user_id, userId),
    });
  }
}

export const notificationRepository = new NotificationRepository();
