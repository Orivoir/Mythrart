# Mythrart EPUB Generator

`packages/epub` generates EPUB 3 books from a book model, its assets, and a visual theme. This is the v1 implementation intended to support the Mythrart MVP.

## Capabilities

- Builds an EPUB 3 ZIP archive, including `META-INF/container.xml`, OPF package metadata, navigation, cover XHTML, chapter XHTML, and the stylesheet.
- Renders the supported TipTap content structures and marks, including text emphasis, strong text, links, lists, images, and mentions where implemented by the renderers.
- Includes book metadata, contributors, a cover, and assets supported by the current book model.
- Places assets under `OEBPS/images/`.
- Combines a static baseline stylesheet (`resources/styles.css`) with theme-specific CSS generated from `EpubTheme` (`resources/theme.ts`).
- Uses JSZip to build the archive.
- Has unit, integration, end-to-end, and separately invoked performance tests. The current test suite has been reported as passing; generated books have also been opened successfully in web-based readers.

## API

```ts
createEpub({ book, theme }): Promise<EpubGenerationResult>
```

```ts
export type CreateEpubOptions = {
  book: EpubBook
  theme: EpubTheme
}

export interface EpubTheme {
  backgroundColor: string
  textColor: string
  textFont: string
  titleFont: string
  subtitleFont: string
  headingColor: string
  fontSize: string
  lineHeight: string
  paragraphSpacing: string
  headingSpacing: string
}

export interface EpubGenerationResult {
  data: Uint8Array
  fileName: string
  mimeType: "application/epub+zip"
}
```

The caller supplies the book and asset data required by the current model. The package generates the archive; the application/worker handles job orchestration, storage, delivery, and database updates.

## Styles and themes

`resources/styles.css` provides shared, conservative reading styles for paragraphs, headings, images, blockquotes, links, lists, code, separators, tables, and emphasis. `resources/theme.ts` generates overrides from the supplied theme. The generated rules are appended to the base stylesheet.

Theme values are CSS-facing strings. They should be validated before insertion into generated CSS; a TypeScript `string` type alone does not guarantee a valid CSS value. EPUB readers vary in CSS support and may override fonts, colors, or font sizes.

## Current generation flow

1. Generate EPUB XML/XHTML documents and metadata.
2. Render supported chapter content.
3. Combine the base stylesheet with theme-specific CSS.
4. Add documents and asset data to a JSZip archive.
5. Generate the complete archive and return it as a `Uint8Array`.

## Limitations

- **The complete EPUB is held in memory** as the returned `Uint8Array`.
- Asset bytes are supplied to the generator; the current package does not fetch assets from S3 or expose a streaming asset-source interface.
- The pipeline is not fully streaming. Streaming only the ZIP output would not eliminate memory used by source assets already supplied to JSZip.
- Memory usage varies with book content, image sizes, and concurrent exports. Existing benchmarks use a test fixture and are not guarantees for every book or deployment.
- Passing validators and working in selected web readers does not guarantee identical behavior on every physical e-reader or commercial platform.
- Only the TipTap nodes, marks, and metadata implemented by the current renderers are supported.
- No universal maximum book size is guaranteed; the worker should apply sensible size and concurrency limits based on production measurements.

## Tests

Run from `packages/epub`:

```bash
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:e2e
pnpm test:performance
```

Performance tests are intentionally separate from the default test run. Continue to validate archive changes with EPUBCheck and test representative reading applications.

## For the future

A planned improvement is a **streaming ZIP pipeline**:

- Evaluate replacing JSZip with [Archiver](https://www.npmjs.com/package/archiver), or another suitable streaming ZIP backend.
- Separate asset metadata from asset bytes and introduce an asset-source interface that can open each asset as a readable stream, including from S3.
- Stream the completed ZIP to S3 rather than first materializing the whole archive as a `Uint8Array`.
- Keep `createEpub()` for in-memory consumers if useful, while adding a streaming entry point for workers.
- Verify EPUB-specific requirements, especially that `mimetype` is the first ZIP entry and is stored without compression.
- Handle errors, cancellation, backpressure, and multipart-upload cleanup.
- Re-run EPUBCheck, automated tests, and reader compatibility tests; measure peak RSS and throughput with realistic books before changing worker concurrency or VPS sizing.

This is a future direction, not a capability of the current v1. The MVP priority is to integrate and ship the existing generator rather than prematurely optimize memory usage.
