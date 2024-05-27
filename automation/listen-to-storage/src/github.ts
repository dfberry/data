import { Storage } from './azure-blob-storage';
import { BlobDataRepo, BlobDataItems } from './models';

export class GitHubDataAsStorageData {

    private logger: (message?: any, ...optionalParams: any[]) => void;

    constructor(logger?: (message?: any, ...optionalParams: any[]) => void) {
        this.logger = logger || (() => { });
    }

    public async getFileData(blobUrl: string, connectionString: string): Promise<BlobDataRepo[] | BlobDataItems[]> {

        if (!connectionString) {
            throw new Error('Invalid connectionString');
        }

        if (!blobUrl) {
            throw new Error('Invalid blobUrl');
        }

        const storage = new Storage(this.logger);
        const blobClient = storage.getBlobClient(connectionString, blobUrl);

        if (!blobClient) {
            throw new Error("Blob Client is required");
        }

        const buffer = await storage.getBlobBuffer(blobUrl, blobClient);

        if (!buffer) {
            throw new Error("Buffer is required");
        }

        const blobString = storage.bufferToString(buffer);

        if (!blobString) {
            throw new Error("Blob string is required");
        }

        const json: BlobDataRepo[] | BlobDataItems[] = this.stringToJson(blobString);

        if (!json) {
            throw new Error("JSON is required");
        }

        return json;
    }
    private stringToJson(blobString: string): BlobDataRepo[] | BlobDataItems[] {

        if (blobString.length === 0) {
            return [];
        }

        const untypedData = this.parseJson(blobString);

        if ('repo' in untypedData[0]) {
            return untypedData as BlobDataRepo[];
        } else {
            return untypedData as BlobDataItems[];
        }
    }
    private parseJson(blobString: string | undefined): Object | Object[] | undefined {
        try {
            if (!blobString || blobString.length === 0) {
                return undefined;
            }

            return JSON.parse(blobString);
        } catch (error) {
            this.logger(`Error parsing JSON: ${error}`);
            throw new Error('Invalid JSON');
        }
    }
}