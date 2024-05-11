import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GitHubIssue, DateRange, GitHubIssueSearchResult } from './model.js';
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
async function loadUsers(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../users.json');
  const data = await readFile(filePath, 'utf8');

  const users = JSON.parse(data);

  return users;
}
async function fetchIssues(url: string): Promise<GitHubIssue[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as GitHubIssueSearchResult;

  if (data.total_count === 0) {
    return [];
  }

  return data.items as GitHubIssue[];
}

async function processUserIssues(
  beginDate: string,
  endDate: string,
  user: string
): Promise<any[]> {
  const results = [];

  const arrayUrls = [];
  arrayUrls.push(
    `https://api.github.com/search/issues?q=assignee:${user}+created:${beginDate}..${endDate}`
  );
  arrayUrls.push(
    `https://api.github.com/search/issues?q=mentions:${user}+created:${beginDate}..${endDate}`
  );

  for await (const url of arrayUrls) {
    const userIssues: GitHubIssue[] = await fetchIssues(url);

    // Transform data
    for (const item of userIssues) {
      results.push(item);
    }
  }

  return results;
}

async function main() {
  const users = await loadUsers();
  const dateRange = getStartAndEndOfYesterday();

  const assignedIssuesAndPrs = [];

  // Get data for users
  for await (const user of users) {
    const userIssues = await processUserIssues(
      dateRange.start.string,
      dateRange.end.string,
      user
    );
    assignedIssuesAndPrs.push({
      user,
      results: userIssues
    });
  }
  return assignedIssuesAndPrs;
}

main()
  .then((results) => {
    console.log(JSON.stringify(results));
  })
  .catch((error: unknown) => {
    console.error(error);
  });
