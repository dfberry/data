// node main.js --numDays=7 --type=someType
import {
  parseArgs,
  printYesterdayDate,
  saveUtf8File,
  getStartAndEndOfYesterday
} from './utils.js';
import { AppCli, LoadedData, DateRange } from './model.js';
import { processAuthors } from './process-my-issues.js';
import { processRepos } from './process-repos.js';
import { processRequestedInvolvement } from './process-requested-involvement.js';
import { loadData } from './load-data.js';

async function manager(dateRange: DateRange, numDays: number, type: string) {
  const { users, repos }: LoadedData = await loadData();

  let results = undefined;
  let partialFileName = '';

  switch (type) {
    case 'MY_ISSUES':
      results = await processAuthors(dateRange, users);
      partialFileName = 'my_daily_issues_and_prs';

      break;
    case 'MY_REPOS':
      results = await processRepos(dateRange, repos);
      partialFileName = 'my_daily_repos';
      break;
    case 'OTHER_ISSUES':
      results = await processRequestedInvolvement(dateRange, users);
      partialFileName = 'my_daily_requested_involvement';
      break;
    default:
      console.error('Invalid type');
      break;
  }

  return {
    results,
    partialFileName
  };
}

async function main() {
  const { numDays, type }: AppCli = parseArgs(process.argv.slice(2));

  console.log(`numDays:${numDays}, type:${type}`);

  // TBD: fix this range
  const date = printYesterdayDate();
  const dateRange = getStartAndEndOfYesterday(numDays, numDays);

  if (numDays && type) {
    const data = await manager(dateRange, numDays, type);
    await saveUtf8File(
      `./data/${date}_${data.partialFileName}_${numDays}.json`,
      JSON.stringify(data.results, null, 2)
    );
  } else if (numDays && !type) {
    const dataIssues = await manager(dateRange, numDays, 'MY_ISSUES');
    await saveUtf8File(
      `./data/${date}_${dataIssues.partialFileName}_${numDays}.json`,
      JSON.stringify(dataIssues.results, null, 2)
    );

    const dataRepos = await manager(dateRange, numDays, 'MY_REPOS');
    await saveUtf8File(
      `./data/${date}_${dataRepos.partialFileName}_${numDays}.json`,
      JSON.stringify(dataRepos.results, null, 2)
    );

    const dataRequestedInvolvement = await manager(
      dateRange,
      numDays,
      'OTHER_ISSUES'
    );
    await saveUtf8File(
      `./data/${date}_${dataRequestedInvolvement.partialFileName}_${numDays}.json`,
      JSON.stringify(dataRequestedInvolvement.results, null, 2)
    );
  } else {
    console.error('Please provide numDays and type as command line arguments.');
  }
}

main().catch(console.error);
