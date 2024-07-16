import IssueSearchReport from '@/components/GitHub/Reports/IssueSearchReport'
import { fetchSearchIssues } from '@/lib/github/search-issue'
import { getServerSession } from "next-auth";
import { options } from "@/auth/config";

const getData = async (user: string, token: string) => {

    const issues = await fetchSearchIssues(user, token);
    return issues
}

const RepoPage = async () => {

    const session = await getServerSession(options);
    const data = await getData(session?.login as string, session?.accessToken as string)

    return (
        <div>
            <IssueSearchReport data={data} user={session?.login as string} />
        </div>
    )
}

export default RepoPage