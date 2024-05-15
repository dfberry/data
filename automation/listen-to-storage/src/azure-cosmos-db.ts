const { CosmosClient } = require("@azure/cosmos");

const client = new CosmosClient(process.env.AZURE_COSMOSDB_CONNECTION_STRING);
const databaseName = 'github_history';

export async function getContainerClient(containerName: string, logger) {
    try {
        const { database } = await client.databases.createIfNotExists({ id: databaseName });
        const { container } = await database.containers.createIfNotExists({ id: containerName });
        return container;
    } catch (error) {
        logger(`getContainerClient - Error inserting document: ${error}`);
    }
}

export async function insertIntoDb(containerClient, doc) {

    try {
        await containerClient.items.create(doc);
    } catch (error) {
        console.log(`insertIntoDb - Error inserting document: ${error}`);
    }

}
