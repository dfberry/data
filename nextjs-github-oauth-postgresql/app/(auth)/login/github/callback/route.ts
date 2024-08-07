import { db, github, lucia, userTable, } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateId } from "lucia";
import { sql } from "drizzle-orm";
import { getGithHubUser, GitHubUser } from "@/lib/github";
import { createSessionForGitHubUser } from "@/lib/session";
import DbToken from "@/lib/db/token";
import DbUser from "@/lib/db/user";

export async function GET(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("github_oauth_state")?.value ?? null;

    console.log(`code: ${code}`);
    console.log(`state: ${state}`);
    console.log(`storedState: ${storedState}`);

    if (!code || !state || !storedState || state !== storedState) {

        console.log(`returning 400`);

        return new Response(null, {
            status: 400
        });
    }

    try {

        const tokens = await github.validateAuthorizationCode(code);
        console.log(`tokens: ${JSON.stringify(tokens)}`);

        const githubUser: GitHubUser = await getGithHubUser(tokens.accessToken);
        if (!githubUser) {
            return new Response(null, {
                status: 400
            });
        }

        // Check if user is in DB
        console.log(`existing GitHub User: ${JSON.stringify(githubUser)}`);
        const dbUser = await DbUser.getDbUserByGithubId(githubUser.id?.toString()!!);
        console.log(`db
            User: ${JSON.stringify(dbUser)}`);

        if (dbUser) {

            // Existing user
            const session = await lucia.createSession(dbUser.id, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

            console.log(`created session for user: ${dbUser?.id}`);

            await DbToken.updateDbToken(dbUser?.id!!, tokens.accessToken);
            console.log(`updated token for user: ${githubUser.id}`);

            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/profile"
                }
            });

        } else {
            // New user
            const userId = generateId(15)
            console.log(`new user id: ${userId}`);

            await DbUser.insertDbUser(userId, githubUser);

            const session = await lucia.createSession(userId, {});
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

            await DbToken.insertDbToken(userId, tokens.accessToken);

            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/profile"
                }
            });
        }


    } catch (e) {
        console.error(`GET error: ${e}`);
        if (e instanceof OAuth2RequestError) {
            return new Response(null, {
                status: 400
            });
        }
        return new Response(null, {
            status: 500
        });
    }
}

