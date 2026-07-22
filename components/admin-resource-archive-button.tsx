"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive } from "lucide-react";

export function AdminResourceArchiveButton({ resourceSlug }: { resourceSlug: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function archive() {
    if (!window.confirm("Archive this Published Resource? Learners will no longer see it.")) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/resources/${resourceSlug}/archive`, { method: "PATCH" });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "Unable to archive Resource.");
      router.push("/admin/resources");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to archive Resource.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button className="danger-button" disabled={busy} onClick={archive} type="button">
        <Archive aria-hidden="true" size={17} />
        {busy ? "Archiving…" : "Archive Published Resource"}
      </button>
      {error ? <p className="feedback wrong" role="alert">{error}</p> : null}
    </div>
  );
}
