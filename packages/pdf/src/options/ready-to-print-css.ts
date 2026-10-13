export function createReadyToPrintPageCss(html: string): string {
  const pageCss = `
    <style>
      @page {
        size: A4;
        margin: 20mm 18mm;
      }
    </style>
  `;

  if (/<head\b[^>]*>/i.test(html)) {
    return html.replace(
      /<head\b[^>]*>/i,
      (headTag) => `${headTag}${pageCss}`,
    );
  }

  if (/<body\b[^>]*>/i.test(html)) {
    return html.replace(
      /<body\b[^>]*>/i,
      (bodyTag) => `${bodyTag}${pageCss}`,
    );
  }

  return `${pageCss}${html}`;
}