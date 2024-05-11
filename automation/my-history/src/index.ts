import fetch from 'node-fetch';
import {
  DateRange,
  GitHubAuthorData,
  GitHubIssueSearchResponse,
  GitHubIssue
} from './types';

// Define the authors
const authors = ['diberry', 'dfberry', 'v-geberr'];

function getStartAndEndOfYesterday(): DateRange {
  const yesterdayStart = new Date();
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  yesterdayStart.setHours(0, 0, 0, 0);

  const yesterdayEnd = new Date(yesterdayStart);
  yesterdayEnd.setHours(23, 59, 59, 999);

  return {
    start: {
      date: yesterdayStart,
      iso: yesterdayStart.toISOString(),
      string: yesterdayStart.toISOString().split('T')[0]
    },
    end: {
      date: yesterdayEnd,
      iso: yesterdayEnd.toISOString(),
      string: yesterdayEnd.toISOString().split('T')[0]
    }
  };
}

// Function to fetch data for each author
async function fetchData(
  author: string,
  dateRange: DateRange
): Promise<GitHubIssueSearchResponse> {
  // Initialize an empty array to store the results
  const results: GitHubAuthorData[] = [];
  const response = await fetch(
    `https://api.github.com/search/issues?q=author:${author}+created:${dateRange.start.string}..${dateRange.end.string}`
  );

  if (response.ok) {
    const data = (await response.json()) as GitHubIssueSearchResponse;
    return data;
  }

  return {
    total_count: 0,
    incomplete_results: false,
    items: []
  };
}
async function processAuthors(): Promise<GitHubIssueSearchResponse[]> {
  const resultsForAuthors: GitHubIssueSearchResponse[] = [];
  const dateRange = getStartAndEndOfYesterday();

  // fetch author data and store in results
  for await (const author of authors) {
    const data: GitHubIssueSearchResponse = await fetchData(author, dateRange);
    resultsForAuthors.push(data);
  }
  return resultsForAuthors;
}

processAuthors()
  .then((results: GitHubIssueSearchResponse[]) => {
    console.log(JSON.stringify(results));
  })
  .catch((error: unknown) => {
    console.error(error);
  });
