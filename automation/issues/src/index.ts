import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {
  GitHubIssue,
  GitHubIssueSearchResult,
  GitHubIssueResult,
  AppResult
} from './model.js';

async function loadRepos(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../repos.json');
  const data = await readFile(filePath, 'utf8');

  const repos = JSON.parse(data);

  return repos;
}
async function loadUsers(): Promise<string[]> {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const filePath = join(__dirname, '../users.json');
  const data = await readFile(filePath, 'utf8');

  const users = JSON.parse(data);

  return users;
}

function convertIssueToResult(issue: GitHubIssue): AppResult {
  return {
    date_created: issue.created_at,
    type: issue.state,
    id: issue.id,
    repo: issue.repository_url,
    title: issue.title,
    user: issue.user.login,
    url: issue.url
  };
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

async function processRepos(
  beginDate: string,
  endDate: string,
  repos: string[]
): Promise<AppResult[]> {
  const results: AppResult[] = [];

  // Get data
  for await (const repo of repos) {
    const url = `https://api.github.com/repos/${repo}/issues?created:${beginDate}..${endDate}`;
    const repoResult: GitHubIssue[] = await fetchRepoData(url);

    // Transform data
    for (const item of repoResult) {
      results.push(convertIssueToResult(item));
    }
  }

  return results;
}
async function processUserIssues(
  beginDate: string,
  endDate: string,
  user: string
): Promise<AppResult[]> {
  const results: AppResult[] = [];

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
      results.push(convertIssueToResult(item));
    }
  }

  return results;
}
function getDates(beginDays: string, endDays: string) {
  // Parse beginDays and endDays as integers
  const beginDaysInt = parseInt(beginDays, 10);
  const endDaysInt = parseInt(endDays, 10);

  // Check if beginDays and endDays are valid integers
  if (isNaN(beginDaysInt) || isNaN(endDaysInt)) {
    throw new Error('beginDays and endDays must be valid integers');
  }

  // Get the current date
  const currentDate = new Date();

  // Get the date of beginDays days ago
  const beginDate = new Date();
  beginDate.setDate(currentDate.getDate() - parseInt(beginDays));

  // Get the date of endDays days ago
  const endDate = new Date();
  endDate.setDate(currentDate.getDate() - parseInt(endDays));

  // Format the dates in YYYY-MM-DD format
  const beginDateString = beginDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];

  // Output as markdown with links to URLs
  const formatBeginDate = `${beginDate.toLocaleString('default', {
    month: 'long'
  })} ${beginDate.getDate()}, ${beginDate.getFullYear()}`;
  const formatEndDate = `${endDate.toLocaleString('default', {
    month: 'long'
  })} ${endDate.getDate()}, ${endDate.getFullYear()}`;

  return {
    beginDate,
    endDate,
    formatBeginDate,
    formatEndDate,
    beginDateString,
    endDateString
  };
}
function printData(
  beginDate: string,
  endDate: string,
  reportName: string,
  data: AppResult[]
) {
  console.log(`# ${reportName} from ${beginDate} to ${endDate}`);
  console.log(`|Id|Type|Repo|User|Title|Date|`);
  console.log(`|--|--|--|--|--|--|`);

  data.forEach((item: AppResult) => {
    // split url into its parts
    const urlParts = item.url.split('/');
    const owner = urlParts[4];
    const repo = urlParts[5];
    const user = item.user;

    // remove time from date
    item.date_created = item.date_created.split(',')[0];

    console.log(
      `|${item.id}|${item.type}|${owner}/${repo}|${user}| [${item.title}](${item.url})|${item.date_created}|`
    );
  });
}

// Load list of repos
const repos: string[] = await loadRepos();

// Load list of users
const users: string[] = await loadUsers();

// Get the dates
const previousDaysBegin = (process.env.PREVIOUS_DAYS_BEGIN as string) || '2';
const previousDaysEnd = (process.env.PREVIOUS_DAYS_END as string) || '1';

const dates = getDates(previousDaysBegin, previousDaysEnd);

// Get data and transform it
const issuesAndPrs = await processRepos(
  dates.beginDateString,
  dates.endDateString,
  repos
);
printData(
  dates.formatBeginDate,
  dates.formatEndDate,
  'Repos - GitHub issues and prs',
  issuesAndPrs
);

// Assigned to users
const assignedIssuesAndPrs: AppResult[] = [];

// Get data for users
for await (const user of users) {
  const userIssues = await processUserIssues(
    dates.beginDateString,
    dates.endDateString,
    user
  );
  assignedIssuesAndPrs.push(...userIssues);
}

printData(
  dates.formatBeginDate,
  dates.formatEndDate,
  'Assigned - GitHub issues and prs',
  assignedIssuesAndPrs
);
