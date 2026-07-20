import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ListChecks } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminSkillForm } from "@/components/admin-skill-form";
import { AppHeader } from "@/components/app-header";
import { getAdminSkillBySlug } from "@/lib/admin/skill-repository";
import { canEditDraftContent, draftRevisionRequiredMessage } from "@/lib/admin/content-editability";

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

  const canEdit = canEditDraftContent({ aggregateStatus: skill.publicationStatus });

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/admin/skills/${skill.slug}/edit`} />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href="/admin/skills">
            <ArrowLeft size={17} />
            Back to Skills
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>{canEdit ? "Edit Skill." : "View Skill."}</h1>
          <p>
            Update learner-facing Skill metadata for {skill.unit.level.label} / {skill.unit.title}.
            Question creation and reordering are managed from this Skill's Question Studio.
          </p>
          <div className="route-actions">
            <Link className="secondary-button" href={`/admin/skills/${skill.slug}/questions`}>
              <ListChecks size={18} />
              Edit Questions
            </Link>
          </div>
        </div>

        <section className="app-panel route-panel">
          {canEdit ? <AdminSkillForm
            skillSlug={skill.slug}
            initialValues={{
              title: skill.title,
              description: skill.description,
              xp: skill.xp,
              publicationStatus: skill.publicationStatus
            }}
          /> : (
            <div className="admin-read-only-content">
              <div className="admin-read-only-notice" role="note">{draftRevisionRequiredMessage}</div>
              <dl>
                <div><dt>Status</dt><dd>{skill.publicationStatus}</dd></div>
                <div><dt>Title</dt><dd>{skill.title}</dd></div>
                <div><dt>Description</dt><dd>{skill.description}</dd></div>
                <div><dt>XP</dt><dd>{skill.xp}</dd></div>
              </dl>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
