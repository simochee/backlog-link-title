/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-space/ */
export type BacklogSpace = {
	name: string;
	spaceKey: string;
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-project/ */
export type BacklogProject = {
	projectKey: string;
	name: string;
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-issue/ */
export type BacklogIssue = {
	summary: string;
	status: {
		name: string;
	};
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-comment/ */
export type BacklogIssueComment = {
	createdUser: {
		name: string;
	};
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-wiki-page/ */
export type BacklogWiki = {
	projectId: number;
	name: string;
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-document/ */
export type BacklogDocument = {
	projectId: number;
	title: string;
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-git-repository/ */
export type BacklogGitRepository = {
	name: string;
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/get-pull-request/ */
export type BacklogPullRequest = {
	summary: string;
	base: string;
	branch: string;
	status: {
		name: string;
	};
};

/** @see https://developer.nulab.com/ja/docs/backlog/api/2/update-pull-request-comment-information/ */
export type BacklogPullRequestComment = {
	createdUser: {
		name: string;
	};
};
