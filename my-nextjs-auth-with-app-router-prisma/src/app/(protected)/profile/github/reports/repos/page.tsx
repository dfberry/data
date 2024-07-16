import RepoListReport from '@/components/GitHub/Reports/RepoListReport'
import { fetchUserRepos } from '@/lib/github/repos';

import db from '@/lib/db'

function getData(org: string) {

    return fetchUserRepos(org);

}

const RepoPage = async () => {

    const org = "dfberry";
    const data = await getData(org)
    const repos = data
        .filter(repo => repo.owner.login === org && !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    const currentDateTime = new Date().toLocaleString(); // Gets current date and time as a string


    return (
        <div>
            <RepoListReport repos={repos} title={org} />
        </div>
    )
}

export default RepoPage