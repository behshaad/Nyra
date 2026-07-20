import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminQuestionForm } from "@/components/admin-question-form";
import { AppHeader } from "@/components/app-header";
import { getSuggestedFlashcardOptions } from "@/lib/admin/question-repository";
import { getAdminSkillBySlug } from "@/lib/admin/skill-repository";
import { canEditDraftContent, draftRevisionRequiredMessage } from "@/lib/admin/content-editability";

export const dynamic = "force-dynamic";

export default async function NewQuestionPage({
  params
}: {
  params: Promise<{
    skillSlug: string;
  }>;
}) {
  const { skillSlug } = await params;
  const [skill, suggestedFlashcardOptions] = await Promise.all([
    getAdminSkillBySlug(skillSlug),
    getSuggestedFlashcardOptions()
  ]);

  if (!skill) {
    notFound();
  }

  const canEdit = canEditDraftContent({ aggregateStatus: skill.publicationStatus });

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/admin/skills/${skill.slug}/questions/new`} />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href={`/admin/skills/${skill.slug}/questions`}>
            <ArrowLeft size={17} />
            Back to Questions
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>New Question.</h1>
          <p>
            Add a Draft required Question to {skill.unit.level.label} / {skill.unit.title} /{" "}
            {skill.title}. Publication is a separate reviewed lifecycle action.
          </p>
        </div>

        <section className="app-panel route-panel">
          {canEdit ? <AdminQuestionForm
            mode="create"
            skillSlug={skill.slug}
            initialValues={{
              type: "MULTIPLE_CHOICE",
              prompt: "",
              helper: "",
              choices: [],
              acceptedAnswers: [],
              tiles: [],
              correctAnswer: "",
              explanation: "",
              required: true,
              publicationStatus: "DRAFT",
              suggestedFlashcardIds: []
            }}
            suggestedFlashcardOptions={suggestedFlashcardOptions}
          /> : <div className="admin-read-only-notice" role="note">{draftRevisionRequiredMessage}</div>}
        </section>
      </section>
    </main>
  );
}
