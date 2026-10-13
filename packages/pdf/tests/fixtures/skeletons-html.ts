/**
 * Role: Generate representative HTML fixtures for Gotenberg PDF integration tests.
 *
 * Image URLs must be reachable by the Gotenberg container.
 * Fixtures deliberately use HTTP(S) URLs and never embed Base64 images.
 */

export interface HtmlSkeletonFixture {
  name: string;
  html: string;
  expectedText: string[];
  expectedImageCount: number;
}

function escapeHtmlAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function createImage(
  url: string,
  alt: string,
  width = 240,
): string {
  if (!/^https?:\/\//i.test(url)) {
    throw new Error(`Expected an HTTP(S) image URL, received: ${url}`);
  }

  return `
    <figure>
      <img
        src="${escapeHtmlAttribute(url)}"
        alt="${escapeHtmlAttribute(alt)}"
        width="${width}"
        style="max-width: 100%; height: auto;"
      />
      <figcaption>${alt}</figcaption>
    </figure>
  `;
}

function createDocument(
  title: string,
  body: string,
  additionalCss = "",
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #222;
    }

    h1 { font-size: 26pt; }
    h2 { font-size: 18pt; }
    p { margin: 0 0 12px; }
    img { display: block; }
    figure { margin: 16px 0; }
    figcaption { font-size: 10pt; color: #555; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #888; padding: 6px; text-align: left; }

    ${additionalCss}
  </style>
</head>
<body>
  ${body}
</body>
</html>`;
}

export function createHtmlSkeletons(
  imageUrls: readonly string[],
): HtmlSkeletonFixture[] {
  if (imageUrls.length < 8) {
    throw new Error(
      `Expected at least 8 presigned image URLs, received ${imageUrls.length}.`,
    );
  }

  const images = imageUrls.slice(0, 8);

  return [
    {
      name: "minimal",
      html: createDocument(
        "Minimal document",
        `
          <h1>Minimal PDF fixture</h1>
          <p>MINIMAL_FIXTURE_TEXT</p>
          <p>This document tests basic HTML to PDF conversion.</p>
        `,
      ),
      expectedText: [
        "Minimal PDF fixture",
        "MINIMAL_FIXTURE_TEXT",
        "basic HTML to PDF conversion",
      ],
      expectedImageCount: 0,
    },

    {
      name: "editorial",
      html: createDocument(
        "Editorial document",
        `
          <header>
            <h1>Editorial fixture</h1>
            <p>EDITORIAL_INTRO_TEXT</p>
          </header>

          <main>
            <section>
              <h2>Chapter One</h2>
              <p>
                This paragraph contains <strong>bold text</strong>,
                <em>italic text</em>, and a
                <a href="https://example.com">hyperlink</a>.
              </p>
              <blockquote>
                EDITORIAL_QUOTE_TEXT
              </blockquote>
            </section>

            <section>
              <h2>Chapter Two</h2>
              <p>EDITORIAL_SECOND_CHAPTER_TEXT</p>
            </section>
          </main>
        `,
      ),
      expectedText: [
        "Editorial fixture",
        "EDITORIAL_INTRO_TEXT",
        "Chapter One",
        "bold text",
        "italic text",
        "EDITORIAL_QUOTE_TEXT",
        "Chapter Two",
        "EDITORIAL_SECOND_CHAPTER_TEXT",
      ],
      expectedImageCount: 0,
    },

    {
      name: "images",
      html: createDocument(
        "Image document",
        `
          <h1>Image fixture</h1>
          <p>IMAGE_FIXTURE_TEXT</p>

          ${images
            .map((url, index) =>
              createImage(url, `IMAGE_FIXTURE_${index + 1}`, 200),
            )
            .join("\n")}
        `,
      ),
      expectedText: [
        "Image fixture",
        "IMAGE_FIXTURE_TEXT",
        ...images.map((_, index) => `IMAGE_FIXTURE_${index + 1}`),
      ],
      expectedImageCount: 8,
    },

    {
      name: "multipage",
      html: createDocument(
        "Multipage document",
        `
          <section>
            <h1>Multipage fixture</h1>
            <p>MULTIPAGE_PAGE_ONE_TEXT</p>
            <p>
              This content exercises paragraph layout, line wrapping,
              and the first page of a multipage document.
            </p>
          </section>

          <section style="break-before: page; page-break-before: always;">
            <h1>Second page</h1>
            <p>MULTIPAGE_PAGE_TWO_TEXT</p>
            <p>
              This section explicitly starts on a new printed page.
            </p>
          </section>

          <section style="break-before: page; page-break-before: always;">
            <h1>Third page</h1>
            <p>MULTIPAGE_PAGE_THREE_TEXT</p>
          </section>
        `,
      ),
      expectedText: [
        "Multipage fixture",
        "MULTIPAGE_PAGE_ONE_TEXT",
        "Second page",
        "MULTIPAGE_PAGE_TWO_TEXT",
        "Third page",
        "MULTIPAGE_PAGE_THREE_TEXT",
      ],
      expectedImageCount: 0,
    },

    {
      name: "lists-and-table",
      html: createDocument(
        "Lists and table document",
        `
          <h1>Lists and table fixture</h1>
          <p>STRUCTURED_CONTENT_TEXT</p>

          <h2>Unordered list</h2>
          <ul>
            <li>LIST_ITEM_ALPHA</li>
            <li>LIST_ITEM_BRAVO</li>
            <li>LIST_ITEM_CHARLIE</li>
          </ul>

          <h2>Ordered list</h2>
          <ol>
            <li>ORDERED_ITEM_ONE</li>
            <li>ORDERED_ITEM_TWO</li>
          </ol>

          <h2>Data table</h2>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th></tr>
            </thead>
            <tbody>
              <tr><td>TABLE_PRODUCT_ALPHA</td><td>12</td></tr>
              <tr><td>TABLE_PRODUCT_BRAVO</td><td>24</td></tr>
            </tbody>
          </table>

          ${createImage(images[0]!, "STRUCTURED_CONTENT_IMAGE", 180)}
        `,
      ),
      expectedText: [
        "Lists and table fixture",
        "STRUCTURED_CONTENT_TEXT",
        "LIST_ITEM_ALPHA",
        "LIST_ITEM_BRAVO",
        "LIST_ITEM_CHARLIE",
        "ORDERED_ITEM_ONE",
        "ORDERED_ITEM_TWO",
        "TABLE_PRODUCT_ALPHA",
        "TABLE_PRODUCT_BRAVO",
        "STRUCTURED_CONTENT_IMAGE",
      ],
      expectedImageCount: 1,
    },
  ];
}
