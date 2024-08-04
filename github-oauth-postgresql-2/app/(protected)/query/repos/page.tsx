import useRequireAuth from "@/hooks/useRequireAuth";
import { getDbTokenByDbUserId } from "@/lib/db/db";
import GitHubRepoIssues, { FetchIssuesParams, GitHubIssue } from "@/lib/github/repos";
import IssueCard from "@/components/github/Issue";
import { getLastDaysRange } from '@/lib/datetime';
import { Suspense } from "react";

export default async function QueryReposPage() {

	console.log("QueryPage: Start");

	const { user, session, isAuthorized } = await useRequireAuth();
	if (!session || !isAuthorized) {
		console.log("ProfilePage: Not authorized");
		return null;
	} else {
		console.log("ProfilePage: Authorized");
	}
	const accessToken = await getDbTokenByDbUserId(session?.userId);

	if (!accessToken) {
		console.log("QueryPage: No access token");
		return null;
	}
	const last30Days = getLastDaysRange();

	const params: FetchIssuesParams = {
		repo: 'MicrosoftDocs/node-essentials',
		dateRange:
		{
			start: last30Days.startDateTime!,
			end: last30Days.endDateTime!
		},
		// state: 'open',
		// labels: ['bug', 'enhancement'],
		// assignee: 'diberry',
		// creator: 'diberry',
		// mentioned: 'diberry',
		// sort: 'created',
		// direction: 'asc'
	};

	const items = await GitHubRepoIssues.fetchIssues(params, accessToken);

	//console.log("QueryPage: Items", items);
	if (!items || (Array.isArray(items) && items.length === 0)) {
		console.log("QueryPage: No items");
		return (
			<>
				<h1 className="text-2xl font-bold mb-4">{params.repo}</h1>
				<p className="container mx-auto p-4 bg-white shadow-md rounded-lg">No issues</p>
			</>
		);
	}

	return (
		<>
			<Suspense fallback={<p>Loading data...</p>}>
				<h1 className="text-2xl font-bold mb-4">{params.repo}</h1>
				<div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
					{items.map((issue) => (
						<IssueCard key={issue.id} issue={issue} showRepoNameEachRow={false} />
					))}
				</div>
			</Suspense>
		</>

	);
}