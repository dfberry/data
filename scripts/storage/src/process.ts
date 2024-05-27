import * as https from 'https';
import { promises as fs } from 'fs';
import * as path from 'path';
import { outputJson, readJson, readJsonSync } from 'fs-extra'

import unzipper from 'unzipper';
import { v4 as uuidv4 } from 'uuid';
import { BlobServiceClient } from '@azure/storage-blob';
import { CosmosClient, DatabaseRequest } from '@azure/cosmos';
import 'dotenv/config';

const status = 'all';
const user = 'dfberry';
const repo = 'data';

const tempStatusDir = 'try1';
const tempdir = `data/${tempStatusDir}`;

const tempSubDirFiles = 'github_files';
const tempSubDirIssues = 'github_issues';
const githubFileDir = 'github';
const databaseName = 'github_history';
const databaseContainerProcessing = 'data_processing';
const databaseContainerIssues = 'issues';

let githubFiles = [];
let databaseFiles = [];
let filesToDownload = [];

async function createDirs() {
    const pathToGitHubFiles = path.join(__dirname, '..', tempdir, tempSubDirFiles);
    const pathToGitHubIssues = path.join(__dirname, '..', tempdir, tempSubDirIssues);

    await fs.mkdir(pathToGitHubFiles, { recursive: true });
    await fs.mkdir(pathToGitHubIssues, { recursive: true });

    console.log(`Directory created: ${pathToGitHubFiles}`);
    console.log(`Directory created: ${pathToGitHubIssues}`);
}
async function getFilesInGitHubSubdir(user, repo, path) {

    console.log('getFilesInGitHubSubdir');

    try {

        if (!user)
            throw new Error('Missing user');
        if (!repo)
            throw new Error('Missing repo');
        if (!path)
            throw new Error('Missing path');

        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
        console.log('URL:', url);

        const response = await fetch(url);
        const data: any[] = await response.json();

        console.log(data);

        if (Array.isArray(data)) {
            const files = data.filter(file => file.name.endsWith('.json')).map(file => file.name);
            return files;
        }
        else {
            throw new Error('Invalid response from GitHub API');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function getFilesInDatabase(dbClient, database, container) {
    try {
        console.log('Getting files from database');
        const databaseClient = dbClient.database(database);
        const containerClient = databaseClient.container(container);
        const query = 'SELECT * FROM c';
        const { resources } = await containerClient.items.query(query).fetchAll();
        const files = resources.map(resource => resource.name);
        return files;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getFileContentsFromGitHub(user, repo, path): Promise<string | undefined> {
    try {
        console.log('getFileContentsFromGitHub');
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
        console.log('URL:', url);
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            const content = Buffer.from(data.content, 'base64').toString('utf8');
            return content; //is this a string or JSON
        } else {
            return undefined;
        }
    } catch (error) {
        console.error(error);
        throw error;

    }
}
function getDbClient() {
    const dbConnectionString = process.env.AZURE_COSMOS_CONNECTION_STRING as string;
    if (!dbConnectionString) {
        throw new Error('Missing AZURE_COSMOS_CONNECTION_STRING environment variable');
    }
    const client = new CosmosClient(dbConnectionString);
    return client;
}
function getStorageClient() {
    const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string;
    if (!storageConnectionString) {
        throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING environment variable');
    }
    const client = BlobServiceClient.fromConnectionString(storageConnectionString);
    return client;
}

async function insertItemIntoDatabase(dbClient, database, container, item) {
    try {
        const databaseClient = dbClient.database(database);
        const containerClient = databaseClient.container(container);

        await containerClient.items.create(item);

        return item;
    } catch (error) {
        console.log('Error:', error);
        throw error;
    }

}
function fileNameToParts(fileName, logger = console.log) {

    try {
        if (!fileName) {
            logger('File name is required');
            return { date: undefined, name: undefined, numDays: undefined };
        }

        logger(`fileNameToParts - File name: ${fileName}`);

        const regex = /^(\d{8})_(.+)_(\d+)\.json$/;
        const match = fileName.match(regex);
        const date = match[1];
        const name = match[2];
        const numDays = parseInt(match[3]);

        console.log(`fileNameToParts - Date: ${date}, Name: ${name}, NumDays: ${numDays}`)

        return { date, name, numDays };
    } catch (error) {
        logger(`fileNameToParts - Error parsing file name: ${error}`);
        throw error;
    }
}
function queryParts(query) {

    console.log('Query:', query);

    /* examples:
     "https://api.github.com/search/issues?q=author:diberry+created:2024-05-11..2024-05-11"
     "https://api.github.com/repos/MicrosoftDocs/mslearn-advocates.azure-functions-and-signalr/issues?created:2024-05-11..2024-05-11"
     https://api.github.com/search/issues?q=involves:diberry+created:2024-05-11..2024-05-11
    
    */
    const regexSearch = /https:\/\/api\.github\.com\/search\/issues\?q=([^:]+):([^+]+)\+(\w+):(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})/;
    const regexIssues = /https:\/\/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)\/([^?]+)\?([^:]+):([^..]+)\.\.([^$]+)/;

    const regex = (query.includes('search')) ? regexSearch : regexIssues;
    const match = query.match(regex);

    if (query.includes('search')) {
        // return {
        //     endpoint: match[1],
        //     queryParam1: match[3],
        //     queryValue1: match[4],
        //     queryParam2: match[5],
        //     queryValue2: match[6],
        //     startDate: match[7],
        //     endDate: match[8],
        // }

        return `search-issues-q-${match[1]}-${match[2]}-${match[2]}-${match[4]}`

    }
    if (query.includes('repos')) {
        // return {
        //     orgName: match[1],
        //     repoName: match[2],
        //     endPoint: match[3],
        //     queryParam: match[4],
        //     startDate: match[5],
        //     endDate: match[6],
        // }
        return `repos-${match[1]}-${match[2]}-${match[3]}-${match[4]}-${match[5]}`
    }
    return `${uuidv4().toString()}`;
}
function gitHubUrlToParts(url) {
    //repository_url"
    //https://api.github.com/repos/Azure-Samples/azure-search-openai-demo
    //'https://api.github.com/repos/Azure-Samples/azure-search-openai-demo';

    const regex = /https:\/\/api\.github\.com\/repos\/([^\/]+)\/([^\/]+)/;
    const match = url.match(regex);

    if (match) {
        const orgName = match[1];
        const repoName = match[2];

        return {
            orgName,
            repoName
        };
    }

}

// What new files are in GitHub
async function step1() {
    console.log('Step 1');
    const fileName = 'step1.json';
    const stepFilePath = path.join(__dirname, '..', tempdir, fileName);

    let githubFiles;

    try {
        // data in failes
        await fs.access(stepFilePath);
        githubFiles = await readJson(stepFilePath, 'utf8');
    } catch (error) {
        // data in GitHub
        githubFiles = await getFilesInGitHubSubdir(user, repo, 'github/stats');
        await outputJson(stepFilePath, githubFiles, { spaces: 2 });
    }

    return githubFiles;
}
// What files are already in database
async function step2(dbClient, databaseName, databaseContainerProcessing) {
    console.log('Step 2');
    const fileName = 'step2.json';
    const stepFilePath = path.join(__dirname, '..', tempdir, fileName);

    let databaseFiles;

    try {
        await fs.access(stepFilePath);
        databaseFiles = await readJson(stepFilePath, 'utf8');
    } catch (error) {
        databaseFiles = await getFilesInDatabase(dbClient, databaseName, databaseContainerProcessing);
        await outputJson(stepFilePath, databaseFiles, { spaces: 2 });
    }

    return databaseFiles;
}
// Diff of github versus database files
async function step3(githubFiles, databaseFiles) {
    console.log('Step 3');
    const fileName = 'step3.json';
    const stepFilePath = path.join(__dirname, '..', tempdir, fileName);

    let filesToDownload;

    try {
        filesToDownload = await readJson(stepFilePath, 'utf8');
    } catch (error) {
        filesToDownload = githubFiles.filter(file => !databaseFiles.includes(file.name));
        await outputJson(stepFilePath, filesToDownload, { spaces: 2 });
    }
    return filesToDownload;
}
function stampData(dataArray, query, fileName) {

    for (const data of dataArray) {
        data.query = query;
        data.processing_fileName = fileName;
        data.original_id = data.id;
        data.id = uuidv4().toString();
    }

    return dataArray;
}
async function downloadFileFromGitHubManager(filesToDownload) {

    try {

        let downloadedFiles = [];
        const downloadedFilesPath = path.join(__dirname, '..', tempdir, tempSubDirFiles + '/');
        console.log('Downloaded Files Path:', downloadedFilesPath);
        for (const file of filesToDownload) {
            const content: string = await getFileContentsFromGitHub(user, repo, `github/stats/${file}`);
            if (content.length > 0) {
                await fs.writeFile
                    (downloadedFilesPath + file, content);
                downloadedFiles.push(file);
            }
        }
        return downloadedFiles;
    } catch (error) {
        console.error(error);
        throw error;
    }

}
// Download missing files from GitHub
async function step4() {

    try {

        console.log('Step 4');
        const fileName = 'step4.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);

        let downloadedFiles = [];
        let downloadStatus = [];

        try {
            await fs.access(stepFilePath);
            downloadedFiles = await readJson(stepFilePath, 'utf8');
        } catch (error) {

            const filesToDownloadPath = path.join(__dirname, '..', tempdir, 'step3.json');
            const filesToDownload = await readJson(filesToDownloadPath);

            if (filesToDownload.length === 0) return;

            const downloadFileList = await downloadFileFromGitHubManager(filesToDownload)
            await outputJson(stepFilePath, downloadFileList, { spaces: 2 });
        }
        return downloadedFiles;
    } catch (error) {
        console.error(error);
        throw error;

    }
}
// read each file, get issues in flattened format
async function step5(filesToFlatten) {
    console.log('Step 5');
    const fileName = 'step5.json';
    const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
    let flattenedFiles = [];

    try {
        await fs.access(stepFilePath);
        flattenedFiles = await readJson(stepFilePath, 'utf8');
    } catch (error) {
        for (const file of filesToFlatten) {

            console.log(`Flattening ${file}`);

            const contentPath = path.join(__dirname, '..', tempdir, tempSubDirFiles, file);
            const content = await readJson(contentPath);

            if (content.length === 0 || (!Array.isArray(content))) continue;

            if (file.includes('my_daily_repos')) {
                console.log('Repos');
                let repo_issues = content
                    .map(repo => {
                        if (repo.results.length > 0) {
                            return stampData(repo.results, repo.url, file);
                        } else {
                            return [];
                        }
                    })
                    .filter(results => results.length > 0)
                    .flat();

                const reposFilePath = path.join(__dirname, '..', tempdir, tempSubDirIssues, `${file}`);
                if (repo_issues.length > 0) {
                    await outputJson(reposFilePath, repo_issues, { spaces: 2 });
                    console.log('Writing:', file);
                    flattenedFiles.push(file);
                }

            } else if (file.includes('my_daily_requested_involvement') || file.includes('my_daily_issues_and_prs')) {
                console.log('Items');
                let my_issues = content
                    .map(item => {
                        if (item.results.items.length > 0) {
                            return stampData(item.results.items, item.url, file);
                        } else {
                            return [];
                        }

                    })
                    .filter(results => results.length > 0)
                    .flat();

                const reposFilePath = path.join(__dirname, '..', tempdir, tempSubDirIssues, `${file}`);
                if (my_issues.length > 0) {
                    console.log('Writing:', file);
                    await outputJson(reposFilePath, my_issues, { spaces: 2 });
                    flattenedFiles.push(file);

                }
            } else {
                console.log('Unknown');

            }
        }
        await outputJson(stepFilePath, flattenedFiles, { spaces: 2 });
    }

    return flattenedFiles;
}
// insert into database
async function step6(dbClient, filesToInsertIntoDb) {

    try {
        console.log('Step 6');
        const fileName = 'step6.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
        let my_db_files = [];

        for (const file of filesToInsertIntoDb) {
            console.log(`Inserting ${file}`);

            const contentPath = path.join(__dirname, '..', tempdir, tempSubDirIssues, file);
            const content = await readJson(contentPath);

            const fileNameParts = fileNameToParts(file);

            for (const item of content) {

                const parts = queryParts(item.query);

                const urlParts = gitHubUrlToParts(item.repository_url);
                item.original_id = item.id;

                item.id = (parts.includes(`repos`)) ? `${parts}.${item.original_id}` : `${parts}.${urlParts.orgName}.${urlParts.repoName}.${item.original_id}`;
                console.log(`Inserting item ${item.id}`);
                item.type = fileNameParts?.name;

                if (item.type === undefined) {
                    console.log('Type is undefined');
                    continue;
                }

                item.type_org_repo_issue = `${item.type}.${urlParts.orgName}.${urlParts.repoName}.${item.id}`;

                await insertItemIntoDatabase(dbClient, databaseName, databaseContainerIssues, item);
                my_db_files.push({ fileName: file, id: item.id, repo: item.repo, type: item.type });
            }
        }
        await outputJson(stepFilePath, my_db_files, { spaces: 2 });
        return my_db_files;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
async function main() {

    try {

        const dbClient = getDbClient();
        //const storageClient = getStorageClient();

        await createDirs();

        const githubFiles = await step1();
        const databaseFiles = await step2(dbClient, databaseName, databaseContainerProcessing);
        const filesToDownload = await step3(githubFiles, databaseFiles);

        if (filesToDownload.length === 0) return;
        const downloadedFiles = await step4();

        if (downloadedFiles.length === 0) return;
        const filesToInsertIntoDb = await step5(downloadedFiles);
        if (filesToInsertIntoDb.length === 0) return;
        const dbFiles = await step6(dbClient, filesToInsertIntoDb);
        if (dbFiles.length === 0) return;

        return 'done';

    }

    catch (error) {
        console.error(error);
    }
}

main().then(result => console.log(result)).catch(console.error);