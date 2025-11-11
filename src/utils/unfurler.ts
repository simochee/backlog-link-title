import { backlogSpaces } from "./spaces";

export const unfurlIssue = async (el: HTMLAnchorElement) => {
	const url = new URL(el.href);
	const matches = url.pathname.match(/^\/view\/([A-Z0-9_]+-[0-9]+)/);
	if (!matches) return;

	const [, issueKey] = matches;

	const spaces = await backlogSpaces.getValue();
	const space = spaces.find(({ spaceDomain }) => spaceDomain === url.hostname);
	if (!space) return;

	const data = await fetch(
		`https://${space.spaceDomain}/api/v2/issues/${issueKey}?apiKey=${space.apiKey}`,
	).then((res) => res.json());

	el.textContent = `[${issueKey}] ${data.summary} | 課題 | Backlog`;
};

export const unfurlDocument = async (el: HTMLAnchorElement) => {
	const url = new URL(el.href);
	const matches = url.pathname.match(
		/^\/document\/([a-zA-Z0-9]+)\/([a-f0-9]{32})/,
	);
	if (!matches) return;

	const [, projectKey, documentId] = matches;

	const spaces = await backlogSpaces.getValue();
	const space = spaces.find(({ spaceDomain }) => spaceDomain === url.hostname);
	if (!space) return;

	const data = await fetch(
		`https://${space.spaceDomain}/api/v2/documents/${documentId}?apiKey=${space.apiKey}`,
	).then((res) => res.json());

	el.textContent = `[${projectKey}] ${data.title} | ドキュメント | Backlog`;
};

export const unfurlPullRequest = async (el: HTMLAnchorElement) => {
	const url = new URL(el.href);
	const matches = url.pathname.match(
		/^\/git\/([A-Z0-9_]+)\/([a-z0-9-]+)\/pullRequests\/([0-9]+)/,
	);
	if (!matches) return;

	const [, projectKey, repository, number] = matches;

	const spaces = await backlogSpaces.getValue();
	const space = spaces.find(({ spaceDomain }) => spaceDomain === url.hostname);
	if (!space) return;

	const data = await fetch(
		`https://${space.spaceDomain}/api/v2/projects/${projectKey}/git/repositories/${repository}/pullRequests/${number}?apiKey=${space.apiKey}`,
	).then((res) => res.json());

	el.textContent = `[${projectKey}/${repository}#${number}] ${data.summary} | プルリクエスト | Git | Backlog`;
};

export const unfurlWiki = async (el: HTMLAnchorElement) => {
	const url = new URL(el.href);
	const matches = url.pathname.match(/^\/alias\/wiki\/([0-9]+)/);
	if (!matches) return;

	const [, wikiId] = matches;

	const spaces = await backlogSpaces.getValue();
	const space = spaces.find(({ spaceDomain }) => spaceDomain === url.hostname);
	if (!space) return;

	const data = await fetch(
		`https://${space.spaceDomain}/api/v2/wikis/${wikiId}?apiKey=${space.apiKey}`,
	).then((res) => res.json());

	const project = await fetch(
		`https://${space.spaceDomain}/api/v2/projects/${data.projectId}?apiKey=${space.apiKey}`,
	).then((res) => res.json());

	el.textContent = `[${project.projectKey}] ${data.name} | Wiki | Backlog`;
};
