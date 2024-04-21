import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
async function loadRepos() {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, '../repos.json');
    const data = await readFile(filePath, 'utf8');
    const repos = JSON.parse(data);
    console.log(repos);
    return repos;
}
function convertIssueToResult(issue) {
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
async function fetchData(url, repo) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    // @ts-ignore
    const data = await response.json();
    if (data.length === 0) {
        return [];
    }
    return data;
}
async function processRepos(beginDate, endDate) {
    let results = [];
    // Get data
    for await (const repo of repos) {
        const url = `https://api.github.com/repos/${repo}/issues?created:${beginDate}..${endDate}`;
        const repoResult = await fetchData(url, repo);
        // Transform data
        for (const item of repoResult) {
            results.push(convertIssueToResult(item));
        }
    }
    return results;
}
function getDates(beginDays, endDays) {
    // Get the current date
    let currentDate = new Date();
    // Get the days of 2 days ago
    const beginDate = new Date();
    beginDate.setDate(currentDate.getDate() - parseInt(beginDays));
    // Get the date of 1 day ago
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() - parseFloat(endDays));
    // Format the dates in YYYY-MM-DD format
    const beginDateString = beginDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
    // Output as markdown with links to URLs
    const formatBeginDate = `${beginDate.toLocaleString('default', { month: 'long' })} ${beginDate.getDate()}, ${beginDate.getFullYear()}`;
    const formatEndDate = `${endDate.toLocaleString('default', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;
    return { beginDate, endDate, formatBeginDate, formatEndDate, beginDateString, endDateString };
}
// Load list of repos
const repos = await loadRepos();
// Get the dates
const previousDaysBegin = process.env.PREVIOUS_DAYS_BEGIN;
const previousDaysEnd = process.env.PREVIOUS_DAYS_End;
const dates = getDates(previousDaysBegin, previousDaysEnd);
// Get data and transform it
const issuesAndPrs = await processRepos(dates.beginDateString, dates.endDateString);
// Present data
console.log(`# GitHub issues and prs from ${dates.formatBeginDate} to ${dates.formatEndDate}`);
console.log(`|Id|Type|Repo|User|Title|Date|`);
console.log(`|--|--|--|--|--|--|`);
issuesAndPrs.forEach((item) => {
    // split url into its parts
    const urlParts = item.url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    const user = item.user;
    // remove time from date
    item.date_created = item.date_created.split(',')[0];
    console.log(`|${item.id}|${item.type}|${owner}/${repo}|${user}| [${item.title}](${item.url})|${item.date_created}|`);
});
