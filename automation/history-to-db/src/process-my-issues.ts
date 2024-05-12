import { DateRange, GitHubIssueSearchResponse } from './model.js';
import { fetchIssues } from './utils.js';

export async function processAuthors(
  dateRange: DateRange,
  authors: string[]
): Promise<any[]> {
  const results = [];

  // fetch author data and store in results
  for await (const author of authors) {
    const url = `https://api.github.com/search/issues?q=author:${author}+created:${dateRange.start}..${dateRange.end}`;
    const data: GitHubIssueSearchResponse = await fetchIssues(url);
    results.push({
      dateRange,
      url,
      author,
      results: data
    });
  }
  return results;
}
