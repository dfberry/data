export function fileNameToParts(fileName) {
    const regex = /^(\d{8})_(.+)_(\d+)\.json$/;
    const match = fileName.match(regex);
    const date = match[1];
    const name = match[2];
    const numDays = parseInt(match[3]);

    console.log(`fileNameToParts - Date: ${date}, Name: ${name}, NumDays: ${numDays}`)

    return { date, name, numDays };

}