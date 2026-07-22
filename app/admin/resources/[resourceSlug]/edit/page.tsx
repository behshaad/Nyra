import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminResourceForm } from "@/components/admin-resource-form";
import { AdminResourceArchiveButton } from "@/components/admin-resource-archive-button";
import { AppHeader } from "@/components/app-header";
import {
  getResourceBySlug,
  getResourceFormOptions
} from "@/lib/resources/resource-repository";
import { canEditDraftContent, draftRevisionRequiredMessage } from "@/lib/admin/content-editability";
import { PublicationStatus } from "@/lib/generated/prisma/enums";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({
  params
}: {
  params: Promise<{
    resourceSlug: string;
  }>;
}) {
  const { resourceSlug } = await params;
  const [resource, units] = await Promise.all([
    getResourceBySlug(resourceSlug),
    getResourceFormOptions()
  ]);

  if (!resource) {
    notFound();
  }
  const editable = canEditDraftContent({ aggregateStatus: resource.publicationStatus });

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/admin/resources/${resource.slug}/edit`} />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href="/admin/resources">
            <ArrowLeft size={17} />
            Back to Resource Studio
          </Link>
          <span className="section-label">Resource Studio</span>
          <h1>{editable ? "Edit Resource Draft." : "View Resource."}</h1>
          <p>
            {editable ? "Update this Draft. Publication changes use the review workflow." : draftRevisionRequiredMessage}
          </p>
        </div>

        <section className="app-panel route-panel">
          <AdminResourceForm
            mode="edit"
            resourceSlug={resource.slug}
            editable={editable}
            initialValues={{
              title: resource.title,
              slug: resource.slug,
              type: resource.type,
              levelLabel: resource.levelLabel,
              language: resource.language,
              thumbnailIcon: resource.thumbnailIcon,
              metadata:
                resource.metadata && typeof resource.metadata === "object"
                  ? Object.entries(resource.metadata as Record<string, unknown>)
                      .map(([key, value]) => `${key}: ${String(value)}`)
                      .join("\n")
                  : "",
              description: resource.description,
              content: resource.content,
              url: resource.url ?? "",
              unitId: resource.unitId ?? "",
              skillId: resource.skillId ?? "",
              publicationStatus: resource.publicationStatus
            }}
            units={units.map((unit) => ({
              id: unit.id,
              slug: unit.slug,
              title: unit.title,
              levelLabel: unit.level.label,
              skills: unit.skills.map((skill) => ({
                id: skill.id,
                slug: skill.slug,
                title: skill.title
              }))
            }))}
          />
          {resource.publicationStatus === PublicationStatus.PUBLISHED ? (
            <div className="resource-admin-archive"><AdminResourceArchiveButton resourceSlug={resource.slug} /></div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
