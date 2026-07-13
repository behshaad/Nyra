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
import { SearchBar } from "@/components/ui/search-bar";
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

type ResourceForSearch = Awaited<ReturnType<typeof getPublishedResourcesFromDb>>[number];

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .trim();
}

function searchableMetadata(metadata: unknown) {
  if (!metadata || typeof metadata !== "object") {
    return "";
  }

  return Object.entries(metadata as Record<string, unknown>)
    .map(([key, value]) => `${key} ${String(value)}`)
    .join(" ");
}

function resourceSearchText(resource: ResourceForSearch) {
  return normalizeSearchText(
    [
      resource.title,
      resource.description,
      resource.content,
      resource.levelLabel,
      resource.language,
      resource.type,
      resource.unit?.title,
      resource.skill?.title,
      searchableMetadata(resource.metadata)
    ]
      .filter(Boolean)
      .join(" ")
  );
}

export default async function ResourcesPage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
    q?: string;
  }>;
}) {
  const { q, ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];
  const resources = (await getPublishedResourcesFromDb()).map((resource) =>
    localizeResourceForInterface(resource, language)
  );
  const query = typeof q === "string" ? q.trim() : "";
  const normalizedQuery = normalizeSearchText(query);
  const visibleResources = normalizedQuery
    ? resources.filter((resource) => resourceSearchText(resource).includes(normalizedQuery))
    : resources;
  const hasSearch = normalizedQuery.length > 0;

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/resources" />

      <section className="route-page">
        <section className="resource-search-section" aria-labelledby="resource-search-title">
          <div>
            <p className="panel-kicker">{text(resourceCopy.label, language)}</p>
            <h1 id="resource-search-title">{text(resourceCopy.title, language)}</h1>
            <p>{text(resourceCopy.body, language)}</p>
          </div>
          <SearchBar
            action="/resources"
            defaultValue={query}
            dir={copy.dir}
            hiddenFields={{ ui }}
            labels={{
              clear: text(resourceCopy.searchClear, language),
              placeholder: text(resourceCopy.searchPlaceholder, language),
              submit: text(resourceCopy.searchAction, language)
            }}
          />
          {hasSearch ? (
            <p className="resource-search-count" aria-live="polite">
              {visibleResources.length} {text(resourceCopy.searchResults, language)} "{query}"
            </p>
          ) : null}
        </section>

        <div className="resource-filter-strip" aria-label="Resource filters">
          {[...new Set(resources.map((resource) => resource.type))].map((type) => (
            <span className="status-pill" key={type}>
              {text(resourceTypeCopy[type], language)}
            </span>
          ))}
        </div>

        {hasSearch ? null : <ResourceSpotlightCard />}

        <section className="resource-library" aria-label="Published resources">
          {visibleResources.map((resource) => {
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

        {visibleResources.length === 0 ? (
          <section className="resource-search-empty" aria-live="polite">
            <h2>{text(resourceCopy.searchNoResultsTitle, language)}</h2>
            <p>{text(resourceCopy.searchNoResultsBody, language)}</p>
            <Link className="secondary-button" href={withInterfaceLanguage("/resources", language)}>
              {text(resourceCopy.searchClear, language)}
            </Link>
          </section>
        ) : null}
      </section>
    </main>
  );
}
