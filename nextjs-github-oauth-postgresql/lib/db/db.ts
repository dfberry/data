import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { userTable, sessionTable, tokenTable } from "../db.schema";
import DbToken from "./token";
import DbUser from "./user";
import { db } from "./connection";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export interface DatabaseUser {
    id: string;
    username: string;
    githubId: string;
}

export {
    db,             // db connection

    userTable,      // user table schema
    sessionTable,   // session table schema
    tokenTable,     // token table schema

    adapter,        // ORM adapter

    DbToken,        // token class for Db table
    DbUser          // user class for Db table
};