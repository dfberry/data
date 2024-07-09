import Image from "next/image";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { GitHubRepo, GitHubReposResponse, fetchUserRepos } from "../../lib/github/repos";
import { fetchSearchIssues } from "../../lib/github/search-issue";
import RepoList from "@/components/GitHubRepo";
import GitHubSearchIssuesDisplay from "@/components/GitHubSearchIssues"


const ProfilePage = async () => {
  console.log("ProfilePage");
  const session = await getServerSession(options);
  console.log("Session:", JSON.stringify(session, null, 2));
  //const org = "dfberry";
  //let repos = [];
  //repos = (session?.accessToken) ? await fetchUserRepos(org, session?.accessToken) : [];
  //repos = repos.filter(repo => repo.owner.login === org && !repo.fork);

  // let issues = {};
  // if (session?.accessToken) {
  //   issues = await fetchSearchIssues(org, session?.accessToken);
  // }

  /*

<RepoList repos={repos} title={"User repos"} />
        <GitHubSearchIssuesDisplay user={org} data={issues} debug={false} />

  */

  return (
    <div>
      <h1>ProfilePage</h1>

      <div>
        {session?.user?.name ? <h2>Hello {session.user.name}!</h2> : null}

        {session?.user?.image ? (
          <Image
            src={session.user.image}
            width={200}
            height={200}
            alt={`Profile Pic for ${session.user.name}`}
            priority={true}
          />
        ) : null}
        {JSON.stringify(session, null, 2)}
      </div>
    </div>
  );
};

export default ProfilePage;
