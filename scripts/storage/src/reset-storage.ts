import { BlobServiceClient } from '@azure/storage-blob';
import 'dotenv/config';
import * as storageDefinition from '../../../storage_definition.json';
function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const resetBlobStorage = async () => {
    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string;

        if (!connectionString) {
            throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING environment variable');
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // delete all containers
        for await (const container of storageDefinition.containers) {

            console.log(`Deleting container: ${container}`);

            try {
                const containerClient = blobServiceClient.getContainerClient(container);
                const deleteResponse = await containerClient.delete();
                console.log(`Deleted container: ${deleteResponse._response.status}`);

                // Check deletion completion
                let isDeleted = false;
                while (!isDeleted) {
                    try {
                        await containerClient.getProperties();
                        // If getProperties() succeeds, the container still exists. Wait before trying again.
                        await wait(5000);
                    } catch (error) {
                        // If getProperties() throws an error, the container has been deleted.
                        isDeleted = true;
                        console.log(`Deleted container - done: ${container}`)
                    }
                }
                const createResponse = await containerClient.create();
                if (createResponse._response.status === 201) {
                    console.log(`Created container: ${container}`);
                }
            } catch (error) {
                console.error(`${error}`);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

resetBlobStorage().catch(console.error);