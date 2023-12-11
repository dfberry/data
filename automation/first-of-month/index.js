import fetch from 'node-fetch';

// Define the authors
const authors = ["diberry", "dfberry", "v-geberr"];

// Initialize an empty array to store the results
let results = [];

// Get the current date
let currentDate = new Date();

// Get the first and last day of the previous month
let firstDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
let lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

// Format the dates in YYYY-MM-DD format
let firstDayOfPreviousMonthStr = firstDayOfPreviousMonth.toISOString().split('T')[0];
let lastDayOfPreviousMonthStr = lastDayOfPreviousMonth.toISOString().split('T')[0];


// Function to fetch data for each author
async function fetchData(author) {
    const response = await fetch(`https://api.github.com/search/issues?q=author:${author}+created:${firstDayOfPreviousMonthStr}..${lastDayOfPreviousMonthStr}`);

    const data = await response.json();

    // Loop through the items in the response
    for (let item of data.items) {

        // org or owner name from repo url
        const owner = item.repository_url.split('/').slice(-2)[0];


        // If the author is in the owners list, skip the item
        if (authors.includes(owner)) {
            continue;
        }
        
        // Create an object with the required data
        let result = {
            date_created: item.created_at,
            type: "pull_request" in item ? "pr" : "issue",
            id: item.number,
            title: item.title,
            url: item.html_url
        };

        // Add the object to the results array
        results.push(result);
    }
}
// loop through results and group by repo with count of issues and prs
// { repo: 'name', issues: 0, prs: 0, items: [] }
function aggregateData() {
    let repos = {};

    for (let item of results) {
        // If the repo doesn't exist in the repos object, add it
        if (!repos[item.repo]) {
            repos[item.repo] = { repo: item.repo, issues: 0, prs: 0, items: [] };
        }

        // Increment the issues or prs count based on the item type
        if (item.type === 'issue') {
            repos[item.repo].issues++;
        } else if (item.type === 'pr') {
            repos[item.repo].prs++;
        }

        item.date_created = new Date(item.date_created).toLocaleString();

        // Add the item to the items array for the repo
        repos[item.repo].items.push(item);
    }

    // Convert the repos object to an array of its values
    return Object.values(repos);
}

async function processAuthors() {

    // fetch author data and store in results
    for await(let author of authors) {
        await fetchData(author);
    } 

    // Aggregate the data by repo
    let aggregatedData = aggregateData();

    // for each repo, sort the items by date_created
    // save data back into original object
    for (let repo of aggregatedData) {
        repo.items.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
    }

    return aggregatedData[0].items;
}

// After all requests are done, log the results
const sortedAuthorData = await processAuthors();
//console.log(JSON.stringify(sortedAuthorData, null, 4));

// Output as markdown with links to URLs

// month and year
console.log(`# GitHub issues and prs for ${firstDayOfPreviousMonth.toLocaleString('default', { month: 'long' })} ${firstDayOfPreviousMonth.getFullYear()}`);

// add repo org/owner and repo name
console.log(`|Id|Type|Repo|Title|Date|`);
console.log(`|--|--|--|--|--|`);

sortedAuthorData.forEach(item => {

    // split url into its parts
    const urlParts = item.url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];

    // remove time from date
    item.date_created = item.date_created.split(',')[0];

    console.log(`|${item.id}|${item.type}|${owner}/${repo}|[${item.title}](${item.url})|${item.date_created}|`)
});