import useRequireAuth from '@/hooks/useRequireAuth';
import ProfileComponent from '@/components/Profile';
import DbToken from "@/lib/db/token";

export default async function SettingsPage() {
	const session = await useRequireAuth();
	let gitHubUser = null;

	if (session?.user?.githubId) {
		const accessToken = DbToken.getDbTokenByDbUserId(session.user.id);
		console.log("getTokenByUserId accessToken", accessToken);

		if (accessToken) {
			// Fetch user data from GitHub
			const response = await fetch('https://api.github.com/user', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			});
			if (response.ok) {
				gitHubUser = await response.json();
				console.log("gitHubUser", gitHubUser);
			}
		}
	}


	return (
		<>
			<ProfileComponent ghUser={gitHubUser} />
		</>
	);
}