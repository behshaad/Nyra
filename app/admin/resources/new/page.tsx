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
          <Link className="ghost-button" href="/admin">
            <ArrowLeft size={17} />
            Back to Admin
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>Create a Resource.</h1>
          <p>
            This is the first write workflow for Nyra content. Authentication,
            permissions, audit logs, uploads, and AI generation are still deferred.
          </p>
        </div>

        <section className="app-panel route-panel">
          <AdminResourceForm
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
