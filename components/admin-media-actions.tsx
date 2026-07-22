"use client";

import { useState, type FormEvent } from "react";
import { Check, Copy, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminMediaActions({ id, publicUrl, canDelete, configured, metadata }: { id: string; publicUrl: string; canDelete: boolean; configured: boolean; metadata: { displayName: string; description: string; attribution: string; sourceNotes: string } }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  async function update(event: FormEvent<globalThis.HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null);
    const data = new globalThis.FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Update failed.");
      setEditing(false); router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Update failed."); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm("Permanently delete this unused Media Item and its public blob?")) return;
    setBusy(true); setError(null);
    try {
      const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Deletion failed.");
      router.refresh();
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Deletion failed."); setBusy(false); }
  }
  return <div className="media-card-actions"><button className="ghost-button" type="button" onClick={async () => { await globalThis.navigator.clipboard.writeText(publicUrl); setCopied(true); globalThis.setTimeout(() => setCopied(false), 1800); }}>{copied ? <Check aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={15} />}{copied ? "Copied" : "Copy URL"}</button><a className="ghost-button" href={publicUrl} rel="noopener noreferrer" target="_blank">Open</a><button className="ghost-button" onClick={() => setEditing((value) => !value)} type="button">Edit metadata</button><button className="danger-button" disabled={!canDelete || !configured || busy} onClick={remove} type="button"><Trash2 aria-hidden="true" size={15} />{busy ? "Deleting…" : "Delete"}</button>{editing ? <form className="media-metadata-form" onSubmit={update}><label>Display Name<input defaultValue={metadata.displayName} name="displayName" required /></label><label>Description<textarea defaultValue={metadata.description} name="description" /></label><label>Attribution<input defaultValue={metadata.attribution} name="attribution" /></label><label>Source notes<textarea defaultValue={metadata.sourceNotes} name="sourceNotes" /></label><button className="secondary-button" disabled={busy} type="submit">Save metadata</button></form> : null}{error ? <small role="alert">{error}</small> : null}</div>;
}
