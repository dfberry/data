import useRequireAuth from '@/hooks/useRequireAuth';
import ProfileComponent from '@/components/Profile';
import GitHubUserService from '@/lib/github/user';
import { Suspense } from 'react';

export default async function ProfilePage() {

	console.log("ProfilePage: Start");

	const { user, session, isAuthorized } = await useRequireAuth();
	if (!isAuthorized) {
		console.log("ProfilePage: Not authorized");
		return null;
	} else {
		console.log("ProfilePage: Authorized");
	}

	const userProfile = await GitHubUserService.getGithHubUserBySessionResult({ session, user });
	console.log(`ProfilePage userProfile: ${JSON.stringify(userProfile)}`);

	return (
		<>
			<Suspense fallback={<p>Loading data...</p>}>
				<ProfileComponent session={session} user={user} githubProfile={userProfile} />
			</Suspense>
		</>
	);
}