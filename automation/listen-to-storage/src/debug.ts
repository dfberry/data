import { HttpRequest } from "@azure/functions";

export async function debugInfo(request: HttpRequest, logger) {
    try {

        const env = process.env;
        const headers = request.headers;

        const info = {
            env,
            headers
        };

        logger(`debugInfo - Info: ${JSON.stringify(info)}`);

        return info;

    } catch (error) {
        logger(`debugInfo - Error: ${error}`);
    }
}