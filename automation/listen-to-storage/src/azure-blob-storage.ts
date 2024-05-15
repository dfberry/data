import { BlobServiceClient } from "@azure/storage-blob";
import { BlobData } from "./models";

export async function getJsonFromBlob(blobUrl: string, connectionString: string, logger): Promise<BlobData[]> {

    try {

        // Authenticate to service
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // Parse URL
        const urlParts = blobUrl.split("/");
        const containerName = urlParts[urlParts.length - 2];
        const blobName = urlParts[urlParts.length - 1];

        // Create client objects
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        // read file
        const blobBuffer = await blobClient.downloadToBuffer();

        // convert buffer to string
        const blobString = blobBuffer.toString();

        // convert string to JSON
        return JSON.parse(blobString) as BlobData[];


    } catch (error) {
        logger(`getJsonFromBlob - Error reading blob: ${error}`);
    }
}
