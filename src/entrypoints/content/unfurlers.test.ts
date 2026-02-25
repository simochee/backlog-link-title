import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockReplaceUrlInTextNodes } = vi.hoisted(() => ({
	mockReplaceUrlInTextNodes: vi.fn(),
}));

vi.mock("./fetch", () => ({
	client: vi.fn().mockResolvedValue({ name: "TestSpace", spaceKey: "test" }),
}));

vi.mock("./replaceUrlInTextNodes", () => ({
	replaceUrlInTextNodes: mockReplaceUrlInTextNodes,
}));

import { gitCommitUnfurler, gitFileUnfurler } from "./unfurlers";

describe("gitFileUnfurler", () => {
	beforeEach(() => {
		mockReplaceUrlInTextNodes.mockClear();
	});

	const createAnchor = (href: string) => {
		const anchor = document.createElement("a");
		anchor.href = href;
		return anchor;
	};

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
	});

	const createAnchor = (href: string) => {
		const anchor = document.createElement("a");
		anchor.href = href;
		return anchor;
	};

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
