import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ExternalLink,
  FileText,
  Headphones,
  Map,
  NotebookTabs,
  Route,
  Video
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { ResourceSpotlightCard } from "@/components/resource-spotlight-card";
import {
  interfaceCopy,
  resolveInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { resourceCopy, resourceTypeCopy, text } from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getPublishedResourcesFromDb } from "@/lib/resources/resource-repository";
import { localizeResourceForInterface } from "@/lib/resources/resource-display";

const resourceIcons = {
  BOOK: BookOpen,
  VIDEO: Video,
  AUDIO_LESSON: Headphones,
  EXTERNAL_LINK: ExternalLink,
  GRAMMAR_RESOURCE: NotebookTabs,
  READING_MATERIAL: FileText,
  LEARNING_GUIDE: Route
};

const thumbnailIcons = {
  "book-open": BookOpen,
  video: Video,
  headphones: Headphones,
  "external-link": ExternalLink,
  "notebook-tabs": NotebookTabs,
  "file-text": FileText,
  route: Route,
  map: Map
};

export const dynamic = "force-dynamic";

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];
  const resources = (await getPublishedResourcesFromDb()).map((resource) =>
    localizeResourceForInterface(resource, language)
  );

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/resources" />

      <section className="route-page">
        <div className="resource-filter-strip" aria-label="Resource filters">
          {[...new Set(resources.map((resource) => resource.type))].map((type) => (
            <span className="status-pill" key={type}>
              {text(resourceTypeCopy[type], language)}
            </span>
          ))}
        </div>

        <ResourceSpotlightCard />

        <section className="resource-library" aria-label="Published resources">
          {resources.map((resource) => {
            const Icon =
              thumbnailIcons[resource.thumbnailIcon as keyof typeof thumbnailIcons] ??
              resourceIcons[resource.type];
            const metadata =
              resource.metadata && typeof resource.metadata === "object"
                ? Object.entries(resource.metadata as Record<string, unknown>).slice(0, 2)
                : [];

            return (
              <Link
                className="resource-library-card"
                href={withInterfaceLanguage(`/resources/${resource.slug}`, language)}
                key={resource.slug}
              >
                <div className="resource-card-media" aria-hidden="true">
                  <Image
                    alt=""
                    fill
                    sizes="(max-width: 1040px) 100vw, 33vw"
                    src="/resources/resource-library-photo.jpg"
                  />
                  <span className="resource-card-media-icon">
                    <Icon size={18} />
                  </span>
                </div>
                <div className="resource-card-header">
                  <span className="node-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <span className="section-label">
                      {resource.levelLabel} · {text(resourceTypeCopy[resource.type], language)} · {resource.language}
                    </span>
                    <h2>{resource.title}</h2>
                  </div>
                </div>
                <p>{resource.description}</p>
                {resource.unit ? (
                  <span className="status-pill">{resource.unit.title}</span>
                ) : null}
                <div className="resource-content">
                  <strong>{text(resourceCopy.preview, language)}</strong>
                  <p>{resource.content}</p>
                </div>
                <div className="resource-card-meta">
                  {metadata.map(([key, value]) => (
                    <span key={key}>
                      {key}: {String(value)}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </section>
      </section>
    </main>
  );
}
