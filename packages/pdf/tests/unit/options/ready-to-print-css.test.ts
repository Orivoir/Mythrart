import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { createReadyToPrintPageCss } from "../../../src/options/ready-to-print-css.js";

describe("createReadyToPrintPageCss", () => {
  it("should inject page CSS into an existing head", () => {
    const html =
      "<html><head><title>Book</title></head><body>Content</body></html>";

    const result = createReadyToPrintPageCss(html);
    const document = new JSDOM(result).window.document;
    const style = document.head.querySelector("style");

    expect(style).not.toBeNull();
    expect(style?.textContent).toContain("@page");
    expect(style?.textContent).toContain("size: A4;");
    expect(style?.textContent).toContain("margin: 20mm 18mm;");
    expect(document.head.querySelector("title")?.textContent).toBe("Book");
    expect(document.body.textContent).toBe("Content");
  });

  it("should inject page CSS into the body when head is absent", () => {
    const html = "<html><body>Content</body></html>";

    const result = createReadyToPrintPageCss(html);
    const document = new JSDOM(result).window.document;
    const style = document.body.querySelector("style");

    expect(style).not.toBeNull();
    expect(style?.textContent).toContain("@page");
    expect(style?.textContent).toContain("size: A4;");
    expect(style?.textContent).toContain("margin: 20mm 18mm;");
    expect(document.body.textContent).toContain("Content");
  });

  it("should prepend page CSS when head and body are absent", () => {
    const html = "<p>Content</p>";

    const result = createReadyToPrintPageCss(html);
    const document = new JSDOM(result).window.document;
    const style = document.querySelector("style");

    expect(style).not.toBeNull();
    expect(style?.textContent).toContain("@page");
    expect(style?.textContent).toContain("size: A4;");
    expect(style?.textContent).toContain("margin: 20mm 18mm;");
    expect(document.querySelector("p")?.textContent).toBe("Content");
  });

  it("should inject CSS into a head with attributes", () => {
    const html =
      '<html><head lang="fr"><title>Book</title></head><body>Content</body></html>';

    const result = createReadyToPrintPageCss(html);
    const document = new JSDOM(result).window.document;

    expect(document.head.getAttribute("lang")).toBe("fr");
    expect(document.head.querySelector("style")).not.toBeNull();
    expect(document.head.querySelector("title")?.textContent).toBe("Book");
  });

  it("should not modify the original HTML string", () => {
    const html = "<html><head></head><body>Content</body></html>";
    const originalHtml = html;

    createReadyToPrintPageCss(html);

    expect(html).toBe(originalHtml);
  });
});