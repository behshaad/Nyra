import { describe, expect, it } from "vitest";
import { formatMediaBytes, signatureMatchesMediaType, validateMediaUpload } from "@/lib/media/media-policy";

describe("media upload policy", () => {
  it("accepts allowed files within their kind limit", () => {
    expect(validateMediaUpload({ filename: "lesson.webp", mimeType: "image/webp", byteSize: 1_000_000 })).toMatchObject({ ok: true, kind: "IMAGE" });
  });

  it("rejects active and mismatched content", () => {
    expect(validateMediaUpload({ filename: "diagram.svg", mimeType: "image/svg+xml", byteSize: 100 })).toMatchObject({ ok: false });
    expect(validateMediaUpload({ filename: "lesson.pdf", mimeType: "video/mp4", byteSize: 100 })).toMatchObject({ ok: false });
  });

  it("checks representative file signatures", () => {
    expect(signatureMatchesMediaType("application/pdf", new Uint8Array([37, 80, 68, 70, 45]))).toBe(true);
    expect(signatureMatchesMediaType("image/png", new Uint8Array([60, 115, 118, 103]))).toBe(false);
  });

  it("formats an empty library without inventing storage", () => {
    expect(formatMediaBytes(BigInt(0))).toBe("0 KB");
  });
});
