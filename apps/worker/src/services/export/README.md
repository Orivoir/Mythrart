# Exporters

Exporters transform a normalized ebook into a user-consumable output format.

## MVP Strategy

**EPUB** and **PDF** are core Mythrart features. They must provide a reliable and production-ready result from the MVP onward.

Other formats such as **HTML / WebView**, **TXT**, and **Markdown** are secondary features and primarily serve as supporting/CTA features. They expand the product's capabilities but should not introduce disproportionate architectural complexity during the MVP.

### General principle

> **Prioritize cost, reliability, and simplicity over perfect optimization.**

For the MVP, an exporter should be:

* reliable for supported content;
* deterministic;
* good enough for real-world use;
* reasonably performant;
* easy to maintain;
* free of unnecessary infrastructure.

Do not attempt to solve every edge case or optimization during the MVP.

## Expected Quality Level

The expected quality depends on the commercial role of the export format.

### EPUB / PDF

**Quality level: production / core feature**

These formats must produce documents that are genuinely usable by end users.

They should:

* preserve the ebook structure correctly;
* support headings, paragraphs, and the main supported TipTap content;
* handle images and cover images correctly;
* produce valid output files;
* avoid unnecessary temporary dependencies after generation;
* handle missing or invalid assets explicitly;
* have representative integration tests.

Rendering issues affecting normal user workflows should be treated as high priority.

### WebView / HTML

**Quality level: production-ready enough / secondary feature**

The generated HTML should be:

* standalone as far as reasonably possible;
* readable in a modern browser;
* suitable for sharing and viewing;
* free of client-side JavaScript;
* based on the existing TipTap rendering pipeline;
* able to handle images, cover images, and heading anchors.

For the MVP, the current strategy uses **S3 presigned URLs with a maximum lifetime of 7 days**.

This limitation is intentional. It avoids:

* base64 encoding every image;
* significantly increasing export size;
* additional server-side CPU usage;
* unnecessary outbound traffic;
* a much more complex asset embedding strategy.

A future hybrid strategy (base64 for small exports, presigned URLs for larger exports) can be considered if real usage and commercial requirements justify it.

### TXT / Markdown / Other Secondary Formats

**Quality level: functional**

These exporters should primarily:

* produce a valid output file;
* preserve textual content as much as reasonably possible;
* avoid silently losing important content;
* handle errors explicitly.

They do not require the same level of investment as EPUB/PDF during the MVP.

## Testing

Tests should reflect the **expected quality level**, not merely verify that the exporter does not throw.

For core exporters, prefer rich fixtures containing:

* multiple chapters;
* titles and subtitles;
* paragraphs;
* nested lists;
* blockquotes;
* code blocks;
* links;
* mentions;
* images;
* cover images;
* reused assets.

Integration tests should use the real pipeline whenever practical:

```text
Database
    ↓
S3 / MinIO
    ↓
Requirements loader
    ↓
Normalizer
    ↓
Exporter
    ↓
ExportedFile
```

The goal is to validate actual export behavior rather than only testing isolated functions.

## MVP Out of Scope

Do not introduce prematurely:

* complex worker architecture;
* distributed asynchronous processing;
* format-specific storage systems;
* advanced asset optimization;
* advanced versioning;
* advanced theme or locale handling;
* dedicated exporter infrastructure;
* complex fallback strategies.

These can be introduced later when actual product requirements justify them.

## Decision Rule

When considering an exporter improvement, prioritize:

1. **Reliability**
2. **Output quality**
3. **Server cost**
4. **Maintainability**
5. **Performance**
6. **Advanced optimization**

An optimization that significantly increases complexity for marginal benefit should not be introduced during the MVP.

The goal is not to build the perfect export system immediately.

The goal is to build an export system **reliable enough to sell Mythrart**, with an architecture that allows each exporter to evolve as real usage, costs, and commercial requirements become known.
