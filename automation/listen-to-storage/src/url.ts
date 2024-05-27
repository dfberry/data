export function fileNameToParts(fileName, logger = console.log) {

    try {
        if (!fileName) {
            logger('File name is required');
            return { date: undefined, name: undefined, numDays: undefined };
        }

        logger(`fileNameToParts - File name: ${fileName}`);

        const regex = /^(\d{8})_(.+)_(\d+)\.json$/;
        const match = fileName.match(regex);
        const date = match[1];
        const name = match[2];
        const numDays = parseInt(match[3]);

        console.log(`fileNameToParts - Date: ${date}, Name: ${name}, NumDays: ${numDays}`)

        return { date, name, numDays };
    } catch (error) {
        logger(`fileNameToParts - Error parsing file name: ${error}`);
    }
}