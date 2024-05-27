import { blob } from 'stream/consumers';
import { BlobDataItems, BlobDataRepo, GitHubIssue, TransformedData } from './models';

// Regardless of type, find the GitHubIssue[], and transform it
export function transformUploadedToDocs(blobDataArray: BlobDataRepo[] | BlobDataItems[], name: string, logger): TransformedData[] {

    try {

        let transformedDocs = [];

        for (const element of blobDataArray) {
            let innerDocs: GitHubIssue[];

            innerDocs = isBlobDataItems(element) ? element.results.items : element.results;

            if (!innerDocs || innerDocs.length === 0) {
                logger(`No inner docs found for ${element.url}`);
                continue;
            }

            for (const innerDoc of innerDocs) {
                const issuesDoc = {
                    type: name,
                    ...innerDoc,
                    id: innerDoc.id.toString()
                }
                logger(`Inner doc: ${innerDoc.id} - ${innerDoc.url}`);
                transformedDocs.push(issuesDoc);
            }
        }
        return transformedDocs;
    } catch (error) {
        logger(`transformUploadedToDocs - Error transforming data: ${error}`);
        throw error;
    }
}
function isBlobDataItems(element: BlobDataRepo | BlobDataItems): element is BlobDataItems {
    return 'items' in element.results;
}