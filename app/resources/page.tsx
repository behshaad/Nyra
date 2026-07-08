import Link from "next/link";
import { ExternalLink, FileText, Mic2, NotebookText } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { getPublishedResourcesFromDb } from "@/lib/resources/resource-repository";

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

export default async function ResourcesPage() {
  const resources = await getPublishedResourcesFromDb();

  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">Resource Library</span>
          <h1>Published support material for the A1 loop.</h1>
          <p>
            Resources are learner-facing support materials outside required Skill Questions. This
            first library is read-only and seeded from the Nyra content model.
          </p>
        </div>

        <section className="resource-library" aria-label="Published resources">
          {resources.map((resource) => {
            const Icon = resourceIcons[resource.type];

            return (
              <Link
                className="resource-library-card"
                href={`/resources/${resource.slug}`}
                key={resource.slug}
              >
                <div className="resource-card-header">
                  <span className="node-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <span className="section-label">
                      {resource.levelLabel} · {formatResourceType(resource.type)}
                    </span>
                    <h2>{resource.title}</h2>
                  </div>
                </div>
                <p>{resource.description}</p>
                {resource.unit ? (
                  <span className="status-pill">{resource.unit.title}</span>
                ) : null}
                <div className="resource-content">
                  <strong>Preview</strong>
                  <p>{resource.content}</p>
                </div>
              </Link>
            );
          })}
        </section>
      </section>
    </main>
  );
}
