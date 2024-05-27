import { app, InvocationContext, output } from "@azure/functions";
import { ProcessingDocument, TransformedData } from "../models";
import { GitHubDataAsStorageData } from "../github";
import { Storage } from "../azure-blob-storage";
import { fileNameToParts } from "../url";
import { transformUploadedToDocs } from "../transform";

const sendToCosmosDb = output.cosmosDB({
    databaseName: '%AZURE_COSMOSDB_DATABASE_NAME%',
    containerName: '%AZURE_COSMOSDB_CONTAINER_NAME_ISSUES%',
    connection: 'AZURE_COSMOSDB_CONNECTION_STRING',
});

const connectionStringForBlob = process.env.AZURE_STORAGE_CONNECTION_STRING;
const storageContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME;


async function getStorageDataFromDbDocInsert(docs: ProcessingDocument[], context: InvocationContext) {

    if (!docs || docs.length === 0) {
        context.log('No documents to process');
        return;
    }

    for (const doc of docs) {

        const docToProcess = doc as ProcessingDocument;

        const { date, name, numDays } = fileNameToParts(docToProcess.name);

        // skip if any of the required fields are missing
        if (!date || !name || !numDays) {
            context.log(`Skipping document with date ${date}, name ${name}, and numDays ${numDays}`);
            continue;
        }
        context.log(`Processing document with date ${date}, name ${name}, and numDays ${numDays}`);

        // Read blob
        const githubDataFromStorage = new GitHubDataAsStorageData(console.log);
        const data = await githubDataFromStorage.getFileData(docToProcess.url, connectionStringForBlob);

        if (!data || data.length === 0) {
            context.log(`No data found in blob for ${docToProcess.url}`);
            continue;
        }

        // Transform data
        const transformedDocs: TransformedData[] = transformUploadedToDocs(data, name, console.log);

        if (!transformedDocs || transformedDocs.length === 0) {
            context.log(`No transformed data found for ${docToProcess.url}`);
            continue;
        }

        // Output to CosmosDB
        for (const doc of transformedDocs) {
            context.log(`Document to create for CosmosDB: ${JSON.stringify(doc)}`);

            context.extraOutputs.set(sendToCosmosDb, doc);
        }

    }
}
export async function listenToDatabase(documents: unknown[], context: InvocationContext): Promise<void> {

    try {

        if (!connectionStringForBlob) throw new Error('Connection string for blob is required');
        if (!storageContainerName) throw new Error('Storage container name is required');

        context.log(`Cosmos DB function processed ${documents.length} documents`);
        await getStorageDataFromDbDocInsert(documents as ProcessingDocument[], context);

    } catch (error) {
        context.log(`listenToDatabase - Error processing documents: ${error}`);
    }


}
app.cosmosDB('listen-to-database', {
    connection: 'AZURE_COSMOSDB_CONNECTION_STRING',
    databaseName: '%AZURE_COSMOSDB_DATABASE_NAME%',
    containerName: '%AZURE_COSMOSDB_CONTAINER_NAME_PROCESSING%',
    handler: listenToDatabase
});
