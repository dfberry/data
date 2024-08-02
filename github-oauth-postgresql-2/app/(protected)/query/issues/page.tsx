import useRequireAuth from "@/hooks/useRequireAuth";
import GitHubIssuesService, { GitHubSearchDefaultQuery } from "@/lib/github/issues";
import { getDbTokenByDbUserId } from "@/lib/db/db";
import { GitHubIssue } from "@/lib/github/issues";
import IssueCard from "@/components/github/Issue";
import GitHubUserService from '@/lib/github/user';
import { getLastDaysRange } from '@/lib/datetime';
import { DateTimeReturnType } from '@/lib/datetime';
export default async function QueryIssuesPage() {

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
	const { login } = await GitHubUserService.getGithHubUserBySessionResult({ session, user });
	const last30Days = getLastDaysRange();

	const searchParams = {
		[GitHubSearchDefaultQuery.AUTHOR]: login,
		[GitHubSearchDefaultQuery.CREATED]: last30Days.string
	};


	const { items } = await GitHubIssuesService.queryIssues(accessToken, searchParams);

	return (
		<>
			<h1>Issues</h1>
			<div className="container mx-auto p-4">
				{items.map((issue: GitHubIssue) => (
					<IssueCard key={issue.id} issue={issue} showRepoNameEachRow={true} />
				))}
			</div>
		</>
	);
}