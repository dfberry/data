import React, { Suspense } from 'react';
import { GitHubIssue } from '@/lib/github/issues'; // Adjust the import path as necessary

interface IssueCardProps {
    issue: GitHubIssue;
    showRepoNameEachRow: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, showRepoNameEachRow }) => {

    const repoUrlParts = issue.html_url.split('/');
    const orgOrUser = repoUrlParts[3];
    const repoName = repoUrlParts[4];
    console.log(`showRepoNameEachRow: ${showRepoNameEachRow}`);

    return (
        <article className="border rounded-lg p-4 shadow-md bg-white">
            <header className="mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-blue-600">
                        <a href={issue.html_url} target="_blank" rel="noopener noreferrer">
                            {issue.title}
                        </a>
                    </h2>
                    <p className="text-sm text-gray-500">#{issue.number} </p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                    <p className="font-bold">{issue.state.toUpperCase()}</p>
                    {issue.state === 'open' && issue.assignee && (
                        <p>Assigned to: {issue.assignee.login}</p>
                    )}
                </div>
            </header>
            <Suspense fallback={<div>Loading body...</div>}>
                <section className="mb-4">
                    <p className="text-gray-700">
                        {issue?.body ? issue.body.substring(0, 30) + '...' : '[NO BODY TEXT]'}
                    </p>
                </section>
            </Suspense>
            <footer className="flex flex-wrap items-center justify-between">
                <Suspense fallback={<div>Loading labels...</div>}>
                    <div className="flex items-center space-x-2">
                        {issue.labels.map(label => (
                            <span
                                key={label.id}
                                className="px-2 py-1 text-xs font-semibold rounded"
                                style={{ backgroundColor: `#${label.color}`, color: '#fff' }}
                            >
                                {label.name}
                            </span>
                        ))}
                    </div>
                </Suspense>
                <div className="text-sm text-gray-500 text-right flex flex-col space-y-2">
                    <div>
                        <h3 className="font-bold">Opened</h3>
                        <p>{new Date(issue.created_at).toLocaleDateString()}</p>
                        <p>{issue.user.login}</p>
                    </div>
                </div>
            </footer>
        </article>
    );
};

export default IssueCard;