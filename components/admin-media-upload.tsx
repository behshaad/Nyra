"use client";

import { useState, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";
import { AlertTriangle, CheckCircle2, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";

const accept = ".jpg,.jpeg,.png,.webp,.pdf,.mp3,.m4a,.wav,.ogg,.mp4,.webm";

async function sha256(file: globalThis.File) {
  const digest = await globalThis.crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function AdminMediaUpload({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function submit(event: FormEvent<globalThis.HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new globalThis.FormData(form);
    const file = data.get("file");
    const displayName = String(data.get("displayName") ?? "").trim();
    if (!(file instanceof globalThis.File) || !file.size || !displayName) return setMessage({ type: "error", text: "Choose a file and provide a Display Name." });
    setBusy(true); setProgress(0); setMessage(null);
    try {
      const checksum = await sha256(file);
      const duplicateResponse = await fetch("/api/admin/media/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checksum }) });
      const duplicateData = (await duplicateResponse.json()) as { existing?: { displayName: string } | null; error?: string };
      if (!duplicateResponse.ok) throw new Error(duplicateData.error ?? "Could not check this file.");
      if (duplicateData.existing) throw new Error(`This file already exists as “${duplicateData.existing.displayName}”. Reuse the existing Media Item.`);

      const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
      const blob = await upload(`nyra-media/${globalThis.crypto.randomUUID()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/media/upload",
        multipart: file.size > 100_000_000,
        clientPayload: JSON.stringify({ filename: file.name, mimeType: file.type, byteSize: file.size }),
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage))
      });
      const completeResponse = await fetch("/api/admin/media/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        displayName, description: data.get("description"), attribution: data.get("attribution"), sourceNotes: data.get("sourceNotes"),
        originalFilename: file.name, pathname: blob.pathname, publicUrl: blob.url, mimeType: file.type, byteSize: file.size, checksum
      }) });
      const completeData = (await completeResponse.json()) as { error?: string };
      if (!completeResponse.ok) throw new Error(completeData.error ?? "Upload could not be recorded.");
      form.reset(); setMessage({ type: "success", text: "Media Item uploaded and ready to reuse." }); router.refresh();
    } catch (caught) {
      setMessage({ type: "error", text: caught instanceof Error ? caught.message : "Upload failed." });
    } finally {
      setBusy(false); setProgress(0);
    }
  }

  if (!configured) return <section className="media-storage-warning" role="status"><AlertTriangle aria-hidden="true" size={22} /><div><strong>Vercel Blob is not configured</strong><p>Connect a public Blob store and provide BLOB_READ_WRITE_TOKEN to enable uploads. Existing Media Items remain inspectable.</p></div></section>;

  return <form className="media-upload-panel" onSubmit={submit}>
    <header><div><span className="section-label">New Media Item</span><h2>Upload a reusable file</h2></div><CloudUpload aria-hidden="true" size={28} /></header>
    <div className="media-upload-grid">
      <label><span>Display Name</span><input name="displayName" required placeholder="A1 family vocabulary audio" /></label>
      <label><span>File</span><input accept={accept} name="file" required type="file" /></label>
      <label><span>Description <small>optional</small></span><input name="description" /></label>
      <label><span>Attribution <small>optional</small></span><input name="attribution" /></label>
      <label className="is-wide"><span>Copyright or source notes <small>optional</small></span><textarea name="sourceNotes" rows={2} /></label>
    </div>
    {busy ? <div className="media-upload-progress" aria-live="polite"><span style={{ width: `${progress}%` }} /><strong>{progress}% uploaded</strong></div> : null}
    {message ? <div className={`media-upload-message is-${message.type}`} role={message.type === "error" ? "alert" : "status"}>{message.type === "success" ? <CheckCircle2 aria-hidden="true" size={17} /> : <AlertTriangle aria-hidden="true" size={17} />}{message.text}</div> : null}
    <div className="route-actions"><button className="primary-button" disabled={busy} type="submit"><CloudUpload aria-hidden="true" size={17} />{busy ? "Uploading…" : "Upload Media"}</button><small>Allowed: JPEG, PNG, WebP, PDF, MP3, M4A, WAV, OGG, MP4, WebM.</small></div>
  </form>;
}
