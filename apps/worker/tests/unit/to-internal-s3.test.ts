import { afterEach, describe, expect, it, vi } from "vitest";
import { toInternalS3Url } from "../../src/services/export/utils/to-internal-s3.js";

describe("toInternalS3Url", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("replaces the protocol and host with the internal endpoint", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("S3_INTERNAL_ENDPOINT", "http://minio:9000");

    const result = toInternalS3Url(
      "http://127.0.0.1:9000/ebooks/book-cover.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=abc123",
    );

    expect(result).toBe(
      "http://minio:9000/ebooks/book-cover.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=abc123",
    );
  });

  it("uses the protocol configured in the internal endpoint", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("S3_INTERNAL_ENDPOINT", "https://minio:9000");

    const result = toInternalS3Url(
      "http://127.0.0.1:9000/ebooks/book.pdf?token=abc",
    );

    expect(result).toBe("https://minio:9000/ebooks/book.pdf?token=abc");
  });

  it("returns the original URL in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("S3_INTERNAL_ENDPOINT", "http://minio:9000");

    const presignedUrl = "http://127.0.0.1:9000/ebooks/book.pdf?token=abc";

    expect(toInternalS3Url(presignedUrl)).toBe(presignedUrl);
  });

  it("throws when the internal endpoint is missing in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("S3_INTERNAL_ENDPOINT", "");

    expect(() =>
      toInternalS3Url("http://127.0.0.1:9000/ebooks/book.pdf"),
    ).toThrow("S3_INTERNAL_ENDPOINT is required");
  });

  it("throws when the internal endpoint is missing in test", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("S3_INTERNAL_ENDPOINT", "");

    expect(() =>
      toInternalS3Url("http://127.0.0.1:9000/ebooks/book.pdf"),
    ).toThrow("S3_INTERNAL_ENDPOINT is required");
  });
});
