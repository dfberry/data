export interface DateRange {
  start: string; // ISO 8601 date string
  end: string; // ISO 8601 date string
}

export interface FetchIssuesParams {
  repo: string;
  dateRange: DateRange;
  state?: "open" | "closed" | "all";
  labels?: string[];
  assignee?: string;
  creator?: string;
  mentioned?: string;
  sort?: "created" | "updated" | "comments";
  direction?: "asc" | "desc";
}

export interface GitHubIssue {
  id: number;
  node_id: string;
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  number: number;
  state: string;
  title: string;
  body: string;
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
  assignee: any;
  assignees: any[];
  milestone: any;
  locked: boolean;
  active_lock_reason: string;
  comments: number;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  closed_by?: {
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
}

export interface GitHubIssuesResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubIssue[];
}
//const url = `https://api.github.com/repos/${repo}/issues?created:${dateRange.start}..${dateRange.end}`;
/*

curl -H "Accept: application/vnd.github.v3+json" \
     -H "Authorization: token " \
     -H "Authorization: token <token>" \
     "https://api.github.com/repos/MicrosoftDocs/node-essentials/issues?created:2024-01-01T00:00:00Z..2024-12-31T23:59:59Z"

async function exampleUsage() {
    const params: FetchIssuesParams = {
        repo: 'octocat/Hello-World',
        dateRange: {
            start: '2023-01-01T00:00:00Z',
            end: '2023-12-31T23:59:59Z'
        },
        state: 'open',
        labels: ['bug', 'enhancement'],
        assignee: 'octocat',
        creator: 'octocat',
        mentioned: 'octocat',
        sort: 'created',
        direction: 'asc'
    };

    const accessToken = 'your_github_access_token_here';

    try {
        const issues = await GitHubRepoIssues.fetchIssues(params, accessToken);
        console.log(issues);
    } catch (error) {
        console.error('Error fetching issues:', error);
    }
}
    "https://api.github.com/repos/MicrosoftDocs/node-essentials/issues?created:2024-01-01T00:00:00Z..2024-12-31T23:59:59Z"


curl -H "Accept: application/vnd.github.v3+json" \ 
     -H "Authorization: token " \
     -H "Authorization: token <token>" \
     "https://api.github.com/repos/MicrosoftDocs/node-essentials/issues?created:2024-01-01T00:00:00Z..2024-12-31T23:59:59Z"

*/

export default class GitHubRepoIssues {
  static async fetchIssues(
    params: FetchIssuesParams,
    accessToken: string,
  ): Promise<GitHubIssue[]> {
    const {
      repo,
      dateRange /*, state, labels, assignee, creator, mentioned, sort, direction*/,
    } = params;
    const queryParams = new URLSearchParams();

    // if (state) queryParams.append('state', state);
    // if (labels) queryParams.append('labels', labels.join(','));
    // if (assignee) queryParams.append('assignee', assignee);
    // if (creator) queryParams.append('creator', creator);
    // if (mentioned) queryParams.append('mentioned', mentioned);
    // if (sort) queryParams.append('sort', sort);
    // if (direction) queryParams.append('direction', direction);

    const url = `https://api.github.com/repos/${repo}/issues?created:${dateRange.start}..${dateRange.end}`;

    console.log("GitHubRepoIssues.fetchIssues", { url, accessToken });

    const response = await fetch(url, {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      console.log("GitHubRepoIssues.fetchIssues", {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }

    const data: GitHubIssue[] = await response.json();
    //console.log('GitHubRepoIssues.fetchIssues', { data });
    return data;
  }
}
