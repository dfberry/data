import { userTable } from "../db.schema";
import { eq } from 'drizzle-orm/expressions';
import EncryptionService from "../encrypt";
import { GitHubUser } from "../github";
import { db } from "./connection";

interface DatabaseUser {
    id: string;
    githubId: string;
    username: string;
}

export default class DbUser {

    static async insertDbUser(dbUserId: string, githubUser: GitHubUser) {
        console.log(`insertDbUser: dbUserId ${dbUserId}`);
        console.log(`insertDbUser: githubUser.github_id ${githubUser.id}`);
        console.log(`insertDbUser: githubUser.login ${githubUser.login}`);

        if (!dbUserId || !githubUser.id || !githubUser.login) throw new Error("insertUser: Invalid arguments");

        const dbUser = DbUser.convertGitHubUserToNewDatabaseUser(dbUserId, githubUser);
        console.log(`insertDbUser: dbUser ${JSON.stringify(dbUser)}`);

        await db.insert(userTable)
            .values(dbUser)
            .execute();
    }

    static convertGitHubUserToNewDatabaseUser(newDbUserId: string, githubUser: GitHubUser): DatabaseUser {

        console.log(`convertGitHubUserToNewDatabaseUser: id ${typeof githubUser.id}`);
        console.log(`convertGitHubUserToNewDatabaseUser: login ${typeof githubUser.login}`);


        if (githubUser.id == null) {
            throw new Error("GitHub user ID cannot be null or undefined");
        }

        const encryptor = new EncryptionService();
        const encryptedGitHubId = encryptor.encrypt(githubUser.id?.toString()!!);
        const encryptedGitHubLogin = encryptor.encrypt(githubUser.login!);

        console.log(`convertGitHubUserToNewDatabaseUser: encryptedGitHubId ${encryptedGitHubId}`);
        console.log(`convertGitHubUserToNewDatabaseUser: encryptedGitHubLogin ${encryptedGitHubLogin}`);

        return {
            id: newDbUserId,
            githubId: encryptedGitHubId,
            username: encryptedGitHubLogin
        };
    }
    static convertDatabaseUserToGitHub(dbUser: DatabaseUser): GitHubUser {

        const decryptor = new EncryptionService();
        const gitHubId = decryptor.decrypt(dbUser.githubId);
        const gitHubUserName = decryptor.decrypt(dbUser.username);

        const githHubUser: GitHubUser = {
            id: parseInt(gitHubId, 10),
            login: gitHubUserName
        };

        return githHubUser;
    }

    static async getDbUserByGithubId(githubId: string): Promise<DatabaseUser | null> {
        try {
            if (!githubId) throw new Error("getDbUserByGithubId: Invalid arguments");

            console.log(`getDbUserByGithubId: ${githubId}`);

            const row = await db.select().from(userTable).where(eq(userTable.githubId, githubId)).execute();

            if (row.length === 0) return null;
            const decryptedId = new EncryptionService().decrypt(row[0].githubId);
            const decryptedUsername = new EncryptionService().decrypt(row[0].username);

            return {
                id: row[0].id,
                githubId: decryptedId,
                username: decryptedUsername
            };
        } catch (error) {
            console.error(`getDbUserByGithubId error: ${error}`);
            return null;
        }
    }

    static async getDbUserByUserId(userId: string): Promise<DatabaseUser | null> {
        if (!userId) throw new Error("getDbUserByUserId: Invalid arguments");

        const row = await db.select().from(userTable).where(eq(userTable.id, userId)).execute();

        console.log(`getDbUserByUserId: ${userId}, row: ${JSON.stringify(row)}`);

        if (row.length === 0) return null;

        const decryptedId = new EncryptionService().decrypt(row[0].githubId);
        const decryptedUsername = new EncryptionService().decrypt(row[0].username);

        return {
            id: userId,
            githubId: decryptedId,
            username: decryptedUsername
        };
    }
}
