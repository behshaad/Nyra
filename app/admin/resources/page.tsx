import Link from "next/link";
import {
  AlertTriangle, BookOpen, CheckCircle2, ExternalLink, FilePenLine,
  Languages, Plus, Search, SlidersHorizontal
} from "lucide-react";
import { PublicationStatus, ResourceType } from "@/lib/generated/prisma/enums";
import { getAdminResourcesFromDb } from "@/lib/resources/resource-repository";
import {
  filterAdminResources, resourcePlacement, resourceReadiness
} from "@/lib/admin/resource-overview";

export const dynamic = "force-dynamic";

const statusLabels: Record<PublicationStatus, string> = {
  DRAFT: "Draft", IN_REVIEW: "In Review", PUBLISHED: "Published", ARCHIVED: "Archived"
};
const typeLabels: Record<ResourceType, string> = {
  BOOK: "Book", VIDEO: "Video", AUDIO_LESSON: "Audio lesson", EXTERNAL_LINK: "External link",
  GRAMMAR_RESOURCE: "Grammar", READING_MATERIAL: "Reading", LEARNING_GUIDE: "Learning guide"
};

export default async function AdminResourcesPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; type?: string; level?: string }>;
}) {
  const filters = await searchParams;
  const resources = await getAdminResourcesFromDb();
  const visible = filterAdminResources(resources, filters);
  const levels = [...new Set(resources.map((resource) => resource.levelLabel))].sort();
  const attentionCount = resources.filter((resource) => !resourceReadiness(resource).ready).length;
  const activeFilters = Boolean(filters.q || filters.status || filters.type || filters.level);

  return (
    <div className="resource-admin-page">
      <header className="resource-admin-hero">
        <div>
          <span className="section-label">Content operations · مدیریت محتوا</span>
          <h1>Resource Studio</h1>
          <p>Manage every authored Resource, its placement, lifecycle, learner visibility, and publication readiness.</p>
        </div>
        <Link className="primary-button" href="/admin/resources/new"><Plus aria-hidden="true" size={17} />Create Draft</Link>
      </header>

      <section className="resource-admin-metrics" aria-label="Resource metrics">
        <article><BookOpen aria-hidden="true" /><span>All authored</span><strong>{resources.length}</strong><small>across every lifecycle state</small></article>
        <article><CheckCircle2 aria-hidden="true" /><span>Published</span><strong>{resources.filter((r) => r.publicationStatus === PublicationStatus.PUBLISHED).length}</strong><small>visible in the learner library</small></article>
        <article><FilePenLine aria-hidden="true" /><span>Drafts</span><strong>{resources.filter((r) => r.publicationStatus === PublicationStatus.DRAFT).length}</strong><small>editable working copies</small></article>
        <article className={attentionCount ? "is-warning" : ""}><AlertTriangle aria-hidden="true" /><span>Needs attention</span><strong>{attentionCount}</strong><small>readiness or localization issues</small></article>
      </section>

      <form className="resource-admin-filters" action="/admin/resources">
        <label className="resource-admin-search"><Search aria-hidden="true" size={17} /><span className="sr-only">Search Resources</span><input name="q" defaultValue={filters.q} placeholder="Search title, slug, Unit, or Skill" /></label>
        <label><span className="sr-only">Status</span><select name="status" defaultValue={filters.status ?? ""}><option value="">All statuses</option>{Object.values(PublicationStatus).map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select></label>
        <label><span className="sr-only">Type</span><select name="type" defaultValue={filters.type ?? ""}><option value="">All types</option>{Object.values(ResourceType).map((type) => <option value={type} key={type}>{typeLabels[type]}</option>)}</select></label>
        <label><span className="sr-only">Level</span><select name="level" defaultValue={filters.level ?? ""}><option value="">All Levels</option>{levels.map((level) => <option value={level} key={level}>{level}</option>)}</select></label>
        <button className="secondary-button" type="submit"><SlidersHorizontal aria-hidden="true" size={16} />Apply</button>
        {activeFilters ? <Link className="ghost-button" href="/admin/resources">Clear</Link> : null}
      </form>

      {resources.length === 0 ? (
        <section className="resource-admin-empty"><BookOpen aria-hidden="true" size={28} /><h2>No Resources yet</h2><p>Create the first Draft to begin building the learner Resource Library.</p><Link className="primary-button" href="/admin/resources/new">Create first Draft</Link></section>
      ) : visible.length === 0 ? (
        <section className="resource-admin-empty"><Search aria-hidden="true" size={28} /><h2>No matching Resources</h2><p>Try a broader search or clear one of the lifecycle, type, or Level filters.</p><Link className="secondary-button" href="/admin/resources">Clear filters</Link></section>
      ) : (
        <section className="resource-admin-list" aria-label="Authored Resources">
          <header><span>{visible.length} Resources</span><small>Updated most recently first</small></header>
          {visible.map((resource) => {
            const readiness = resourceReadiness(resource);
            const editable = resource.publicationStatus === PublicationStatus.DRAFT;
            return (
              <article className="resource-admin-row" key={resource.id}>
                <div className="resource-admin-row-main">
                  <div className="resource-admin-row-title"><h2>{resource.title}</h2><span className={`resource-admin-status is-${resource.publicationStatus.toLowerCase()}`}>{statusLabels[resource.publicationStatus]}</span></div>
                  <p>{resource.description || "No description yet."}</p>
                  <div className="resource-admin-row-meta"><span>{typeLabels[resource.type]}</span><span>{resourcePlacement(resource)}</span><span>{resource.levelLabel}</span><span>Updated {resource.updatedAt.toLocaleDateString("en-GB")}</span></div>
                  <div className="resource-admin-readiness">
                    {readiness.ready ? <span className="is-ready"><CheckCircle2 aria-hidden="true" size={14} />Ready</span> : readiness.issues.map((issue) => <span className="is-warning" key={issue}><AlertTriangle aria-hidden="true" size={14} />{issue}</span>)}
                    {resource.language !== "fa/de/en" ? <span><Languages aria-hidden="true" size={14} />Legacy single-locale: {resource.language}</span> : null}
                  </div>
                </div>
                <div className="resource-admin-row-actions">
                  <Link className="secondary-button" href={`/admin/resources/${resource.slug}/edit`}>{editable ? "Edit Draft" : "View"}</Link>
                  {resource.publicationStatus === PublicationStatus.PUBLISHED ? <Link className="ghost-button" href={`/resources/${resource.slug}`} target="_blank">Learner Preview<ExternalLink aria-hidden="true" size={15} /></Link> : <small>Preview available when Published</small>}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
