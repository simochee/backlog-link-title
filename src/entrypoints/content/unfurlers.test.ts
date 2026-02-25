import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockReplaceUrlInTextNodes, mockClient } = vi.hoisted(() => ({
	mockReplaceUrlInTextNodes: vi.fn(),
	mockClient: vi
		.fn()
		.mockResolvedValue({ name: "TestSpace", spaceKey: "test" }),
}));

vi.mock("./fetch", () => ({
	client: mockClient,
}));

vi.mock("./replaceUrlInTextNodes", () => ({
	replaceUrlInTextNodes: mockReplaceUrlInTextNodes,
}));

import {
	documentUnfurler,
	gitCommitUnfurler,
	gitFileUnfurler,
} from "./unfurlers";

const createAnchor = (href: string) => {
	const anchor = document.createElement("a");
	anchor.href = href;
	return anchor;
};

describe("documentUnfurler", () => {
	beforeEach(() => {
		mockReplaceUrlInTextNodes.mockClear();
		mockClient.mockReset();
		mockClient.mockImplementation((_hostname: string, path: string) => {
			if (path === "/api/v2/space") {
				return Promise.resolve({ name: "TestSpace", spaceKey: "test" });
			}
			if (path.startsWith("/api/v2/documents/")) {
				return Promise.resolve({
					projectId: 1,
					title: "Design Document",
				});
			}
			return Promise.resolve({});
		});
	});

	it("should build title for view URL", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/document/PROJ/abcdef01234567890abcdef012345678",
		);
		await documentUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).toHaveBeenCalledWith(
			anchor,
			"[TestSpace][PROJ] Design Document | Document",
		);
	});

	it("should build title with Edit prefix for edit URL", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/document/PROJ/e/abcdef01234567890abcdef012345678",
		);
		await documentUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).toHaveBeenCalledWith(
			anchor,
			"[TestSpace][PROJ] Edit Design Document | Document",
		);
	});
});

describe("gitFileUnfurler", () => {
	beforeEach(() => {
		mockReplaceUrlInTextNodes.mockClear();
		mockClient.mockReset();
		mockClient.mockResolvedValue({ name: "TestSpace", spaceKey: "test" });
	});

	it("should build title for blob URL with filename", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/git/NAKAMURA/hackz-nulab-26/blob/main/CLAUDE.md",
		);
		await gitFileUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).toHaveBeenCalledWith(
			anchor,
			"[TestSpace][NAKAMURA/hackz-nulab-26] CLAUDE.md | Git",
		);
	});

	it("should build title for tree URL", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/git/PROJ/my-repo/tree/main/src/components",
		);
		await gitFileUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).toHaveBeenCalledWith(
			anchor,
			"[TestSpace][PROJ/my-repo] components | Git",
		);
	});

	it("should handle nested file paths by showing only filename", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/git/NAKAMURA/hackz-nulab-26/blob/main/src/components/App.tsx",
		);
		await gitFileUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).toHaveBeenCalledWith(
			anchor,
			"[TestSpace][NAKAMURA/hackz-nulab-26] App.tsx | Git",
		);
	});

	it("should not match non-git URLs", async () => {
		const anchor = createAnchor("https://nulab.backlog.jp/view/TEST-123");
		await gitFileUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).not.toHaveBeenCalled();
	});

	it("should not match git URLs without blob or tree", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/git/PROJ/my-repo/commits",
		);
		await gitFileUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).not.toHaveBeenCalled();
	});
});

describe("gitCommitUnfurler", () => {
	beforeEach(() => {
		mockReplaceUrlInTextNodes.mockClear();
		mockClient.mockReset();
		mockClient.mockResolvedValue({ name: "TestSpace", spaceKey: "test" });
	});

	it("should build title with truncated commit hash", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/git/NAKAMURA/hackz-nulab-26/commit/d883cf51748ad8d4d864d1143657a10a27f73e17",
		);
		await gitCommitUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).toHaveBeenCalledWith(
			anchor,
			"[TestSpace][NAKAMURA/hackz-nulab-26] リビジョン : d883cf5174 | Git",
		);
	});

	it("should not match non-commit git URLs", async () => {
		const anchor = createAnchor(
			"https://nulab.backlog.jp/git/NAKAMURA/hackz-nulab-26/blob/main/CLAUDE.md",
		);
		await gitCommitUnfurler(anchor);
		expect(mockReplaceUrlInTextNodes).not.toHaveBeenCalled();
	});
});
