export type DateRange = {
  start: {
    date: Date;
    iso: string;
    string: string;
  };
  end: {
    date: Date;
    iso: string;
    string: string;
  };
};

export type GitHubAuthorData = {
  date_created: string;
  type: string;
  id: number;
  title: string;
  url: string;
};

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
  assignee: string;
  assignees: string[];
  milestone: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string;
  author_association: string;
  active_lock_reason: string;
  body: string;
  performed_via_github_app: null | string;
};

export type GitHubIssueSearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
};
