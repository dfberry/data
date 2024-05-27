import { BlobServiceClient, BlobClient } from "@azure/storage-blob";

export class Storage {

    private logger: (message?: any, ...optionalParams: any[]) => void;

    constructor(logger?: (message?: any, ...optionalParams: any[]) => void) {
        this.logger = logger || (() => { });
    }

    public getServiceClient(connectionString: string) {

        if (!connectionString) {
            throw new Error('Connection string is required');
        }

        return BlobServiceClient.fromConnectionString(connectionString);
    }

    public getBlobClient(connectionString: string, blobUrl: string): BlobClient {

        if (!connectionString) {
            throw new Error('Connection string is required');
        }

        if (!blobUrl) {
            throw new Error('Blob URL is required');
        }


        const { containerName, blobName } = this.parseUrl(blobUrl);

        const blobServiceClient = this.getServiceClient(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        return containerClient.getBlobClient(blobName);
    }

    public parseUrl(blobUrl: string) {

        if (!blobUrl) {
            throw new Error('Blob URL is required');
        }

        const urlParts = blobUrl.split("/");
        return {
            containerName: urlParts[urlParts.length - 2],
            blobName: urlParts[urlParts.length - 1],
        };
    }

    public bufferToString(buffer: Buffer): string {

        if (!buffer) {
            throw new Error("Buffer is required");
        }
        return buffer.toString();
    }

    public async getBlobBuffer(blobUrl: string, blobClient: BlobClient): Promise<Buffer> {

        if (!blobUrl) {
            throw new Error("Blob URL is required");
        }

        if (!blobClient) {
            throw new Error("Blob Client is required");
        }

        // read file
        const blobBuffer = await blobClient.downloadToBuffer();

        return blobBuffer;

    }


}
