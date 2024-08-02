import { SessionResult } from "../auth/auth";
import { getDbTokenByDbUserId } from "@/lib/db/db";
export interface GitHubUser {
    id: string;
    login: string;
    github_id: string; // TBD - I don't this is returned
    avatar_url: string;
}

export interface GitHubUser2 {
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
    name: string;
    company: string;
    blog: string;
    location: string;
    email: string;
    hireable: boolean;
    bio: string;
    twitter_username: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
}

export default class GitHubUserService {

    static async getGithHubUserByUnencryptedAccessToken(unencryptedAccessToken: string): Promise<GitHubUser> {
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${unencryptedAccessToken}`
            }
        });
        const githubUser: GitHubUser = await githubUserResponse.json();
        console.log(`getGithHubUserByUnencryptedAccessToken: ${JSON.stringify(githubUser)}`);
        return githubUser;
    }
    static async getGithHubUserBySessionResult(sessionResult: SessionResult): Promise<any> {

        console.log(`getGithHubUserBySessionResult sessionResult: ${JSON.stringify(sessionResult)}`);
        if (!sessionResult || !sessionResult.session?.userId) throw new Error("getGithHubUserBySessionResult: Invalid arguments");

        const accessToken = await getDbTokenByDbUserId(sessionResult.session.userId);
        console.log(`getGithHubUserBySessionResult decrypted accessToken: ${accessToken}`);
        if (!accessToken) throw new Error("getGithHubUserBySessionResult: No access token found");

        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const githubUser = await githubUserResponse.json();

        console.log(`getGithHubUserBySessionResult: ${JSON.stringify(githubUser)}`);

        return githubUser;
    }
}