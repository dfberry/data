// http://localhost:3000/dfberry/data
const RepoPage = ({params}:any) => {
    return (
        <div>
            <h1>Dynamic User Page - User:{params.user}, Repo:{params.repo} </h1>
        </div>
    );
}

export default RepoPage;