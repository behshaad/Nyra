import { ExternalLink, FileText, Mic2, NotebookText } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { getPublishedResources } from "@/lib/learning/sample-content";

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

export default function ResourcesPage() {
  const resources = getPublishedResources();

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
              <article className="resource-library-card" key={resource.slug}>
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
                <div className="resource-content">
                  <strong>Preview</strong>
                  <p>{resource.content}</p>
                </div>
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
}
