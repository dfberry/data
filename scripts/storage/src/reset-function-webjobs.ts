import { BlobServiceClient } from '@azure/storage-blob';
import 'dotenv/config';
import * as functionWebjobs from '../../../function_webjobs_definition.json';
function wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const resetFunctionWebJobs = async () => {
    try {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING as string;

        if (!connectionString) {
            throw new Error('Missing AZURE_STORAGE_CONNECTION_STRING environment variable');
        }

        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // delete all containers
        for await (const container of functionWebjobs) {

            const containerName = container.containerName;
            console.log(`Reading container: ${containerName}`);

            const containerClient = blobServiceClient.getContainerClient(containerName);

            // list all blobs
            let response = await containerClient.listBlobsFlat();

            for await (const blob of response) {

                console.log(`Blob name: ${blob.name}`);

                for await (const partialPath of container.paths) {

                    // check if blob name contains the partial path
                    if (blob.name.includes(partialPath)) {

                        console.log(`Deleting blob name: ${blob.name} for partial path: ${partialPath}`);

                        // delete the blob
                        const blobClient = containerClient.getBlobClient(blob.name);
                        await blobClient.delete();
                        console.log(`Deleted blob`);
                    }
                }
            }
        }

    } catch (error) {
        console.error(error);
    }
}

resetFunctionWebJobs().catch(console.error);