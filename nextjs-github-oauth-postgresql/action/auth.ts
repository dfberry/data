import { ActionResult } from "./model";
import { lucia, validateRequest } from "@/lib/auth";
import DbToken from "@/lib/db/token";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function logout(): Promise<ActionResult> {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized"
        };
    }

    await lucia.invalidateSession(session.id);

    // delete the token as well
    await DbToken.deleteDbTokenByDbUserId(session.userId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return redirect("/");
}