import { app, InvocationContext, output } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';

const sendToCosmosDb = output.cosmosDB({
    databaseName: '%AZURE_COSMOSDB_DATABASE_NAME%',
    containerName: '%AZURE_COSMOSDB_CONTAINER_NAME_PROCESSING%',
    connection: 'AZURE_COSMOSDB_CONNECTION_STRING'
});

export async function listenToStorage(blob: Buffer, context: InvocationContext): Promise<void> {

    try {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);

        const docForDatabase = {
            // create a random ID
            id: uuidv4(),
            url: context.triggerMetadata.uri,
            name: context.triggerMetadata.name,
            properties: context.triggerMetadata.properties,
            path: context.triggerMetadata.path,
            length: blob.length,
            processed: false,
            dateProcessed: null,
            dateUploaded: new Date().toISOString(),
        }

        context.log(`Document to create for CosmosDB: ${JSON.stringify(docForDatabase)}`)
        context.extraOutputs.set(sendToCosmosDb, docForDatabase);

        context.log('Document created for CosmosDB');
    } catch (error) {
        context.log(`listenToStorage - Error processing blob: ${error}`);
    }
}

app.storageBlob('listen-to-storage', {
    path: '%AZURE_STORAGE_CONTAINER_NAME%/{name}',
    connection: 'AZURE_STORAGE_CONNECTION_STRING',
    extraOutputs: [sendToCosmosDb],
    handler: listenToStorage
});
