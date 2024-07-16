import React from 'react'
import { GitHubRepo } from "@/lib/github/repos"


type Props = {
    repos: GitHubRepo[];
    title: string;
};

const RepoListReport: React.FC<Props> = ({ repos, title }) => {
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-center my-4">{title} ({repos.length})</h1>
            {repos.map((repo) => (
                <div key={repo.id} className="border p-4 rounded-lg m-2 shadow-lg">
                    <h2 className="text-xl font-bold">{repo.name}</h2>
                    <p className="text-gray-600">{repo.description || 'No description'}</p>
                    <div className="flex justify-between items-center mt-4">
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            View Repository
                        </a>
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-gray-700" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zm-1 2a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                            {repo.language || 'Unknown'}
                        </span>
                        <div className="text-sm text-gray-500">
                            Owner: {repo.owner.login}
                        </div>
                        <div className="text-sm text-gray-500">
                            Updated: {new Date(repo.updated_at).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RepoListReport;