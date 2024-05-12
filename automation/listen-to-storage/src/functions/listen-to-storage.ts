import { app, InvocationContext, output } from "@azure/functions";
import { v4 as uuidv4 } from 'uuid';

const sendToCosmosDb = output.cosmosDB({
    databaseName: 'github_history',
    containerName: 'data_processing',
    connection: 'AZURE_COSMOSDB_CONNECTION_STRING',
});

export async function listenToStorage(blob: Buffer, context: InvocationContext): Promise<void> {
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

    context.log(`Document to crete for CosmosDB: ${JSON.stringify(docForDatabase)}`)
    context.extraOutputs.set(sendToCosmosDb, docForDatabase);

    context.log('Document created for CosmosDB');

}

app.storageBlob('listen-to-storage', {
    path: 'my-history/{name}',
    connection: 'AZURE_STORAGE_CONNECTION_STRING',
    extraOutputs: [sendToCosmosDb],
    handler: listenToStorage
});
