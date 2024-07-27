import { lucia, validateRequest } from "@/lib/auth";
import useRequireAuth from "@/hooks/useRequireAuth";
import ProfileComponent from "@/components/Profile";
import DbUser from "@/lib/db/user";
import DbToken from "@/lib/db/token";
import { getGithHubUser } from "@/lib/github";
import { GitHubUser } from "@/lib/github";

import { redirect } from "next/navigation";

export default async function ProfilePage() {
	const { user, session, isAuthorized } = await useRequireAuth();

	if (!session?.userId) {
		return redirect("/login");
	}
	console.log("ProfilePage session", session);
	const ghUserAccessToken = await DbToken.getDbTokenByDbUserId(session.userId);
	console.log("ProfilePage ghUserAccessToken", ghUserAccessToken);
	const ghUser: GitHubUser | null = (ghUserAccessToken) ? await getGithHubUser(ghUserAccessToken) : null;
	console.log("ProfilePage ghUser", ghUser);

	return (
		<>
			<ProfileComponent ghUser={ghUser} />
		</>
	);
}