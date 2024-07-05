import React, { useState, useEffect } from 'react';
// Import the fetchSearchIssues function
// Adjust the import path according to your project structure
import { fetchSearchIssues, GitHubIssue, GitHubIssueSearchResult, GitHubIssueResult, SearchResults } from '../lib/github/search-issue'

type GitHubIssuesDisplayProps = {
    user: string;
    data: SearchResults | {},
    debug?: boolean;
};

const GitHubSearchIssuesDisplay = ({ user, data, debug = false }: GitHubIssuesDisplayProps) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{user ?? '(unknown user)'} GitHub Issues</h2>
            {Object.keys(data).length > 0 ? (
                Object.entries(data).map(([category, issues]) => (
                    <div key={category}>
                        <h3 className="text-xl font-semibold my-2">{category}</h3>
                        <div>
                            {issues.map((issue: GitHubIssue) => (
                                <div key={issue.id} className="mb-2 flex flex-col md:flex-row justify-between items-center">
                                    <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                        {issue.title}
                                    </a>
                                    <div className="text-sm text-gray-600">
                                        Opened by <span className="font-semibold">{issue.user.login}</span> on {new Date(issue.created_at).toLocaleDateString()} | State: <span className="font-semibold">{issue.state}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Repo: <span className="font-semibold">{issue.repository_url}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600">No issues found.</p>
            )}
            {debug && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default GitHubSearchIssuesDisplay;