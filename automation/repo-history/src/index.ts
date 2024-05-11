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
async function loadRepos(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../repos.json');
  const data = await readFile(filePath, 'utf8');

  const repos = JSON.parse(data);

  return repos;
}
async function fetchRepoData(url: string): Promise<GitHubIssue[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: [] = (await response.json()) as [];

  if (data.length === 0) {
    return [];
  }

  return data;
}

async function processRepos(
  beginDate: string,
  endDate: string,
  repos: string[]
): Promise<any[]> {
  const results = [];

  // Get data
  for await (const repo of repos) {
    const url = `https://api.github.com/repos/${repo}/issues?created:${beginDate}..${endDate}`;
    const repoResult: GitHubIssue[] = await fetchRepoData(url);
    results.push(repoResult);
  }

  return results;
}

async function main() {
  const repos = await loadRepos();
  const dateRange = getStartAndEndOfYesterday();
  const results = await processRepos(
    dateRange.start.string,
    dateRange.end.string,
    repos
  );
  return results;
}

main()
  .then((results) => {
    console.log(JSON.stringify(results));
  })
  .catch((error: unknown) => {
    console.error(error);
  });
