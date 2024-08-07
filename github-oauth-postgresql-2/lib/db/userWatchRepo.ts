import { db } from "./connection";
import { userWatchRepoTable } from "./db.schema";
import { eq } from "drizzle-orm";

export default class UserWatchRepoService {
  static async create(userId: string, repoName: string) {
    const result = await db
      .insert(userWatchRepoTable)
      .values({
        userId,
        repoName,
      })
      .returning();

    console.log("UserWatchRepoService.create: ", result);

    return result;
  }

  static async read(id: string) {
    const result = await db
      .select()
      .from(userWatchRepoTable)
      .where(eq(userWatchRepoTable.id, id));
    return result;
  }

  static async update(userId: string, repoName: string) {
    const result = await db
      .update(userWatchRepoTable)
      .set({
        repoName,
      })
      .where(eq(userWatchRepoTable.userId, userId))
      .execute();
    return result;
  }

  static async delete(id: string) {
    const result = await db
      .delete(userWatchRepoTable)
      .where(eq(userWatchRepoTable.id, id))
      .execute();
    return result;
  }

  static async list() {
    const result = await db
      .select()
      .from(userWatchRepoTable)
      .orderBy(userWatchRepoTable.repoName) // Add this line to sort by repoUrl
      .execute();
    return result;
  }

  static async listByUserId(userId: string) {
    const result = await db
      .select()
      .from(userWatchRepoTable)
      .where(eq(userWatchRepoTable.userId, userId))
      .orderBy(userWatchRepoTable.repoName) // Add this line to sort by repoUrl
      .execute();
    return result;
  }
  static async deleteAllByUserId(userId: string) {
    const result = await db
      .delete(userWatchRepoTable)
      .where(eq(userWatchRepoTable.userId, userId))
      .execute();
    return result;
  }
}
