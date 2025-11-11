import { regex } from "arkregex";
import type {
	BacklogDocument,
	BacklogIssue,
	BacklogIssueComment,
	BacklogPullRequest,
	BacklogWiki,
} from "./backlog";
import { defineUnfurler } from "./defineUnfurler";
import { client } from "./fetch";

const ISSUE_KEY_REGEX = "(?<issueKey>[A-Z0-9_]+-[0-9]+)" as const;
const WIKI_ID_REGEX = "(?<wikiId>[0-9]+)" as const;
const DOCUMENT_ID_REGEX = "(?<documentId>[a-f0-9]{32})" as const;
const PROJECT_KEY_REGEX = "(?<projectKey>[A-Z0-9_]+)" as const;
const REPOSITORY_REGEX = "(?<repository>[a-z0-9-]+)" as const;
const PULL_REQUEST_NUMBER_REGEX = "(?<number>[0-9]+)" as const;

export const issueUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/view/${ISSUE_KEY_REGEX}$`).exec(url.pathname)?.groups,
	buildTitle: async (params, url) => {
		if (url.hash.startsWith("#comment-")) {
			const [issue, issueComment] = await Promise.all([
				client<BacklogIssue>(url.hostname, `/api/v2/issues/${params.issueKey}`),
				client<BacklogIssueComment>(
					url.hostname,
					`/api/v2/issues/${params.issueKey}/comments/${url.hash.slice(9)}`,
				),
			]);

			return `Comment on ${issue.summary} by ${issueComment.createdUser.name}`;
		}
		const issue = await client<BacklogIssue>(
			url.hostname,
			`/api/v2/issues/${params.issueKey}`,
		);

		return `Issue: ${issue.summary} [${issue.status.name}]`;
	},
});

export const wikiUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/alias/wiki/${WIKI_ID_REGEX}$`).exec(url.pathname)?.groups,
	buildTitle: async (params, url) => {
		const wiki = await client<BacklogWiki>(
			url.hostname,
			`/api/v2/wikis/${params.wikiId}`,
		);
		return `Wiki: ${wiki.name}`;
	},
});

export const documentUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/document/${PROJECT_KEY_REGEX}/${DOCUMENT_ID_REGEX}$`).exec(
			url.pathname,
		)?.groups,
	buildTitle: async (params, url) => {
		const document = await client<BacklogDocument>(
			url.hostname,
			`/api/v2/documents/${params.documentId}`,
		);
		return `Document: ${document.title}`;
	},
});

export const pullRequestUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(
			`^/git/${PROJECT_KEY_REGEX}/${REPOSITORY_REGEX}/pullRequests/${PULL_REQUEST_NUMBER_REGEX}$`,
		).exec(url.pathname)?.groups,
	buildTitle: async (params, url) => {
		if (url.hash.startsWith("#comment-")) {
			return;
		}

		const pullRequest = await client<BacklogPullRequest>(
			url.hostname,
			`/api/v2/projects/${params.projectKey}/git/repositories/${params.repository}/pullRequests/${params.number}`,
		);

		return `Pull Request: ${pullRequest.summary} [${pullRequest.status.name}]`;
	},
});
