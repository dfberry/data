import useRequireAuth from '@/hooks/useRequireAuth';
import WatchedReposListComponent from '@/components/userWatchRepos/list';
import UserWatchRepoService from '@/lib/db/userWatchRepo';
import NewRepoToWatchForm from '@/components/userWatchRepos/form';
import { Suspense } from 'react';

const getData = async (userId: string) => {

	const userWatchRepos = await UserWatchRepoService.listByUserId(userId);

	console.log(userWatchRepos);
	return userWatchRepos;
}

export default async function RepoListPage() {

	//console.log("RepoListPage: Start");

	const { user, session, isAuthorized } = await useRequireAuth();
	if (!isAuthorized) {
		console.log("ProfilePage: Not authorized");
		return null;
	} else {
		console.log("ProfilePage: Authorized");
	}
	const repos = await getData(session?.userId!);

	return (
		<>
			<h1>Watched Repositories</h1>
			<Suspense fallback={<p>Loading data...</p>}>
				<WatchedReposListComponent user={user} session={session} repos={repos} enableCreate={true} enableDelete={true} enableReportLink={false} />
			</Suspense>
		</>
	);
}