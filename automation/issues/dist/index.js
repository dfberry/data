import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
async function loadRepos() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, '../repos.json');
    const data = await readFile(filePath, 'utf8');
    const repos = JSON.parse(data);
    return repos;
}
async function loadUsers() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, '../users.json');
    const data = await readFile(filePath, 'utf8');
    const users = JSON.parse(data);
    return users;
}
function getArg() {
    const args = process.argv;
    const dateRange = args[2].toUpperCase() || 'MONTH';
    if (!['LAST_MONTH', 'LAST_WEEK', 'LAST_DAY'].includes(dateRange)) {
        throw new Error('Invalid period. Expected LAST_MONTH, LAST_WEEK, or LAST_DAY');
    }
    return dateRange;
}
function convertIssueToResult(issue) {
    return {
        date_created: issue.created_at,
        // show how old an issue is between the created_at date and the current date
        issue_age: Math.floor((new Date().getTime() - new Date(issue.created_at).getTime()) /
            (1000 * 60 * 60 * 24)),
        type: issue.state,
        id: issue.id,
        repo: issue.repository_url,
        title: issue.title,
        user: issue.user.login,
        url: issue.url
    };
}
async function fetchRepoData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json());
    if (data.length === 0) {
        return [];
    }
    return data;
}
async function fetchIssues(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = (await response.json());
    if (data.total_count === 0) {
        return [];
    }
    return data.items;
}
async function processRepos(beginDate, endDate, repos) {
    const results = [];
    // Get data
    for await (const repo of repos) {
        const url = `https://api.github.com/repos/${repo}/issues?created:${beginDate}..${endDate}`;
        const repoResult = await fetchRepoData(url);
        // Transform data
        for (const item of repoResult) {
            results.push(convertIssueToResult(item));
        }
    }
    return results;
}
async function processUserIssues(beginDate, endDate, user) {
    const results = [];
    const arrayUrls = [];
    arrayUrls.push(`https://api.github.com/search/issues?q=assignee:${user}+created:${beginDate}..${endDate}`);
    arrayUrls.push(`https://api.github.com/search/issues?q=mentions:${user}+created:${beginDate}..${endDate}`);
    for await (const url of arrayUrls) {
        const userIssues = await fetchIssues(url);
        // Transform data
        for (const item of userIssues) {
            results.push(convertIssueToResult(item));
        }
    }
    return results;
}
function getDates(period) {
    // Get the current date
    const today = new Date();
    // Initialize beginDate and endDate
    let beginDate;
    let endDate;
    switch (period) {
        case 'LAST_MONTH':
            beginDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            break;
        case 'LAST_WEEK':
            beginDate = new Date(today.getTime());
            beginDate.setDate(today.getDate() - 7);
            endDate = new Date(today.getTime());
            endDate.setDate(today.getDate() - 1);
            break;
        case 'LAST_DAY':
            beginDate = new Date(today.getTime());
            beginDate.setDate(today.getDate() - 1);
            endDate = new Date(today.getTime());
            endDate.setDate(today.getDate() - 1);
            break;
        default:
            throw new Error('Invalid period. Expected LAST_MONTH, LAST_WEEK, or LAST_DAY');
    }
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
function printData(beginDate, endDate, reportName, data) {
    console.log(`# ${reportName} from ${beginDate} to ${endDate}`);
    console.log(`|Id|Type|Repo|User|Title|Date|Age|`);
    console.log(`|--|--|--|--|--|--|--|`);
    data.forEach((item) => {
        // split url into its parts
        const urlParts = item.url.split('/');
        const owner = urlParts[4];
        const repo = urlParts[5];
        const user = item.user;
        // remove time from date
        item.date_created = item.date_created.split(',')[0];
        console.log(`|${item.id}|${item.type}|${owner}/${repo}|${user}| [${item.title}](${item.url})|${item.date_created}|${item.issue_age}|`);
    });
}
// Load list of repos
const repos = await loadRepos();
// Load list of users
const users = await loadUsers();
const dateRangeSelector = getArg();
const dates = getDates(dateRangeSelector);
// Get data and transform it
const issuesAndPrs = await processRepos(dates.beginDateString, dates.endDateString, repos);
printData(dates.formatBeginDate, dates.formatEndDate, 'Repos - GitHub issues and prs', issuesAndPrs);
// Assigned to users
const assignedIssuesAndPrs = [];
// Get data for users
for await (const user of users) {
    const userIssues = await processUserIssues(dates.beginDateString, dates.endDateString, user);
    assignedIssuesAndPrs.push(...userIssues);
}
printData(dates.formatBeginDate, dates.formatEndDate, 'Assigned - GitHub issues and prs', assignedIssuesAndPrs);
//# sourceMappingURL=index.js.map