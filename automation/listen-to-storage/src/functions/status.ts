import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { debugInfo } from "../debug";


export async function status(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        context.log(`Http function processed request for url "${request.url}"`);

        const secret = request.query.get('secret')

        if (secret === process.env.SECRET) {

            const info = await debugInfo(request, console.log)

            return { jsonBody: info };

        } else {
            return { status: 401 };

        }
    }
    catch (error) {
        context.log(`status - Error processing request: ${error}`);
        return { status: 500 };
    }

};

app.http('status', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: status
});
