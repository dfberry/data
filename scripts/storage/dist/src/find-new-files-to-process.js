"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path = require("path");
const fs_extra_1 = require("fs-extra");
const storage_blob_1 = require("@azure/storage-blob");
const cosmos_1 = require("@azure/cosmos");
require("dotenv/config");
const status = 'all';
const user = 'dfberry';
const repo = 'data';
const tempStatusDir = 'try3';
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
function createDirs() {
    return __awaiter(this, void 0, void 0, function* () {
        const pathToGitHubFiles = path.join(__dirname, '..', tempdir, tempSubDirFiles);
        const pathToGitHubIssues = path.join(__dirname, '..', tempdir, tempSubDirIssues);
        yield fs_1.promises.mkdir(pathToGitHubFiles, { recursive: true });
        yield fs_1.promises.mkdir(pathToGitHubIssues, { recursive: true });
    });
}
function getFilesInGitHubSubdir(user, repo, path) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const response = yield fetch(url);
            const data = yield response.json();
            console.log(data);
            if (Array.isArray(data)) {
                const files = data.filter(file => file.name.endsWith('.json')).map(file => file.name);
                return files;
            }
            else {
                throw new Error('Invalid response from GitHub API');
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
function getFilesInDatabase(dbClient, database, container) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Getting files from database');
            const databaseClient = dbClient.database(database);
            const containerClient = databaseClient.container(container);
            const query = 'SELECT * FROM c';
            const { resources } = yield containerClient.items.query(query).fetchAll();
            const files = resources.map(resource => resource.name);
            return files;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
function getFileContentsFromGitHub(user, repo, path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('getFileContentsFromGitHub');
            const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
            console.log('URL:', url);
            const response = yield fetch(url);
            if (response.ok) {
                const data = yield response.json();
                const content = Buffer.from(data.content, 'base64').toString('utf8');
                return content; //is this a string or JSON
            }
            else {
                return undefined;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
function getDbClient() {
    const dbConnectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;
    if (!dbConnectionString) {
        throw new Error('Missing AZURE_COSMOS_CONNECTION_STRING environment variable');
    }
    const client = new cosmos_1.CosmosClient(dbConnectionString);
    return client;
}
function getStorageClient() {
    const storageConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!storageConnectionString) {
        throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING environment variable');
    }
    const client = storage_blob_1.BlobServiceClient.fromConnectionString(storageConnectionString);
    return client;
}
function insertItemIntoDatabase(dbClient, database, container, item) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const databaseClient = dbClient.database(database);
            const containerClient = databaseClient.container(container);
            if ((typeof item.id) !== 'string') {
                item.id = item.id.toString();
            }
            yield containerClient.items.create(item);
            return item;
        }
        catch (error) {
            console.log('Error:', error);
            throw error;
        }
    });
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
        console.log(`fileNameToParts - Date: ${date}, Name: ${name}, NumDays: ${numDays}`);
        return { date, name, numDays };
    }
    catch (error) {
        logger(`fileNameToParts - Error parsing file name: ${error}`);
        throw error;
    }
}
// What new files are in GitHub
function step1() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Step 1');
        const fileName = 'step1.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
        let githubFiles;
        try {
            // data in failes
            yield fs_1.promises.access(stepFilePath);
            githubFiles = yield (0, fs_extra_1.readJson)(stepFilePath, 'utf8');
        }
        catch (error) {
            // data in GitHub
            //githubFiles = await getFilesInGitHubSubdir(user, repo, 'github/stats');
            yield (0, fs_extra_1.outputJson)(stepFilePath, githubFiles, { spaces: 2 });
        }
        return githubFiles;
    });
}
// What files are already in database
function step2(dbClient, databaseName, databaseContainerProcessing) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Step 2');
        const fileName = 'step2.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
        let databaseFiles;
        try {
            yield fs_1.promises.access(stepFilePath);
            databaseFiles = yield (0, fs_extra_1.readJson)(stepFilePath, 'utf8');
        }
        catch (error) {
            databaseFiles = yield getFilesInDatabase(dbClient, databaseName, databaseContainerProcessing);
            yield (0, fs_extra_1.outputJson)(stepFilePath, databaseFiles, { spaces: 2 });
        }
        return databaseFiles;
    });
}
// Diff of github versus database files
function step3(githubFiles, databaseFiles) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Step 3');
        const fileName = 'step3.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
        let filesToDownload;
        try {
            filesToDownload = yield (0, fs_extra_1.readJson)(stepFilePath, 'utf8');
        }
        catch (error) {
            filesToDownload = githubFiles.filter(file => !databaseFiles.includes(file.name));
            yield (0, fs_extra_1.outputJson)(stepFilePath, filesToDownload, { spaces: 2 });
        }
        return filesToDownload;
    });
}
function downloadFileFromGitHubManager(filesToDownload) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let downloadedFiles = [];
            const downloadedFilesPath = path.join(__dirname, '..', tempdir, tempSubDirFiles + '/');
            console.log('Downloaded Files Path:', downloadedFilesPath);
            for (const file of filesToDownload) {
                const content = yield getFileContentsFromGitHub(user, repo, `github/stats/${file}`);
                if (content.length > 0) {
                    yield fs_1.promises.writeFile(downloadedFilesPath + file, content);
                    downloadedFiles.push(file);
                }
            }
            return downloadedFiles;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
// Download missing files from GitHub
function step4() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Step 4');
            const fileName = 'step4.json';
            const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
            let downloadedFiles = [];
            try {
                yield fs_1.promises.access(stepFilePath);
                downloadedFiles = yield (0, fs_extra_1.readJson)(stepFilePath, 'utf8');
            }
            catch (error) {
                const filesToDownloadPath = path.join(__dirname, '..', tempdir, 'step3.json');
                const filesToDownload = yield (0, fs_extra_1.readJson)(filesToDownloadPath);
                if (filesToDownload.length === 0)
                    return;
                const downloadFileList = downloadFileFromGitHubManager(filesToDownload);
                yield (0, fs_extra_1.outputJson)(stepFilePath, downloadFileList, { spaces: 2 });
            }
            return downloadedFiles;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    });
}
// read each file, get issues in flattened format
function step5(filesToFlatten) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Step 5');
        const fileName = 'step5.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
        let flattenedFiles = [];
        try {
            yield fs_1.promises.access(stepFilePath);
            flattenedFiles = yield (0, fs_extra_1.readJson)(stepFilePath, 'utf8');
        }
        catch (error) {
            for (const file of filesToFlatten) {
                const contentPath = path.join(__dirname, '..', tempdir, tempSubDirFiles, file);
                const content = yield (0, fs_extra_1.readJson)(contentPath);
                if (content.length === 0 || (!Array.isArray(content)))
                    continue;
                if (file.includes('my_daily_repos')) {
                    console.log('Repos');
                    let repo_issues = content
                        .map(repo => repo.results)
                        .filter(results => results.length > 0)
                        .flat();
                    console.log('My Repo Issues:', repo_issues);
                    const reposFilePath = path.join(__dirname, '..', tempdir, tempSubDirIssues, `${file}`);
                    if (repo_issues.length > 0) {
                        yield (0, fs_extra_1.outputJson)(reposFilePath, repo_issues, { spaces: 2 });
                        flattenedFiles.push(file);
                    }
                }
                else if (file.includes('my_daily_requested_involvement') || file.includes('my_daily_issues_and_prs')) {
                    console.log('Items');
                    let my_issues = content
                        .map(item => item.results.items)
                        .filter(items => items.length > 0)
                        .flat();
                    console.log('My Issues:', my_issues);
                    const reposFilePath = path.join(__dirname, '..', tempdir, tempSubDirIssues, `${file}`);
                    if (my_issues.length > 0) {
                        yield (0, fs_extra_1.outputJson)(reposFilePath, my_issues, { spaces: 2 });
                        flattenedFiles.push(file);
                    }
                }
            }
            yield (0, fs_extra_1.outputJson)(stepFilePath, flattenedFiles, { spaces: 2 });
        }
        return flattenedFiles;
    });
}
// insert into database
function step6(dbClient, filesToInsertIntoDb) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Step 6');
        const fileName = 'step6.json';
        const stepFilePath = path.join(__dirname, '..', tempdir, fileName);
        let my_db_files = [];
        for (const file of filesToInsertIntoDb) {
            const contentPath = path.join(__dirname, '..', tempdir, tempSubDirIssues, file);
            const content = yield (0, fs_extra_1.readJson)(contentPath);
            const fileNameParts = fileNameToParts(file);
            for (const item of content) {
                item.type = fileNameParts.name;
                yield insertItemIntoDatabase(dbClient, databaseName, databaseContainerIssues, item);
                my_db_files.push({ fileName: file, id: item.id, repo: item.repo, type: item.type });
            }
        }
        yield (0, fs_extra_1.outputJson)(stepFilePath, my_db_files, { spaces: 2 });
        return my_db_files;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbClient = getDbClient();
            //const storageClient = getStorageClient();
            const githubFiles = yield step1();
            const databaseFiles = yield step2(dbClient, databaseName, databaseContainerProcessing);
            const filesToDownload = yield step3(githubFiles, databaseFiles);
            if (filesToDownload.length === 0)
                return;
            const downloadedFiles = yield step4();
            if (downloadedFiles.length === 0)
                return;
            const filesToInsertIntoDb = yield step5(downloadedFiles);
            if (filesToInsertIntoDb.length === 0)
                return;
            const dbFiles = yield step6(dbClient, filesToInsertIntoDb);
            if (dbFiles.length === 0)
                return;
            console.log('All done');
        }
        catch (error) {
            console.error(error);
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=find-new-files-to-process.js.map