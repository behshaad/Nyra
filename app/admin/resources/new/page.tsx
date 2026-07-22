import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminResourceForm } from "@/components/admin-resource-form";
import { AppHeader } from "@/components/app-header";
import { getResourceFormOptions } from "@/lib/resources/resource-repository";

export const dynamic = "force-dynamic";

export default async function NewResourcePage() {
  const units = await getResourceFormOptions();

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath="/admin/resources/new" />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href="/admin/resources">
            <ArrowLeft size={17} />
            Back to Resource Studio
          </Link>
          <span className="section-label">Resource Studio</span>
          <h1>Create a Resource Draft.</h1>
          <p>
            Start with the placement and core content. Readiness can be completed before review.
          </p>
        </div>

        <section className="app-panel route-panel">
          <AdminResourceForm
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
        </section>
      </section>
    </main>
  );
}
