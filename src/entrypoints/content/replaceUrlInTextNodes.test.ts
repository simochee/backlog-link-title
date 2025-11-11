import { beforeEach, describe, expect, it } from "vitest";
import { replaceUrlInTextNodes } from "./replaceUrlInTextNodes";

describe("replaceUrlInTextNodes", () => {
	beforeEach(() => {
		document.body.innerHTML = "";
	});

	it("should replace URL text in direct text node", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";
		const textNode = document.createTextNode(
			"https://example.backlog.jp/view/TEST-123",
		);
		anchor.appendChild(textNode);

		replaceUrlInTextNodes(anchor, "Replaced Text");

		expect(anchor.textContent).toBe("Replaced Text");
		expect(anchor.childNodes.length).toBe(1);
	});

	it("should replace URL text inside span element", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";
		const span = document.createElement("span");
		span.textContent = "https://example.backlog.jp/view/TEST-123";
		anchor.appendChild(span);

		replaceUrlInTextNodes(anchor, "Replaced Text");

		expect(anchor.querySelector("span")).toBe(span);
		expect(span.textContent).toBe("Replaced Text");
	});

	it("should preserve img element while replacing text nodes", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";

		const img = document.createElement("img");
		img.src = "icon.png";
		anchor.appendChild(img);

		const textNode = document.createTextNode(
			"https://example.backlog.jp/view/TEST-123",
		);
		anchor.appendChild(textNode);

		replaceUrlInTextNodes(anchor, "Replaced Text");

		expect(anchor.querySelector("img")).toBe(img);
		expect(anchor.textContent).toBe("Replaced Text");
	});

	it("should handle multiple nested elements with text nodes", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";

		const img = document.createElement("img");
		img.src = "icon.png";
		anchor.appendChild(img);

		const textNode1 = document.createTextNode(
			"https://example.backlog.jp/view/TEST-123",
		);
		anchor.appendChild(textNode1);

		const span = document.createElement("span");
		span.textContent = " extra text";
		anchor.appendChild(span);

		replaceUrlInTextNodes(anchor, "New Text");

		expect(anchor.querySelector("img")).toBe(img);
		expect(anchor.querySelector("span")).toBe(span);
		expect(anchor.textContent).toContain("New Text");
		expect(anchor.textContent).toContain("extra text");
	});

	it("should replace partial URL match in text node", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";

		const textNode = document.createTextNode(
			"Check this: https://example.backlog.jp/view/TEST-123 link",
		);
		anchor.appendChild(textNode);

		replaceUrlInTextNodes(anchor, "Replaced");

		expect(anchor.textContent).toBe("Check this: Replaced link");
	});

	it("should handle text node with no URL match", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";

		const textNode = document.createTextNode("Some other text");
		anchor.appendChild(textNode);

		replaceUrlInTextNodes(anchor, "Replaced");

		expect(anchor.textContent).toBe("Some other text");
	});

	it("should replace URL in deeply nested text nodes", () => {
		const anchor = document.createElement("a");
		anchor.href = "https://example.backlog.jp/view/TEST-123";

		const div = document.createElement("div");
		const span = document.createElement("span");
		span.textContent = "https://example.backlog.jp/view/TEST-123";
		div.appendChild(span);
		anchor.appendChild(div);

		replaceUrlInTextNodes(anchor, "Deep Replacement");

		expect(anchor.querySelector("div")).toBe(div);
		expect(anchor.querySelector("span")).toBe(span);
		expect(span.textContent).toBe("Deep Replacement");
	});
});
