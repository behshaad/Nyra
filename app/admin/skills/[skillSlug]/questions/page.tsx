import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Circle, Pencil, Plus } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { AdminQuestionMoveButton } from "@/components/admin-question-move-button";
import { getQuestionsForSkill } from "@/lib/admin/question-repository";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

export const dynamic = "force-dynamic";

export default async function SkillQuestionsPage({
  params
}: {
  params: Promise<{
    skillSlug: string;
  }>;
}) {
  const { skillSlug } = await params;
  const skill = await getQuestionsForSkill(skillSlug);

  if (!skill) {
    notFound();
  }

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/admin/skills/${skill.slug}/questions`} />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href={`/admin/skills/${skill.slug}/edit`}>
            <ArrowLeft size={17} />
            Back to Skill
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>Edit Questions.</h1>
          <p>
            Update existing Questions for {skill.unit.level.label} / {skill.unit.title} /{" "}
            {skill.title}. New Published required Questions appear in newly started learner
            sessions.
          </p>
          <div className="route-actions">
            <Link className="primary-button" href={`/admin/skills/${skill.slug}/questions/new`}>
              <Plus size={18} />
              New Question
            </Link>
          </div>
        </div>

        <section className="app-panel route-panel">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Question set</p>
              <h2>{skill.questions.length} Questions</h2>
            </div>
            <span className="status-pill">{skill.kind.replaceAll("_", " ")}</span>
          </div>

          <div className="admin-preview">
            {skill.questions.map((question, index) => {
              const options = questionOptionsFrom(question.choices);

              return (
                <article className="admin-row question-row" key={question.id}>
                  <Circle size={12} />
                  <div>
                    <h3>
                      {question.order}. {question.prompt}
                    </h3>
                    <p>
                      {question.type.replaceAll("_", " ")} / {options.choices.length} choices
                      {options.tiles.length > 0 ? ` / ${options.tiles.length} tiles` : ""} /{" "}
                      {question.required ? "Required" : "Optional"} / Correct:{" "}
                      <strong>{question.correctAnswer}</strong>
                    </p>
                  </div>
                  <span
                    className={
                      question.publicationStatus === "ARCHIVED"
                        ? "status-archived"
                        : undefined
                    }
                  >
                    {question.publicationStatus}
                  </span>
                  <div className="row-actions">
                    <AdminQuestionMoveButton
                      questionId={question.id}
                      direction="up"
                      disabled={index === 0}
                    />
                    <AdminQuestionMoveButton
                      questionId={question.id}
                      direction="down"
                      disabled={index === skill.questions.length - 1}
                    />
                  </div>
                  <Link
                    className="ghost-button compact-link"
                    href={`/admin/questions/${question.id}/edit`}
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
