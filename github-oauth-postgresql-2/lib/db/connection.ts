import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({
    connectionString: connectionString
});
export const db = drizzle(pool);