import { beforeEach, describe, expect, it, vi } from "vitest";
import { onMatchNode } from "./onMatchNode";

vi.mock("@/utils/spaces", () => ({
	backlogSpaces: {
		getValue: vi.fn().mockResolvedValue([
			{
				spaceDomain: "example.backlog.jp",
				apiKey: "test-api-key",
			},
			{
				spaceDomain: "example.backlog.com",
				apiKey: "test-api-key",
			},
		]),
	},
}));

describe("onMatchNode", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	const createAnchor = (href: string, textContent?: string) => {
		const anchor = document.createElement("a");
		anchor.href = href;
		anchor.textContent = textContent ?? href;
		return anchor;
	};

	const waitForMutation = () =>
		new Promise((resolve) => setTimeout(resolve, 0));

	describe("isMatchingElement", () => {
		it.each([
			["backlog.jp", "https://example.backlog.jp/view/TEST-123"],
			["backlog.com", "https://example.backlog.com/view/TEST-123"],
		])("should match valid %s links", async (_, href) => {
			const callback = vi.fn();
			const anchor = createAnchor(href);
			document.body.appendChild(anchor);

			await onMatchNode(callback);

			expect(callback).toHaveBeenCalledWith(anchor);
		});

		it.each([
			[
				"href and textContent differ",
				"https://example.backlog.jp/view/TEST-123",
				"Different text",
			],
			["non-backlog domains", "https://example.com/view/TEST-123", undefined],
		])("should not match when %s", async (_, href, textContent) => {
			const callback = vi.fn();
			const anchor = createAnchor(href, textContent);
			document.body.appendChild(anchor);

			await onMatchNode(callback);

			expect(callback).not.toHaveBeenCalled();
		});

		it("should not match links inside contenteditable elements", async () => {
			const callback = vi.fn();
			const div = document.createElement("div");
			div.contentEditable = "true";
			const anchor = createAnchor("https://example.backlog.jp/view/TEST-123");
			div.appendChild(anchor);
			document.body.appendChild(div);

			await onMatchNode(callback);

			expect(callback).not.toHaveBeenCalled();
		});
	});

	describe("MutationObserver", () => {
		it("should detect dynamically added matching elements", async () => {
			const callback = vi.fn();
			await onMatchNode(callback);

			const anchor = createAnchor("https://example.backlog.jp/view/TEST-123");
			document.body.appendChild(anchor);

			await waitForMutation();

			expect(callback).toHaveBeenCalledWith(anchor);
		});

		it("should detect matching anchors within added elements", async () => {
			const callback = vi.fn();
			await onMatchNode(callback);

			const div = document.createElement("div");
			const anchor = createAnchor("https://example.backlog.jp/view/TEST-123");
			div.appendChild(anchor);
			document.body.appendChild(div);

			await waitForMutation();

			expect(callback).toHaveBeenCalledWith(anchor);
		});
	});

	describe("cleanup", () => {
		it("should disconnect observer when cleanup function is called", async () => {
			const callback = vi.fn();
			const disconnect = await onMatchNode(callback);

			disconnect?.();

			const anchor = createAnchor("https://example.backlog.jp/view/TEST-123");
			document.body.appendChild(anchor);

			await waitForMutation();

			expect(callback).not.toHaveBeenCalled();
		});
	});
});
