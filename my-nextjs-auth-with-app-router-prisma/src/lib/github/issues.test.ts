import { sortAndGroupIssues } from './issues';

describe('sortAndGroupIssues', () => {
    const testCases = [
        {
            description: 'correctly sorts and groups issues from different repositories',
            input: [
                { id: 1, repository_url: 'https://example.com/repo2', title: 'Issue 1 in repo2' },
                { id: 2, repository_url: 'https://example.com/repo1', title: 'Issue 1 in repo1' },
                { id: 3, repository_url: 'https://example.com/repo1', title: 'Issue 2 in repo1' },
            ],
            expected: {
                'https://example.com/repo1': [
                    { id: 2, repository_url: 'https://example.com/repo1', title: 'Issue 1 in repo1' },
                    { id: 3, repository_url: 'https://example.com/repo1', title: 'Issue 2 in repo1' },
                ],
                'https://example.com/repo2': [
                    { id: 1, repository_url: 'https://example.com/repo2', title: 'Issue 1 in repo2' },
                ],
            },
        },
        {
            description: 'handles issues from a single repository',
            input: [
                { id: 1, repository_url: 'https://example.com/repo1', title: 'Issue 1 in repo1' },
                { id: 2, repository_url: 'https://example.com/repo1', title: 'Issue 2 in repo1' },
            ],
            expected: {
                'https://example.com/repo1': [
                    { id: 1, repository_url: 'https://example.com/repo1', title: 'Issue 1 in repo1' },
                    { id: 2, repository_url: 'https://example.com/repo1', title: 'Issue 2 in repo1' },
                ],
            },
        },
        {
            description: 'handles an empty array gracefully',
            input: [],
            expected: {},
        },
        {
            description: 'handles issues missing the repository_url property',
            input: [
                { id: 1, title: 'Issue 1 with no repo URL' },
                { id: 2, repository_url: 'https://example.com/repo1', title: 'Issue 1 in repo1' },
            ],
            expected: {
                'undefined': [{ id: 1, title: 'Issue 1 with no repo URL' }],
                'https://example.com/repo1': [{ id: 2, repository_url: 'https://example.com/repo1', title: 'Issue 1 in repo1' }],
            },
        },
    ];

    testCases.forEach(({ description, input, expected }) => {
        it(description, () => {
            expect(sortAndGroupIssues(input)).toEqual(expected);
        });
    });
});