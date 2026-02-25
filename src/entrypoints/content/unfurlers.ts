import { regex } from "arkregex";
import { joinURL } from "ufo";
import type {
	BacklogDocument,
	BacklogIssue,
	BacklogIssueComment,
	BacklogProject,
	BacklogPullRequest,
	BacklogWiki,
} from "./backlog";
import { defineUnfurler } from "./defineUnfurler";
import { client } from "./fetch";

const ISSUE_KEY_REGEX = "(?<issueKey>[A-Z0-9_]+-[0-9]+)" as const;
const WIKI_ID_REGEX = "(?<wikiId>[0-9]+)" as const;
const WIKI_TITLE_REGEX = "(?<wikiTitle>[^/]+)" as const;
const WIKI_DIFF_REGEX =
	"(?<wikiDiffFrom>[0-9]+)\\.\\.\\.(?<wikiDiffTo>[0-9]+)" as const;
const DOCUMENT_ID_REGEX = "(?<documentId>[a-f0-9]{32})" as const;
const PROJECT_KEY_REGEX = "(?<projectKey>[A-Z0-9_]+)" as const;
const REPOSITORY_REGEX = "(?<repository>[a-z0-9-]+)" as const;
const PULL_REQUEST_NUMBER_REGEX = "(?<number>[0-9]+)" as const;
const GIT_FILE_PATH_REGEX = "(?<filePath>.+)" as const;
const GIT_COMMIT_HASH_REGEX = "(?<commitHash>[a-f0-9]+)" as const;

export const issueUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/view/${ISSUE_KEY_REGEX}$`).exec(url.pathname)?.groups,
	buildTitle: async (params, url) => {
		const promises = [
			client<BacklogIssue>(
				url.hostname,
				joinURL("/api/v2/issues", params.issueKey),
			),
		] as const;

		if (url.hash.startsWith("#comment-")) {
			const [issue, issueComment] = await Promise.all([
				...promises,
				client<BacklogIssueComment>(
					url.hostname,
					joinURL(
						"/api/v2/issues",
						params.issueKey,
						"comments",
						url.hash.slice(9),
					),
				),
			]);

			return `[${params.issueKey}][${issue.status.name}] ${issue.summary} | Comment by ${issueComment.createdUser.name}`;
		}
		const [issue] = await Promise.all(promises);

		return `[${params.issueKey}][${issue.status.name}] ${issue.summary} | Issue`;
	},
});

export const wikiUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/alias/wiki/${WIKI_ID_REGEX}$`).exec(url.pathname)?.groups,
	buildTitle: async (params, url) => {
		const wiki = await client<BacklogWiki>(
			url.hostname,
			joinURL("/api/v2/wikis", params.wikiId),
		);
		const project = await client<BacklogProject>(
			url.hostname,
			joinURL("/api/v2/projects", String(wiki.projectId)),
		);
		return `[${project.projectKey}] ${wiki.name} | Wiki`;
	},
});

export const wikiWithTitleUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(
			`^/wiki/${PROJECT_KEY_REGEX}/${WIKI_TITLE_REGEX}(?:/diff/${WIKI_DIFF_REGEX})?$`,
		).exec(url.pathname)?.groups,
	buildTitle: (params) => {
		let title = `[${params.projectKey}] ${decodeURIComponent(params.wikiTitle)}`;

		if (params.wikiDiffTo && params.wikiDiffFrom) {
			title += ` (Comparison between version ${params.wikiDiffFrom} and version ${params.wikiDiffTo})`;
		}

		return `${title} | Wiki`;
	},
});

export const documentUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(
			`^/document/${PROJECT_KEY_REGEX}/(?<edit>e/)?${DOCUMENT_ID_REGEX}$`,
		).exec(url.pathname)?.groups,
	buildTitle: async (params, url) => {
		const document = await client<BacklogDocument>(
			url.hostname,
			joinURL("/api/v2/documents", params.documentId),
		);
		const prefix = params.edit ? "Edit " : "";
		return `[${params.projectKey}] ${prefix}${document.title} | Document`;
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
			joinURL(
				"/api/v2/projects",
				params.projectKey,
				"git/repositories",
				params.repository,
				"pullRequests",
				params.number,
			),
		);

		return `[${params.projectKey}/${params.repository}#${params.number}][${pullRequest.status.name}] ${pullRequest.summary} | Pull Request`;
	},
});

export const gitFileUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(
			`^/git/${PROJECT_KEY_REGEX}/${REPOSITORY_REGEX}/(?:blob|tree)/${GIT_FILE_PATH_REGEX}$`,
		).exec(url.pathname)?.groups,
	buildTitle: (params) => {
		const fileName = params.filePath.split("/").pop();
		return `[${params.projectKey}/${params.repository}] ${fileName} | Git`;
	},
});

export const gitCommitUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(
			`^/git/${PROJECT_KEY_REGEX}/${REPOSITORY_REGEX}/commit/${GIT_COMMIT_HASH_REGEX}$`,
		).exec(url.pathname)?.groups,
	buildTitle: (params) => {
		return `[${params.projectKey}/${params.repository}] リビジョン : ${params.commitHash.slice(0, 10)} | Git`;
	},
});
