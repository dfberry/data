
import { fetchUserRepos, GitHubReposResponse } from '../../lib/github/repos';
import RepoList from '../../components/GitHubRepo';

export default async function GitHubStaticData() {
    const org = "dfberry";
    const data = await getData(org)
    const repos = data
        .filter(repo => repo.owner.login === org && !repo.fork)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

    const currentDateTime = new Date().toLocaleString(); // Gets current date and time as a string

    return (
        <div>
            <h1>GitHubStaticData</h1>
            <div className="p-4 bg-gray-200 text-gray-800 font-semibold rounded-lg">
                {currentDateTime}
            </div>
            <RepoList repos={data} title={"User repos"} />
        </div>
    );
}
function getData(org: string) {

    return fetchUserRepos(org);


}