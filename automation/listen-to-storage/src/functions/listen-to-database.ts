import { app, InvocationContext, output } from "@azure/functions";
import { ProcessingDocument, BlobData } from "../models";
import { getJsonFromBlob } from "../azure-blob-storage";
import { fileNameToParts } from "../url";
import { transformUploadedToDocs } from "../transform";
import { getContainerClient, insertIntoDb } from "../azure-cosmos-db";

const sendToCosmosDb = output.cosmosDB({
    databaseName: 'github_history',
    containerName: 'issues_test',
    connection: 'AZURE_COSMOSDB_CONNECTION_STRING',
});

const connectionStringForBlob = process.env.AZURE_STORAGE_CONNECTION_STRING;
export async function listenToDatabase(documents: unknown[], context: InvocationContext): Promise<void> {

    try {

        context.log(`Cosmos DB function processed ${documents.length} documents`);
        const containerClient = await getContainerClient('issues_test', console.log);

        context.log(`Documents: ${process.env.AZURE_COSMOSDB_CONNECTION_STRING}`);

        for (const doc of documents) {

            const docToProcess = doc as ProcessingDocument;

            const { date, name, numDays } = fileNameToParts(docToProcess.name);
            context.log(`Processing document with date ${date}, name ${name}, and numDays ${numDays}`);

            if (date && name && numDays) {

                // Read DB doc
                context.log(`Processing document with date ${date}, name ${name}, and numDays ${numDays}`);

                // Read blob
                const data: BlobData[] = await getJsonFromBlob(docToProcess.url, connectionStringForBlob, console.log);

                // Transform data
                const transformedDocs = transformUploadedToDocs(data, name);

                // Output to CosmosDB
                for (const doc of transformedDocs) {
                    context.log(`Document to crete for CosmosDB: ${JSON.stringify(doc)}`)
                    //context.extraOutputs.set(sendToCosmosDb, doc);
                    await insertIntoDb(containerClient, doc);
                }
            }

        }
    } catch (error) {
        context.log(`listenToDatabase - Error processing documents: ${error}`);
    }
}
app.cosmosDB('listen-to-database', {
    connection: 'AZURE_COSMOSDB_CONNECTION_STRING',
    databaseName: 'github_history',
    containerName: 'data_processing_test',
    handler: listenToDatabase
});
