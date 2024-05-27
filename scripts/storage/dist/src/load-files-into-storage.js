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
const https = require("https");
const fs = require("fs");
const unzipper_1 = require("unzipper");
const uuid_1 = require("uuid");
const storage_blob_1 = require("@azure/storage-blob");
const cosmos_1 = require("@azure/cosmos");
require("dotenv/config");
function downloadAndUploadRepo(repoUrl, storageConnectionString, storageContainerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const zipFilePath = './repo.zip';
        const storageDirectory = './storage';
        // Download the GitHub repository as a zip file
        const file = fs.createWriteStream(zipFilePath);
        yield new Promise((resolve, reject) => {
            https.get(repoUrl, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close(resolve);
                });
                file.on('error', reject);
            });
        });
        // Extract the zip file
        yield fs.createReadStream(zipFilePath).pipe(unzipper_1.default.Extract({ path: storageDirectory }));
        // Get a reference to the Azure Storage container
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(storageConnectionString);
        const containerClient = blobServiceClient.getContainerClient(storageContainerName);
        // Read the files in the storage directory and upload them to Azure Storage
        const files = fs.readdirSync(storageDirectory);
        for (const file of files) {
            const filePath = `${storageDirectory}/${file}`;
            const blobClient = containerClient.getBlockBlobClient(file);
            yield blobClient.uploadFile(filePath);
            console.log(`Uploaded ${file} to Azure Storage`);
        }
    });
}
function syncFiles(user, repo, listA, listB, storageConnectionString, storageContainerName) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get a reference to the Azure Storage container
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(storageConnectionString);
        const containerClient = blobServiceClient.getContainerClient(storageContainerName);
        // Compare the two lists of files
        const filesToDownload = listA.filter(file => !listB.includes(file));
        for (const file of filesToDownload) {
            // Download the file from GitHub
            const url = `https://raw.githubusercontent.com/${user}/${repo}/master/${file}`;
            const response = yield https.get(url);
            const filePath = `./${file}`;
            const fileStream = fs.createWriteStream(filePath);
            response.pipe(fileStream);
            // Wait for the download to finish
            yield new Promise((resolve, reject) => {
                fileStream.on('finish', resolve);
                fileStream.on('error', reject);
            });
            // Upload the file to Azure Storage
            const blobClient = containerClient.getBlockBlobClient(file);
            yield blobClient.uploadFile(filePath);
            console.log(`Uploaded ${file} to Azure Storage`);
        }
    });
}
function getFilesInSubdir(user, repo, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
        const response = yield fetch(url);
        const data = yield response.json();
        const files = data.map(file => file.name);
        return files;
    });
}
function getFilesInDatabase(dbClient, database, container) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Getting files from database');
        const databaseClient = dbClient.database(database);
        const containerClient = databaseClient.container(container);
        const query = 'SELECT * FROM c';
        const { resources } = yield containerClient.items.query(query).fetchAll();
        const files = resources.map(resource => resource.name);
        return files;
    });
}
function getFileContents(user, repo, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.github.com/repos/${user}/${repo}/contents/${path}`;
        const response = yield fetch(url);
        const data = yield response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return content;
    });
}
/*
downloadAndUploadRepo(
    'https://api.github.com/repos/dfberry/data/zipball',
    process.env.AZURE_STORAGE_CONNECTION_STRING as string,
    'my-history'
);
*/
//https://api.github.com/repos/<user>/<repo>/zipball
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
function insertFileUrlIntoDatabase(dbClient, database, container, items) {
    return __awaiter(this, void 0, void 0, function* () {
        const databaseClient = dbClient.database(database);
        const containerClient = databaseClient.container(container);
        for (const item of items) {
            yield containerClient.items.create(item);
        }
        return items;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const dbClient = getDbClient();
        const storageClient = getStorageClient();
        const githubFiles = yield getFilesInSubdir('dfberry', 'data', 'github/stats');
        console.log('GitHub Files:', githubFiles);
        const databaseFiles = yield getFilesInDatabase(dbClient, 'github_history', 'data_processing');
        console.log('Database Files:', databaseFiles);
        // Compare the two lists of files
        const filesToDownload = githubFiles.filter(file => !databaseFiles.includes(file));
        // write every item in a JSON object
        for (const file of filesToDownload) {
            console.log('Downloading:', file);
            //const content = await getFileContents('dfberry', 'data', `github/stats/${file}`);
            const item = {
                id: (0, uuid_1.v4)(),
                name: file,
                processed: false,
                created: new Date().toISOString(),
            };
            yield insertFileUrlIntoDatabase(dbClient, 'github_history', 'data_processing', item);
            console.log('Sent to db:', filesToDownload);
        }
    });
}
main().catch(console.error);
//# sourceMappingURL=load-files-into-storage.js.map