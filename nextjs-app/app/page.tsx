import Image from "next/image";



export type GitHubIssue = {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  labels: Array<{
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
  }>;
  state: string;
  locked: boolean;
  assignee: null | {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  assignees: Array<{
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  }>;
  milestone: null | {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    number: number;
    state: string;
    title: string;
    description: string;
    creator: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    open_issues: number;
    closed_issues: number;
    created_at: string;
    updated_at: string;
    closed_at: string;
    due_on: string;
  };
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  active_lock_reason: string;
  body: string;
  performed_via_github_app: null | {
    id: number;
    node_id: string;
    owner: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    name: string;
    slug: string;
    external_url: string;
    html_url: string;
    created_at: string;
    updated_at: string;
  };
};

export type GitHubIssueSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
};

const MY_ACCOUNT = `dfberry`;
const BEGIN_DATE = `2024-05-01`;
const END_DATE = `2024-06-01`;
const MY_ISSUES = `https://api.github.com/search/issues?q=author:${MY_ACCOUNT}+created:${BEGIN_DATE}..${END_DATE}`;
const MY_ISSUES2 = `https://api.github.com/search/prs?q=author:${MY_ACCOUNT}+created:${BEGIN_DATE}..${END_DATE}`;

async function getData() {
  const res = await fetch(
    MY_ISSUES,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    }
  );
  return res.json();
}

function GitHubDataTable({ title, data }: { title: string; data: GitHubIssueSearchResponse }) {
  return (
    <>
      <h1 className="text-2xl font-semibold  mb-4">{title}</h1>
      <table className="min-w-full divide-y">
        <thead className="">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Issue #
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Repo Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              Date Created
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
              By Who
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y ">
          {data?.items.map((issue: GitHubIssue) => (
            <tr key={issue?.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">#{issue?.number}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                {issue?.repository_url.split('/').slice(-2).join('/')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">
                <a href={issue?.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {issue?.title}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{issue?.state}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{new Date(issue?.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm ">{issue?.user.login}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
  )
}

export default async function Home() {

  const myIssuesdata: GitHubIssueSearchResponse = await getData();
  console.log(myIssuesdata?.items);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <GitHubDataTable title={"My GitHub Issues"} data={myIssuesdata} />
    </main>
  );
}
