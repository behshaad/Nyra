import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminResourceForm } from "@/components/admin-resource-form";
import { AppHeader } from "@/components/app-header";
import {
  getResourceBySlug,
  getResourceFormOptions
} from "@/lib/resources/resource-repository";

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

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/admin/resources/${resource.slug}/edit`} />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href="/admin">
            <ArrowLeft size={17} />
            Back to Admin
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>Edit Resource.</h1>
          <p>
            Update learner-facing Resource content or archive it without deleting history.
          </p>
        </div>

        <section className="app-panel route-panel">
          <AdminResourceForm
            mode="edit"
            resourceSlug={resource.slug}
            initialValues={{
              title: resource.title,
              slug: resource.slug,
              type: resource.type,
              levelLabel: resource.levelLabel,
              description: resource.description,
              content: resource.content,
              unitId: resource.unitId ?? "",
              skillId: resource.skillId ?? "",
              publicationStatus: resource.publicationStatus
            }}
            units={units.map((unit) => ({
              id: unit.id,
              slug: unit.slug,
              title: unit.title,
              skills: unit.skills.map((skill) => ({
                id: skill.id,
                slug: skill.slug,
                title: skill.title
              }))
            }))}
          />
        </section>
      </section>
    </main>
  );
}
