import { tokenTable } from "../db.schema";
import { eq } from 'drizzle-orm/expressions';
import EncryptionService from "../encrypt";
import { db } from "./connection";

export default class DbToken {

    static async updateDbToken(dbUserId: string, accessToken: string) {

        if (!dbUserId || !accessToken) throw new Error("updateDbToken: Invalid arguments");

        const encryptor = new EncryptionService();
        const encryptedAccessToken = encryptor.encrypt(accessToken);
        console.log("encryptedAccessToken", encryptedAccessToken);

        await db.update(tokenTable)
            .set({ encryptedAccessToken })
            .where(eq(tokenTable.userId, dbUserId))
            .execute();
    }
    static async insertDbToken(dbUserId: string, accessToken: string) {

        if (!dbUserId || !accessToken) throw new Error("insertDbToken: Invalid arguments");

        const encryptor = new EncryptionService();
        const encryptedAccessToken = encryptor.encrypt(accessToken);
        console.log("encryptedAccessToken", encryptedAccessToken);

        await db.insert(tokenTable)
            .values({
                userId: dbUserId,
                encryptedAccessToken: encryptedAccessToken
            })
            .execute();
    }

    static async getDbTokenByDbUserId(dbUserId: string) {

        if (!dbUserId) throw new Error("getDbTokenByDbUserId: Invalid arguments");

        const row = await db.select().from(tokenTable).where(eq(tokenTable.userId, dbUserId)).execute();

        if (row.length === 0 || !row[0].encryptedAccessToken) return null;

        const encryptor = new EncryptionService();
        const decryptedToken = encryptor.decrypt(row[0].encryptedAccessToken);
        return decryptedToken;
    }

    static async deleteDbTokenByDbUserId(dbUserId: string) {

        if (!dbUserId) throw new Error("deleteDbTokenByDbUserId: Invalid arguments");

        await db.delete(tokenTable).where(eq(tokenTable.userId, dbUserId)).execute();
    }

}