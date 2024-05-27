// Azure Cosmos script to remove all containers then recreate them
// Usage: `node scripts/reset-database.js`

import { CosmosClient, DatabaseRequest } from '@azure/cosmos';
import 'dotenv/config'

import * as databaseDefinition from '../../../database_definition.json';
function wait(ms: number) {
    //return new Promise(resolve => setTimeout(resolve, ms));
    return Promise.resolve();
}

const resetDatabase = async () => {
    try {
        const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING as string;

        if (!connectionString) {
            throw new Error('Missing AZURE_COSMOS_CONNECTION_STRING environment variable');
        }

        const client = new CosmosClient(connectionString);

        for (const database of databaseDefinition) {
            const dbDeleteResult = await client.database(database.databaseName).delete();
            await wait(5000);

            if (dbDeleteResult.statusCode === 204) {
                console.log(`Deleted database: ${database.databaseName}`);
            } else {
                console.error(`Failed to delete database: ${database.databaseName} with code ${dbDeleteResult.statusCode}`);
            }
        }

        for await (const db of databaseDefinition) {

            const dbRequest: DatabaseRequest = {
                id: db.databaseName
            };

            const dbResponse = await client.databases.create(dbRequest);
            await wait(5000);

            if (dbResponse.statusCode === 201) {
                console.log(`Created database: ${dbResponse.database.id}`);

                for await (const container of db.containers) {
                    console.log(`Creating container: ${container.name}`);
                    const containerRequest = {
                        id: container.name,
                        partitionKey: container.partitionKey
                    };
                    const containerResponse = await client.database(db.databaseName).containers.create(containerRequest);
                    await wait(5000);
                    console.log(`Container: ${container.name} created in database: ${containerResponse.statusCode === 201 ? 'succeeded' : 'failed'}`);
                }

            }
        }
    } catch (error) {
        console.error(error);
    }
}

resetDatabase().catch(console.error);