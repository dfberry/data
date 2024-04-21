import fetch from 'node-fetch';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

type Issue = {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    node_id: string;
    number: number;
    title: string;
    user: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    };
    labels: {
        id: number;
        node_id: string;
        url: string;
        name: string;
        color: string;
        default: boolean;
        description: string | null;
    }[];
    state: string;
    locked: boolean;
    assignee: null;
    assignees: any[];
    milestone: null;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    author_association: string;
    active_lock_reason: null;
    body: string;
    reactions: {
        url: string;
        total_count: number;
        "+1": number;
        "-1": number;
        laugh: number;
        hooray: number;
        confused: number;
        heart: number;
        rocket: number;
        eyes: number;
    };
    timeline_url: string;
    performed_via_github_app: null;
    state_reason: null;
};
type Result = {
    date_created: string,
    type: string,
    id: number,
    repo: string,
    title: string,
    user: string,
    url: string
};

async function loadRepos(): Promise<string[]> {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const filePath = join(__dirname, '../repos.json');
    const data = await readFile(filePath, 'utf8');

    const repos = JSON.parse(data);
    console.log(repos);
    return repos;
}
function convertIssueToResult(issue: Issue): Result {
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
async function fetchData(url: string, repo: string): Promise<Issue[]> {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // @ts-ignore
    const data: any = await response.json();

    if (data.length === 0) {
        return [];
    }

    return data;

}

async function processRepos(beginDate: string, endDate: string): Promise<Result[]> {

    let results: Result[] = [];

    // Get data
    for await (const repo of repos) {

        const url = `https://api.github.com/repos/${repo}/issues?created:${beginDate}..${endDate}`
        const repoResult: Issue[] = await fetchData(url, repo);

        // Transform data
        for (const item of repoResult) {
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
    let currentDate = new Date();

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
    const formatBeginDate = `${beginDate.toLocaleString('default', { month: 'long' })} ${beginDate.getDate()}, ${beginDate.getFullYear()}`;
    const formatEndDate = `${endDate.toLocaleString('default', { month: 'long' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;

    return { beginDate, endDate, formatBeginDate, formatEndDate, beginDateString, endDateString };
}


// Load list of repos
const repos: string[] = await loadRepos();

// Get the dates
const previousDaysBegin = process.env.PREVIOUS_DAYS_BEGIN as string || "8";
const previousDaysEnd = process.env.PREVIOUS_DAYS_End as string || "1";
const dates = getDates(previousDaysBegin, previousDaysEnd);

// Get data and transform it
const issuesAndPrs = await processRepos(dates.beginDateString, dates.endDateString);

// Present data
console.log(`# GitHub issues and prs from ${dates.formatBeginDate} to ${dates.formatEndDate}`);
console.log(`|Id|Type|Repo|User|Title|Date|`);
console.log(`|--|--|--|--|--|--|`);

issuesAndPrs.forEach((item: Result) => {

    // split url into its parts
    const urlParts = item.url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    const user = item.user;

    // remove time from date
    item.date_created = item.date_created.split(',')[0];

    console.log(`|${item.id}|${item.type}|${owner}/${repo}|${user}| [${item.title}](${item.url})|${item.date_created}|`)
});