import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Mic2, NotebookText } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { PublicationStatus } from "@/lib/generated/prisma/enums";
import { getResourceBySlug } from "@/lib/resources/resource-repository";

const resourceIcons = {
  GRAMMAR_NOTE: NotebookText,
  PRONUNCIATION: Mic2,
  WORKSHEET: FileText,
  EXTERNAL_LINK: ExternalLink
};

function formatResourceType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params
}: {
  params: Promise<{
    resourceSlug: string;
  }>;
}) {
  const { resourceSlug } = await params;
  const resource = await getResourceBySlug(resourceSlug);

  if (!resource || resource.publicationStatus !== PublicationStatus.PUBLISHED) {
    notFound();
  }

  const Icon = resourceIcons[resource.type];

  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/resources/${resource.slug}`} />

      <section className="route-page">
        <div className="route-hero compact">
          <Link className="ghost-button" href="/resources">
            <ArrowLeft size={17} />
            Back to Resource Library
          </Link>
          <div className="resource-detail-title">
            <span className="node-icon">
              <Icon size={18} />
            </span>
            <div>
              <span className="section-label">
                {resource.levelLabel} · {formatResourceType(resource.type)}
              </span>
              <h1>{resource.title}</h1>
            </div>
          </div>
          <p>{resource.description}</p>
        </div>

        <article className="app-panel route-panel resource-detail">
          <section>
            <span className="section-label">Resource body</span>
            <p>{resource.content}</p>
          </section>

          <dl className="resource-meta-grid">
            <div>
              <dt>Level</dt>
              <dd>{resource.levelLabel}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{formatResourceType(resource.type)}</dd>
            </div>
            <div>
              <dt>Related Unit</dt>
              <dd>{resource.unit?.title ?? "Not linked"}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{resource.publicationStatus}</dd>
            </div>
          </dl>

          {resource.skill ? (
            <div className="route-actions">
              <Link className="primary-button" href={`/learn/${resource.skill.slug}`}>
                Practice {resource.skill.title}
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
