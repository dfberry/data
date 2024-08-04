import { db } from './connection';
import { userWatchRepoTable } from './db.schema';
import { eq } from "drizzle-orm";

export default class UserWatchRepoService {
    async create(userId: string, repoName: string) {
        const result = await db.insert(userWatchRepoTable).values({
            userId,
            repoName,
        }).returning();

        console.log("UserWatchRepoService.create: ", result);

        return result;
    }

    async read(id: string) {
        const result = await db.select().from(userWatchRepoTable).where(eq(userWatchRepoTable.id, id));
        return result;
    }

    async update(userId: string, repoName: string) {
        const result = await db.update(userWatchRepoTable).set({
            repoName,
        }).where(eq(userWatchRepoTable.userId, userId)).execute();
        return result;
    }

    async delete(id: string) {
        const result = await db.delete(userWatchRepoTable).where(eq(userWatchRepoTable.id, id)).execute();
        return result;
    }

    async list() {
        const result = await db.select().from(userWatchRepoTable).orderBy(userWatchRepoTable.repoName) // Add this line to sort by repoUrl
            .execute();
        return result;
    }

    async listByUserId(userId: string) {
        const result = await db
            .select()
            .from(userWatchRepoTable)
            .where(eq(userWatchRepoTable.userId, userId))
            .orderBy(userWatchRepoTable.repoName) // Add this line to sort by repoUrl
            .execute();
        return result;
    }
    async deleteAllByUserId(userId: string) {
        const result = await db.delete(userWatchRepoTable).where(eq(userWatchRepoTable.userId, userId)).execute();
        return result;
    }
}