import { regex } from "arkregex";
import { defineUnfurler } from "./defineUnfurler";

const ISSUE_KEY_REGEX = "(?<issueKey>[A-Z0-9_]+-[0-9]+)" as const;
const WIKI_ID_REGEX = "(?<wikiId>[0-9]+)" as const;
const DOCUMENT_ID_REGEX = "(?<documentId>[a-f0-9]{32})" as const;
const PROJECT_KEY_REGEX = "(?<projectKey>[A-Z0-9_]+)" as const;
const REPOSITORY_REGEX = "(?<repository>[a-z0-9-]+)" as const;
const PULL_REQUEST_NUMBER_REGEX = "(?<number>[0-9]+)" as const;

export const issueUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/view/${ISSUE_KEY_REGEX}$`).exec(url.pathname)?.groups,
	buildTitle: (params) => `Issue: ${params.issueKey}`,
});

export const wikiUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/alias/wiki/${WIKI_ID_REGEX}$`).exec(url.pathname)?.groups,
	buildTitle: (params) => `Wiki: ${params.wikiId}`,
});

export const documentUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(`^/document/${PROJECT_KEY_REGEX}/${DOCUMENT_ID_REGEX}$`).exec(
			url.pathname,
		)?.groups,
	buildTitle: (params) => `Document: ${params.documentId}`,
});

export const pullRequestUnfurler = defineUnfurler({
	parseUrl: (url) =>
		regex(
			`^/git/${PROJECT_KEY_REGEX}/${REPOSITORY_REGEX}/pullRequests/${PULL_REQUEST_NUMBER_REGEX}$`,
		).exec(url.pathname)?.groups,
	buildTitle: (params) =>
		`Pull Request: ${params.projectKey}/${params.repository}#${params.number}`,
});
