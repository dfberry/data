import {
  DateRange,
  AppCli,
  AppType,
  GitHubIssueSearchResponse
} from './model.js';
import { promises as fs } from 'fs';

export function getStartAndEndOfYesterday(start = 1, end = 1): DateRange {
  const today = new Date();

  const yesterdayStart = new Date();
  yesterdayStart.setDate(today.getDate() - start);

  const yesterdayEnd = new Date();
  yesterdayEnd.setDate(today.getDate() - end);

  const result = {
    start: yesterdayStart.toISOString().split('T')[0],
    end: yesterdayEnd.toISOString().split('T')[0]
  };
  console.log(result);
  return result;
}

export function parseArgs(args: string[]): AppCli {
  let numDays = 1;
  let type = ''; // Assign an initial value of type AppType

  args.forEach((arg) => {
    if (arg.startsWith('--numDays=')) {
      numDays = Number(arg.split('=')[1]);
    } else if (arg.startsWith('--type=')) {
      type = arg.split('=')[1] as AppType; // Cast the value to AppType
    }
  });

  return { numDays, type };
}
export async function fetchIssues(
  url: string
): Promise<GitHubIssueSearchResponse> {
  console.log(`Fetching issues from ${url}`);
  const response = await fetch(url);

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

export function printYesterdayDate() {
  const date = new Date();
  date.setDate(date.getDate() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}
export async function saveUtf8File(
  filePath: string,
  data: string
): Promise<void> {
  console.log(`Saving file to ${filePath}`);
  await fs.writeFile(filePath, data, 'utf-8');
}
