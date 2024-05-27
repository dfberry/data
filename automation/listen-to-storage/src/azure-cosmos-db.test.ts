import { CosmosDb } from './azure-cosmos-db';
import { CosmosClient } from "@azure/cosmos";

jest.mock('@azure/cosmos');

describe('CosmosDb', () => {
    let cosmosDb;
    let logger;
    let mockContainer;

    beforeEach(() => {
        logger = jest.fn();
        cosmosDb = new CosmosDb(logger);

        mockContainer = {
            items: {
                create: jest.fn(),
            },
        };

        (CosmosClient as jest.Mock).mockReturnValue({
            databases: {
                createIfNotExists: jest.fn().mockResolvedValue({ database: { containers: { createIfNotExists: jest.fn().mockResolvedValue({ container: mockContainer }) } } }),
            },
        });
    });

    describe('getContainerClient', () => {
        it('should create container client', async () => {
            const container = await cosmosDb.getContainerClient('connectionString', 'databaseName', 'containerName');
            expect(container).toBe(mockContainer);
        });
    });
    describe('insertIntoDb', () => {
        it('should insert into db', async () => {
            const doc = { id: '1', name: 'Test' };
            await cosmosDb.insertIntoDb(mockContainer, doc);
            expect(mockContainer.items.create).toHaveBeenCalledWith(doc);
        });
    });
});