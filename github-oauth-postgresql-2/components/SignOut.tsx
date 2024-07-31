import { redirect } from "next/navigation";
import { lucia, validateRequest } from "@/lib/auth/auth";
import { deleteDbTokenByDbUserId } from "@/lib/db/db";
import { cookies } from "next/headers";

interface ActionResult {
    error: string | null;
}

async function logout(): Promise<ActionResult> {
    "use server";
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "Unauthorized"
        };
    }

    await lucia.invalidateSession(session.id);

    // delete the token as well
    await deleteDbTokenByDbUserId(session.userId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return redirect("/");
}

export default async function SignOutComponent() {
    "use server";
    const { user } = await validateRequest();
    if (!user) {
        return redirect("/login");
    }
    return (

        <form action={logout} >
            <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75">
                Sign out
            </button>
        </form>
    );
}