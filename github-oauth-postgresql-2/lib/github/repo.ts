import GitHubServiceBase from "./base";

export interface GitHubRepoInfo {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    url: string;
  };
  private: boolean;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  open_issues_count: number;
  master_branch: string;
  default_branch: string;
  score: number;
}

export default class GitHubRepoService extends GitHubServiceBase {
  /*
curl -L \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/OWNER/REPO
*/

  static async repoInfo(
    accessToken: string,
    ownerRepo: string,
  ): Promise<GitHubRepoInfo[] | null> {
    try {
      if (!accessToken) {
        return Promise.reject(new Error("No access token"));
      }
      console.log(`GitHubRepoService.repoInfo: accessToken=${accessToken}`);
      console.log(`GitHubRepoService.repoInfo: ownerRepo=${ownerRepo}`);

      const url = `https://api.github.com/repos/${ownerRepo}`;
      console.log(`Querying GitHub Repo API: ${url}`);

      const data = await GitHubServiceBase.fetchFromGitHub(url, accessToken);
      return data;
    } catch (error) {
      console.error("Error fetching repo info:", error);
      return null;
    }
  }
}
