import { GitHubDataAsStorageData } from './github';
import { Storage } from './azure-blob-storage';
import { BlobDataRepo, BlobDataItems } from './models';

jest.mock('./azure-blob-storage');

describe('GitHubDataAsStorageData', () => {
    let gitHubDataAsStorageData;
    let logger;
    let mockBlobClient;
    let mockBuffer;
    let mockStorage;

    beforeEach(() => {
        logger = jest.fn();
        gitHubDataAsStorageData = new GitHubDataAsStorageData(logger);

        mockBlobClient = {};
        mockBuffer = Buffer.from(JSON.stringify([{ repo: 'test' }]));
        mockStorage = {
            getBlobClient: jest.fn().mockReturnValue(mockBlobClient),
            getBlobBuffer: jest.fn().mockResolvedValue(mockBuffer),
            bufferToString: jest.fn().mockReturnValue(mockBuffer.toString()),
        };

        (Storage as jest.Mock).mockReturnValue(mockStorage);
    });

    describe('getFileData', () => {
        it('should get file data', async () => {
            const blobUrl = 'blobUrl';
            const connectionString = 'connectionString';
            const data = await gitHubDataAsStorageData.getFileData(blobUrl, connectionString);
            expect(data).toEqual([{ repo: 'test' }]);
            expect(mockStorage.getBlobClient).toHaveBeenCalledWith(connectionString, blobUrl);
            expect(mockStorage.getBlobBuffer).toHaveBeenCalledWith(blobUrl, mockBlobClient);
            expect(mockStorage.bufferToString).toHaveBeenCalledWith(mockBuffer);
        });

        it('should throw error for empty blobUrl', async () => {
            const blobUrl = '';
            const connectionString = 'connectionString';
            await expect(gitHubDataAsStorageData.getFileData(blobUrl, connectionString)).rejects.toThrow('Invalid blobUrl');
        });

        it('should throw error for empty connectionString', async () => {
            const blobUrl = 'blobUrl';
            const connectionString = '';
            await expect(gitHubDataAsStorageData.getFileData(blobUrl, connectionString)).rejects.toThrow('Invalid connectionString');
        });

        it('should throw error for invalid JSON', async () => {
            const blobUrl = 'blobUrl';
            const connectionString = 'connectionString';
            mockStorage.bufferToString.mockReturnValue('{invalid json}');
            await expect(gitHubDataAsStorageData.getFileData(blobUrl, connectionString)).rejects.toThrow('Invalid JSON');
        });
    });
    describe('stringToJson', () => {
        it('should return BlobDataRepo array for valid BlobDataRepo JSON string', () => {
            const json = '[{"repo": "test"}]';
            const result = (gitHubDataAsStorageData as any).stringToJson(json);
            expect(result).toEqual([{ repo: 'test' }]);
        });

        it('should return BlobDataItems array for valid BlobDataItems JSON string', () => {
            const json = '[{"results": {"items": [{"id": 1, "url": "test"}]}}]';
            const result = (gitHubDataAsStorageData as any).stringToJson(json);
            expect(result).toEqual([{ results: { items: [{ id: 1, url: 'test' }] } }]);
        });

        it('should return empty array for empty string', () => {
            const json = '';
            const result = (gitHubDataAsStorageData as any).stringToJson(json);
            expect(result).toEqual([]);
        });
    });

    describe('parseJson', () => {
        it('should return parsed JSON for valid JSON string', () => {
            const json = '{"key": "value"}';
            const result = (gitHubDataAsStorageData as any).parseJson(json);
            expect(result).toEqual({ key: 'value' });
        });

        it('should return undefined for empty string', () => {
            const json = '';
            const result = (gitHubDataAsStorageData as any).parseJson(json);
            expect(result).toBeUndefined();
        });

        it('should return undefined for undefined', () => {
            const json = undefined;
            const result = (gitHubDataAsStorageData as any).parseJson(json);
            expect(result).toBeUndefined();
        });

        it('should throw error for invalid JSON', () => {
            const json = '{invalid json}';
            expect(() => (gitHubDataAsStorageData as any).parseJson(json)).toThrow('Invalid JSON');
        });
    });
});