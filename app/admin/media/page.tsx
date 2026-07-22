import Link from "next/link";
import { FileText, Headphones, Image as ImageIcon, Search, SlidersHorizontal, Video } from "lucide-react";
import { AdminMediaActions } from "@/components/admin-media-actions";
import { AdminMediaUpload } from "@/components/admin-media-upload";
import { MediaKind, MediaOperationalState } from "@/lib/generated/prisma/enums";
import { formatMediaBytes } from "@/lib/media/media-policy";
import { getAdminMediaItems, isMediaStorageConfigured } from "@/lib/media/media-repository";

export const dynamic = "force-dynamic";
const kindLabels: Record<MediaKind, string> = { IMAGE: "Images", DOCUMENT: "Documents", AUDIO: "Audio", VIDEO: "Video" };
const stateLabels: Record<MediaOperationalState, string> = { UPLOADING: "Uploading", READY: "Ready", FAILED: "Failed", QUARANTINED: "Quarantined" };

function MediaIcon({ kind }: { kind: MediaKind }) {
  if (kind === MediaKind.IMAGE) return <ImageIcon aria-hidden="true" />;
  if (kind === MediaKind.AUDIO) return <Headphones aria-hidden="true" />;
  if (kind === MediaKind.VIDEO) return <Video aria-hidden="true" />;
  return <FileText aria-hidden="true" />;
}

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string; state?: string }> }) {
  const filters = await searchParams;
  const items = await getAdminMediaItems();
  const configured = isMediaStorageConfigured();
  const query = filters.q?.trim().toLocaleLowerCase() ?? "";
  const visible = items.filter((item) =>
    (!query || [item.displayName, item.originalFilename, item.description, item.attribution].filter(Boolean).join(" ").toLocaleLowerCase().includes(query)) &&
    (!filters.kind || item.kind === filters.kind) &&
    (!filters.state || item.operationalState === filters.state)
  );
  const activeFilters = Boolean(filters.q || filters.kind || filters.state);
  const totalBytes = items.reduce((total, item) => total + item.byteSize, BigInt(0));

  return <div className="media-admin-page">
    <header className="media-admin-hero">
      <div><span className="section-label">Media operations · مدیریت رسانه</span><h1>Media Library</h1><p>Upload, inspect, and safely reuse public learning media across Nyra content and presentations.</p></div>
      <div className="media-admin-summary" aria-label="Media summary"><strong>{items.length}</strong><span>Media Items</span><strong>{formatMediaBytes(totalBytes)}</strong><span>stored</span><strong>{items.reduce((total, item) => total + item.usages.length, 0)}</strong><span>usage references</span></div>
    </header>
    <AdminMediaUpload configured={configured} />
    <form className="media-admin-filters" action="/admin/media">
      <label className="media-admin-search"><Search aria-hidden="true" size={18} /><span className="sr-only">Search Media</span><input name="q" defaultValue={filters.q} placeholder="Search Display Name, filename, or attribution" /></label>
      <label><span className="sr-only">Media Kind</span><select name="kind" defaultValue={filters.kind ?? ""}><option value="">All Media Kinds</option>{Object.values(MediaKind).map((kind) => <option key={kind} value={kind}>{kindLabels[kind]}</option>)}</select></label>
      <label><span className="sr-only">Operational State</span><select name="state" defaultValue={filters.state ?? ""}><option value="">All states</option>{Object.values(MediaOperationalState).map((state) => <option key={state} value={state}>{stateLabels[state]}</option>)}</select></label>
      <button className="secondary-button" type="submit"><SlidersHorizontal aria-hidden="true" size={16} />Apply</button>
      {activeFilters ? <Link className="ghost-button" href="/admin/media">Clear</Link> : null}
    </form>
    {items.length === 0 ? (
      <section className="media-admin-empty"><ImageIcon aria-hidden="true" size={30} /><h2>No Media Items yet</h2><p>{configured ? "Upload the first reusable file to begin the Media Library." : "Connect Vercel Blob to enable the first upload."}</p></section>
    ) : visible.length === 0 ? (
      <section className="media-admin-empty"><Search aria-hidden="true" size={28} /><h2>No matching Media Items</h2><p>Try a broader search or clear the Media Kind or operational-state filter.</p><Link className="secondary-button" href="/admin/media">Clear filters</Link></section>
    ) : (
      <section className="media-admin-grid" aria-label="Media Items">
        {visible.map((item) => <article className="media-admin-card" key={item.id}>
          <div className={`media-card-preview is-${item.kind.toLowerCase()}`}>
            {item.kind === MediaKind.IMAGE ? <div aria-label={`Preview of ${item.displayName}`} className="media-image-preview" role="img" style={{ backgroundImage: `url(${JSON.stringify(item.publicUrl).slice(1, -1)})` }} /> : item.kind === MediaKind.AUDIO ? <audio controls preload="metadata" src={item.publicUrl}>Audio preview unavailable.</audio> : item.kind === MediaKind.VIDEO ? <video controls preload="metadata" src={item.publicUrl}>Video preview unavailable.</video> : <MediaIcon kind={item.kind} />}
          </div>
          <div className="media-card-body">
            <div className="media-card-title"><MediaIcon kind={item.kind} /><div><span>{kindLabels[item.kind]}</span><h2>{item.displayName}</h2></div><strong className={`is-${item.operationalState.toLowerCase()}`}>{stateLabels[item.operationalState]}</strong></div>
            <p>{item.description || "No description provided."}</p>
            <dl><div><dt>File</dt><dd>{item.originalFilename}</dd></div><div><dt>Size</dt><dd>{formatMediaBytes(item.byteSize)}</dd></div><div><dt>Type</dt><dd>{item.mimeType}</dd></div><div><dt>Uses</dt><dd>{item.usages.length}</dd></div><div><dt>Uploaded</dt><dd>{item.createdAt.toLocaleDateString("en-GB")}</dd></div>{item.attribution ? <div><dt>Attribution</dt><dd>{item.attribution}</dd></div> : null}</dl>
            <AdminMediaActions id={item.id} publicUrl={item.publicUrl} canDelete={item.usages.length === 0} configured={configured} metadata={{ displayName: item.displayName, description: item.description ?? "", attribution: item.attribution ?? "", sourceNotes: item.sourceNotes ?? "" }} />
          </div>
        </article>)}
      </section>
    )}
  </div>;
}
