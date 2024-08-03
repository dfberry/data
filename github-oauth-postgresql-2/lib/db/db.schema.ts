import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core"

export const userTable = pgTable("user", {
	id: text("id").primaryKey().unique(),
	githubId: text("github_id").notNull().unique(),
	username: text("username").notNull().unique()
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});
export const tokenTable = pgTable('token', {
	id: text('id').primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	encryptedAccessToken: text('encrypted_access_token').notNull()
});

export const userWatchRepoTable = pgTable("user_watch_repo", {
	id: text("id").primaryKey().default(sql`gen_random_uuid()`),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	repoName: text("repo_name").notNull(),
	createdAt: timestamp("created_at", {
		withTimezone: true,
		mode: "date"
	}).default(sql`now()`).notNull(),
}, (table) => {
	return {
		uniqueUserRepo: uniqueIndex("unique_user_repo").on(table.userId, table.repoName)
	};
});
