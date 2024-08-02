export default class GitHubServiceBase {
    protected static async fetchFromGitHub(url: string, accessToken: string): Promise<any> {
        const response = await fetch(url, {
            headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            console.error(`GitHub API request failed: ${response.statusText}`);
            throw new Error(`GitHub API request failed: ${response.statusText}`);
        }

        return response.json();
    }
}