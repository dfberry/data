export const dynamic = 'force-dynamic' // defaults to auto

// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
export async function GET(request: Request) {
    return Response.json({ status: "success" })
}
