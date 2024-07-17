import { SearchResults, GitHubIssue } from '@/lib/github/search-issue';


export const sortAndGroupIssues = (issues: GitHubIssue[]): Record<string, GitHubIssue[]> => {

    console.log(issues);

    // Sort issues by repository URL
    const sortedIssues = issues.sort((a, b) => a.repository_url.localeCompare(b.repository_url));

    // Group issues by repository URL
    const groupedIssues = sortedIssues.reduce<Record<string, GitHubIssue[]>>((acc, issue) => {
        const repoUrl = issue.repository_url;
        if (!acc[repoUrl]) {
            acc[repoUrl] = [];
        }
        acc[repoUrl].push(issue);
        return acc;
    }, {});

    console.log(groupedIssues);
    return groupedIssues;
};