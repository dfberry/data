export type ProcessingDocument = {
    id: string;
    url: string;
    name: string;
    properties: any;
    path: string;
    length: number;
    processed: boolean;
    dateProcessed: string | null;
    dateUploaded: string;
}


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

export type BlobDataRepo = {
    dateRange: {
        start: string;
        end: string;
    },
    url: string;
    author?: string; // my history
    repo?: string; // repos
    user?: string; // my requested involvement
    results: GitHubIssue[];
}
export type BlobDataItems = {
    dateRange: {
        start: string;
        end: string;
    },
    url: string;
    author?: string; // my history
    user?: string; // my requested involvement
    results: GitHubIssueSearchResponse;
}

export type TransformedData = {
    id: string;
    type: string;
} & GitHubIssue;
