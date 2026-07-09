import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ExternalLink,
  FileText,
  Headphones,
  NotebookTabs,
  Route,
  Video
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { PublicationStatus } from "@/lib/generated/prisma/enums";
import {
  interfaceCopy,
  resolveInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import {
  commonCopy,
  publicationStatusCopy,
  resourceCopy,
  resourceTypeCopy,
  text
} from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getResourceBySlug } from "@/lib/resources/resource-repository";

const resourceIcons = {
  BOOK: BookOpen,
  VIDEO: Video,
  AUDIO_LESSON: Headphones,
  EXTERNAL_LINK: ExternalLink,
  GRAMMAR_RESOURCE: NotebookTabs,
  READING_MATERIAL: FileText,
  LEARNING_GUIDE: Route
};

export const dynamic = "force-dynamic";

export default async function ResourceDetailPage({
  params,
  searchParams
}: {
  params: Promise<{
    resourceSlug: string;
  }>;
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { resourceSlug } = await params;
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];
  const resource = await getResourceBySlug(resourceSlug);

  if (!resource || resource.publicationStatus !== PublicationStatus.PUBLISHED) {
    notFound();
  }

  const Icon = resourceIcons[resource.type];
  const metadata =
    resource.metadata && typeof resource.metadata === "object"
      ? Object.entries(resource.metadata as Record<string, unknown>)
      : [];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath={`/resources/${resource.slug}`} />

      <section className="route-page">
        <div className="route-hero compact">
          <Link className="ghost-button" href={withInterfaceLanguage("/resources", language)}>
            <ArrowLeft size={17} />
            {text(resourceCopy.back, language)}
          </Link>
          <div className="resource-detail-title">
            <span className="node-icon">
              <Icon size={18} />
            </span>
            <div>
              <span className="section-label">
                {resource.levelLabel} · {text(resourceTypeCopy[resource.type], language)}
              </span>
              <h1>{resource.title}</h1>
            </div>
          </div>
          <p>{resource.description}</p>
        </div>

        <article className="app-panel route-panel resource-detail">
          <section>
            <span className="section-label">{text(resourceCopy.resourceBody, language)}</span>
            <p>{resource.content}</p>
          </section>

          <dl className="resource-meta-grid">
            <div>
              <dt>{text(commonCopy.level, language)}</dt>
              <dd>{resource.levelLabel}</dd>
            </div>
            <div>
              <dt>{text(commonCopy.type, language)}</dt>
              <dd>{text(resourceTypeCopy[resource.type], language)}</dd>
            </div>
            <div>
              <dt>{text(resourceCopy.relatedUnit, language)}</dt>
              <dd>{resource.unit?.title ?? text(commonCopy.notLinked, language)}</dd>
            </div>
            <div>
              <dt>{text(commonCopy.language, language)}</dt>
              <dd>{resource.language}</dd>
            </div>
          </dl>

          {metadata.length > 0 ? (
            <dl className="resource-meta-grid">
              {metadata.map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
              <div>
                <dt>{text(commonCopy.status, language)}</dt>
                <dd>{text(publicationStatusCopy[resource.publicationStatus], language)}</dd>
            </div>
            </dl>
          ) : null}

          {resource.skill ? (
            <div className="route-actions">
              <Link
                className="primary-button"
                href={withInterfaceLanguage(`/learn/${resource.skill.slug}`, language)}
              >
                {text(resourceCopy.practice, language)} {resource.skill.title}
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : null}
        </article>
      </section>
    </main>
  );
}
