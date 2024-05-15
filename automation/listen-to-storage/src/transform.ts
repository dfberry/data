import { BlobData } from './models';

export function transformUploadedToDocs(blobDataArray: BlobData[], name: string) {

    try {

        let transformedDocs = [];

        // Get the inner docs to send to a different DB table
        for (const element of blobDataArray) {

            const total_count = element.results.total_count;

            console.log(`Num Data from blob: ${total_count}`);

            const innerDocs = element.results.items;

            for (const innerDoc of innerDocs) {

                const issuesDoc = {
                    type: name,
                    ...innerDoc,
                    id: innerDoc.id.toString() // why is this required
                }
                console.log(`Inner doc: ${innerDoc.id} - ${innerDoc.url}`);
                transformedDocs.push(issuesDoc);
            }
        }
        return transformedDocs;
    } catch (error) {
        console.log(`transformUploadedToDocs - Error transforming data: ${error}`);
    }
}
