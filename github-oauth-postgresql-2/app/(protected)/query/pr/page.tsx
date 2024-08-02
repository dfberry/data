import useRequireAuth from "@/hooks/useRequireAuth";
import { getDbTokenByDbUserId } from "@/lib/db/db";
import GitHubPrsService, { GitHubPullRequest, GitHubPrSearchParams, GitHubSearchDefaultQuery } from "@/lib/github/prs";
import PrCard from "@/components/github/Pr";

export default async function QueryPrPage() {

	console.log("QueryPage: Start");

	const { user, session, isAuthorized } = await useRequireAuth();
	if (!session || !isAuthorized) {
		console.log("ProfilePage: Not authorized");
		return null;
	} else {
		console.log("ProfilePage: Authorized");
	}
	const searchParams = {
		author: 'diberry',
		repo: 'MicrosoftDocs/node-essentials',
	};
	const accessToken = await getDbTokenByDbUserId(session?.userId);

	if (!accessToken) {
		console.log("QueryPage: No access token");
		return null;
	}

	const items = await GitHubPrsService.queryPrs(accessToken, searchParams);

	if (!items) {
		console.log("QueryPage: No items");
		return null;
	}

	return (
		<>
			<h1>PRs: {searchParams.repo}</h1>
			<div className="container mx-auto p-4">
				{items.map((pr: GitHubPullRequest) => (
					<PrCard key={pr.id} pr={pr} componentOwner={searchParams.repo} />
				))}
			</div>
		</>
	);
}