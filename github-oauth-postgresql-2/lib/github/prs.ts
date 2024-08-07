import GitHubServiceBase from "./base";

export interface GitHubPullRequest {
  id: number;
  node_id: string;
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  comments_url: string;
  statuses_url: string;
  number: number;
  state: string;
  locked: boolean;
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
  body: string;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  merge_commit_sha: string | null;
  assignee: {
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
  } | null;
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
  requested_reviewers: Array<{
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
  requested_teams: Array<{
    id: number;
    node_id: string;
    url: string;
    html_url: string;
    name: string;
    slug: string;
    description: string;
    privacy: string;
    permission: string;
    members_url: string;
    repositories_url: string;
    parent: string | null;
  }>;
  labels: Array<{
    id: number;
    node_id: string;
    url: string;
    name: string;
    description: string;
    color: string;
    default: boolean;
  }>;
  milestone: {
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
    closed_at: string | null;
    due_on: string | null;
  } | null;
  draft: boolean;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
}

export enum GitHubSearchDefaultQuery {
  REPO = "repo",
  AUTHOR = "author",
  ASSIGNEE = "assignee",
  MENTIONED = "mentioned",
  TEAM_REVIEW_REQUESTED = "team-review-requested",
  REVIEW_REQUESTED = "review-requested",
  STATE = "state",
  HEAD = "head",
  BASE = "base",
  LABEL = "label",
  MILESTONE = "milestone",
  SORT = "sort",
  ORDER = "order",
}
export type GitHubPrSearchParams = {
  [key in GitHubSearchDefaultQuery]?: string;
};

export default class GitHubPrsService extends GitHubServiceBase {
  static async queryPrs(
    accessToken: string,
    searchParams: { [key in GitHubSearchDefaultQuery]?: string },
  ): Promise<any[]> {
    if (!accessToken) {
      return Promise.reject(new Error("No access token"));
    }

    const query = Object.entries(searchParams)
      .map(([key, value]) => `${key}:${value}`)
      .join("+");

    console.log(`GitHubPrsService.queryPrs: query=${searchParams?.repo}`);

    const url = `https://api.github.com/repos/${searchParams.repo}/pulls`;
    console.log(`GitHubPrsService.queryPrs: url=${url}`);

    const data = await GitHubServiceBase.fetchFromGitHub(url, accessToken);
    return data;
  }
}
