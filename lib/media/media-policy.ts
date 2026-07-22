import type { MediaKind } from "@/lib/generated/prisma/enums";

export const mediaTypePolicy: Record<string, { kind: MediaKind; maxBytes: number; extensions: string[] }> = {
  "image/jpeg": { kind: "IMAGE", maxBytes: 10_000_000, extensions: ["jpg", "jpeg"] },
  "image/png": { kind: "IMAGE", maxBytes: 10_000_000, extensions: ["png"] },
  "image/webp": { kind: "IMAGE", maxBytes: 10_000_000, extensions: ["webp"] },
  "application/pdf": { kind: "DOCUMENT", maxBytes: 25_000_000, extensions: ["pdf"] },
  "audio/mpeg": { kind: "AUDIO", maxBytes: 50_000_000, extensions: ["mp3"] },
  "audio/mp4": { kind: "AUDIO", maxBytes: 50_000_000, extensions: ["m4a"] },
  "audio/wav": { kind: "AUDIO", maxBytes: 50_000_000, extensions: ["wav"] },
  "audio/x-wav": { kind: "AUDIO", maxBytes: 50_000_000, extensions: ["wav"] },
  "audio/ogg": { kind: "AUDIO", maxBytes: 50_000_000, extensions: ["ogg"] },
  "video/mp4": { kind: "VIDEO", maxBytes: 250_000_000, extensions: ["mp4"] },
  "video/webm": { kind: "VIDEO", maxBytes: 250_000_000, extensions: ["webm"] }
};

export const allowedMediaTypes = Object.keys(mediaTypePolicy);

export function validateMediaUpload(input: { filename: string; mimeType: string; byteSize: number }) {
  const policy = mediaTypePolicy[input.mimeType];
  if (!policy) return { ok: false as const, error: "This file type is not allowed." };
  if (!Number.isSafeInteger(input.byteSize) || input.byteSize <= 0 || input.byteSize > policy.maxBytes) {
    return { ok: false as const, error: `File exceeds the ${Math.round(policy.maxBytes / 1_000_000)} MB limit for this media kind.` };
  }
  const extension = input.filename.split(".").pop()?.toLowerCase() ?? "";
  if (!policy.extensions.includes(extension)) {
    return { ok: false as const, error: "Filename extension does not match the declared media type." };
  }
  return { ok: true as const, kind: policy.kind, maxBytes: policy.maxBytes };
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

export function signatureMatchesMediaType(mimeType: string, bytes: Uint8Array) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.slice(0, 8).every((value, index) => value === [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a][index]);
  if (mimeType === "image/webp") return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP";
  if (mimeType === "application/pdf") return ascii(bytes, 0, 4) === "%PDF";
  if (mimeType === "audio/mpeg") return ascii(bytes, 0, 3) === "ID3" || (bytes[0] === 0xff && (bytes[1]! & 0xe0) === 0xe0);
  if (mimeType === "audio/mp4" || mimeType === "video/mp4") return ascii(bytes, 4, 4) === "ftyp";
  if (mimeType === "audio/wav" || mimeType === "audio/x-wav") return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WAVE";
  if (mimeType === "audio/ogg") return ascii(bytes, 0, 4) === "OggS";
  if (mimeType === "video/webm") return bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  return false;
}

export function formatMediaBytes(byteSize: bigint | number) {
  const bytes = Number(byteSize);
  if (bytes === 0) return "0 KB";
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
  return `${(bytes / 1_000_000).toFixed(bytes >= 10_000_000 ? 0 : 1)} MB`;
}
