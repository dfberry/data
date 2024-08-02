import React from 'react';
import { GitHubPullRequest } from '@/lib/github/prs'; // Adjust the import path as necessary

interface PrCardProps {
    pr: GitHubPullRequest;
    componentOwner: string;
}

const PrCard: React.FC<PrCardProps> = ({ pr, componentOwner }) => {

    const repoUrlParts = pr.html_url.split('/');
    const orgOrUser = repoUrlParts[3];
    const repoName = repoUrlParts[4];
    console.log(`componentOwner: ${componentOwner}`);

    return (
        <article className="border rounded-lg p-4 shadow-md bg-white">
            <header className="mb-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-blue-600">
                        <a href={pr.html_url} target="_blank" rel="noopener noreferrer">
                            {pr.title}
                        </a>
                    </h2>
                    <p className="text-sm text-gray-500">#{pr.number} </p>
                </div>
                <div className="text-sm text-gray-500 text-right">
                    <p className="font-bold">{pr.state.toUpperCase()}</p>
                    {pr.state === 'open' && pr.assignee && (
                        <p>Assigned to: {pr.assignee.login}</p>
                    )}
                </div>
            </header>
            <section className="mb-4">
                <p className="text-gray-700">
                    {pr?.body ? pr.body.substring(0, 30) + '...' : '[NO BODY TEXT]'}
                </p>
            </section>
            <footer className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-2">
                    {pr.labels.map(label => (
                        <span
                            key={label.id}
                            className="px-2 py-1 text-xs font-semibold rounded"
                            style={{ backgroundColor: `#${label.color}`, color: '#fff' }}
                        >
                            {label.name}
                        </span>
                    ))}
                </div>
                <div className="text-sm text-gray-500 text-right flex flex-col space-y-2">
                    <div>
                        <h3 className="font-bold">Opened</h3>
                        <p>{new Date(pr.created_at).toLocaleDateString()}</p>
                        <p>{pr.user.login}</p>
                    </div>
                    <div>
                        <h3 className="font-bold">Updated</h3>
                        <p>{new Date(pr.updated_at).toLocaleDateString()}</p>
                        <p>{pr.assignee ? pr.assignee.login : 'N/A'}</p>
                    </div>
                </div>
            </footer>
            {componentOwner == undefined && <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    <a href={`https://github.com/${orgOrUser}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        {orgOrUser}
                    </a> /
                    <a href={`https://github.com/${orgOrUser}/${repoName}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                        {repoName}
                    </a>
                </p>
            </div>}
        </article>
    );
};

export default PrCard;