import { Suspense } from 'react';
import NewRepoToWatchForm from './form'
import UserWatchRepoItemComponent from './item'

type Props = {
    user: any;
    session: any;
    repos: any[];
    enableDelete: boolean;
    enableReportLink: boolean;
    enableCreate: boolean;
}

const WatchedReposListComponent = ({ repos, enableDelete, enableReportLink, enableCreate }: Props) => {

    console.log("WatchedReposListComponent:", enableDelete);

    return (
        <>
            <Suspense fallback={<p>Loading data...</p>}>
                {enableCreate && <NewRepoToWatchForm />}
                <hr className="my-4" />
                <div>
                    {repos.map((repo: any) => (
                        <UserWatchRepoItemComponent key={repo.url} item={repo} enableDelete={enableDelete} enableReportLink={enableReportLink} />
                    ))}
                </div>
            </Suspense>
        </>
    )
}

export default WatchedReposListComponent