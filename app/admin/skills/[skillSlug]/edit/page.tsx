import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ListChecks } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminSkillForm } from "@/components/admin-skill-form";
import { AppHeader } from "@/components/app-header";
import { getAdminSkillBySlug } from "@/lib/admin/skill-repository";

export const dynamic = "force-dynamic";

export default async function EditSkillPage({
  params
}: {
  params: Promise<{
    skillSlug: string;
  }>;
}) {
  const { skillSlug } = await params;
  const skill = await getAdminSkillBySlug(skillSlug);

  if (!skill) {
    notFound();
  }

  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero compact">
          <Link className="ghost-button" href="/admin/skills">
            <ArrowLeft size={17} />
            Back to Skills
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>Edit Skill.</h1>
          <p>
            Update learner-facing Skill metadata for {skill.unit.level.label} / {skill.unit.title}.
            Question creation and reordering stay deferred.
          </p>
          <div className="route-actions">
            <Link className="secondary-button" href={`/admin/skills/${skill.slug}/questions`}>
              <ListChecks size={18} />
              Edit Questions
            </Link>
          </div>
        </div>

        <section className="app-panel route-panel">
          <AdminSkillForm
            skillSlug={skill.slug}
            initialValues={{
              title: skill.title,
              description: skill.description,
              xp: skill.xp,
              publicationStatus: skill.publicationStatus
            }}
          />
        </section>
      </section>
    </main>
  );
}
