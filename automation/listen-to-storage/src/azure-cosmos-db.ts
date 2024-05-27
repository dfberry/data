import { CosmosClient } from "@azure/cosmos";

export class CosmosDb {

    private logger: (message?: any, ...optionalParams: any[]) => void;

    constructor(logger: (message?: any, ...optionalParams: any[]) => void = console.log) {
        this.logger = logger;
    }

    public async getContainerClient(connectionString: string, databaseName: string, containerName: string) {

        if (!connectionString) {
            throw new Error('Connection string is required');
        }

        const client = new CosmosClient(connectionString);
        const { database } = await client.databases.createIfNotExists({ id: databaseName });
        const { container } = await database.containers.createIfNotExists({ id: containerName });

        return container;
    }

    public async insertIntoDb(containerClient, doc) {

        await containerClient.items.create(doc);

    }
}
