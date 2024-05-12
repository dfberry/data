import { GitHubIssueSearchResponse, DateRange } from './model.js';
import { fetchIssues } from './utils.js';

export async function processRepos(
  dateRange: DateRange,
  repos: string[]
): Promise<any[]> {
  const results = [];

  for await (const repo of repos) {
    // Get data
    const url = `https://api.github.com/repos/${repo}/issues?created:${dateRange.start}..${dateRange.end}`;
    const data: GitHubIssueSearchResponse = await fetchIssues(url);
    results.push({
      dateRange,
      url,
      repo,
      results: data
    });
  }
  return results;
}
