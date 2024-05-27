import { BlobServiceClient, BlobClient } from "@azure/storage-blob";
import { Storage } from "./azure-blob-storage";

jest.mock("@azure/storage-blob");

describe("Azure Blob Storage", () => {
    let storage: Storage;
    const logger = jest.fn();
    const mockBlobServiceClient = BlobServiceClient as jest.Mocked<typeof BlobServiceClient>;
    const mockBlobClient = {} as jest.Mocked<BlobClient>;
    const mockBlobString = '[{"id": "1", "name": "Blob 1"}]';
    const mockBlobData = JSON.parse(mockBlobString);

    beforeEach(() => {
        storage = new Storage(logger);
        logger.mockReset();
        mockBlobServiceClient.fromConnectionString.mockReturnValue({
            getContainerClient: jest.fn().mockReturnValue({
                getBlobClient: jest.fn().mockReturnValue(mockBlobClient),
            }),
        } as any);
        mockBlobClient.downloadToBuffer = jest.fn().mockResolvedValue(Buffer.from(mockBlobString));
    });

    describe("getServiceClient", () => {
        it('should return blob service client', () => {
            const result = (storage as any).getServiceClient('connectionString');
            expect(result).toBeDefined();
        });
        it('should throw error if param is empty', () => {
            expect(() => (storage as any).getServiceClient('')).toThrow('Connection string is required');
        });
    });

    describe("getBlobClient", () => {
        it('should return blob client', () => {
            const result = (storage as any).getBlobClient('connectionString', 'blobUrl');
            expect(result).toEqual(mockBlobClient);
        });
        it('should throw error if connection string is empty', () => {
            expect(() => (storage as any).getBlobClient('', 'blobUrl')).toThrow('Connection string is required');
        });
        it('should throw error if blob URL is empty', () => {
            expect(() => (storage as any).getBlobClient('connectionString', '')).toThrow('Blob URL is required');
        });
    });

    describe("parseUrl", () => {

        it('should parse URL correctly', () => {
            const result = (storage as any).parseUrl('https://account.blob.core.windows.net/container/blob');
            expect(result).toEqual({
                containerName: 'container',
                blobName: 'blob',
            });
        });
        it('should throw error if param is empty', () => {
            expect(() => (storage as any).parseUrl('')).toThrow('Blob URL is required');
        });
    })

    describe("bufferToString", () => {
        it('should convert buffer to string', () => {
            const result = (storage as any).bufferToString(Buffer.from('test'));
            expect(result).toEqual('test');
        });
        it('should throw error if param is empty', () => {
            expect(() => (storage as any).bufferToString(null)).toThrow('Buffer is required');
        });
    });
});