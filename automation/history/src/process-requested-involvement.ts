import { DateRange, GitHubIssueSearchResponse } from './model.js';
import { fetchIssues } from './utils.js';

export async function processRequestedInvolvement(
  dateRange: DateRange,
  authors: string[]
): Promise<any[]> {
  const results = [];

  const qArray = [
    'commenter',
    'mentions',
    'involves',
    'reviewed-by',
    'assignee'
  ];

  for (const query of qArray) {
    for (const user of authors) {
      const url = `https://api.github.com/search/issues?q=${query}:${user}+created:${dateRange.start}..${dateRange.end}`;
      const data: GitHubIssueSearchResponse = await fetchIssues(url);
      results.push({
        dateRange,
        url,
        user,
        results: data
      });
    }
  }
  return results;
}
