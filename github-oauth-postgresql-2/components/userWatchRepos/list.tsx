import NewRepoToWatchForm from './form'
import UserWatchRepoItemComponent from './item'

const RepoList = ({ repos }: any) => {

    console.log("RepoList:", repos);

    return (
        <>
            <NewRepoToWatchForm />
            <hr className="my-4" />
            <div>
                {repos.map((repo: any) => (
                    <UserWatchRepoItemComponent key={repo.url} item={repo} />
                ))}
            </div>
        </>
    )
}

export default RepoList