export enum GitHubSearchDefaultQuery {
    MENTIONS = "mentions",
    AUTHOR = "author",
    ASSIGNED = "assigned",
    ASSIGNEE = "assignee",
    COMMENTER = "commenter",
    INVOLVES = "involves",
    LABEL = "label",
    LANGUAGE = "language",
    IS = "is",
    STATE = "state",
    CREATED = "created",
    UPDATED = "updated",
    MERGED = "merged",
    STATUS = "status",
    HEAD = "head",
    BASE = "base",
    TYPE = "type"
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

interface GitHubIssuesResponse {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubIssue[];
}
export default class GitHubIssuesService {

    static async queryIssues(
        accessToken: string,
        searchParams: { [key in GitHubSearchDefaultQuery]?: string }
    ): Promise<GitHubIssuesResponse> {
        const query = Object.entries(searchParams)
            .map(([key, value]) => `${key}:${value}`)
            .join('+');

        const response = await fetch(`https://api.github.com/search/issues?q=${query}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.statusText}`);
        }

        const data: GitHubIssuesResponse = await response.json();
        return data;
    }
}