import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AdminQuestionForm } from "@/components/admin-question-form";
import { AppHeader } from "@/components/app-header";
import {
  getAdminQuestionById,
  getSuggestedFlashcardOptions
} from "@/lib/admin/question-repository";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

export const dynamic = "force-dynamic";

export default async function EditQuestionPage({
  params
}: {
  params: Promise<{
    questionId: string;
  }>;
}) {
  const { questionId } = await params;
  const [question, suggestedFlashcardOptions] = await Promise.all([
    getAdminQuestionById(questionId),
    getSuggestedFlashcardOptions()
  ]);

  if (!question) {
    notFound();
  }

  const options = questionOptionsFrom(question.choices);

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath={`/admin/questions/${question.id}/edit`} />

      <section className="route-page admin-route">
        <div className="route-hero compact">
          <Link className="ghost-button" href={`/admin/skills/${question.skill.slug}/questions`}>
            <ArrowLeft size={17} />
            Back to Questions
          </Link>
          <span className="section-label">Dev Admin</span>
          <h1>Edit Question.</h1>
          <p>
            Update prompt, choices, correct answer, and feedback for {question.skill.title}.
          </p>
        </div>

        <section className="app-panel route-panel">
          <AdminQuestionForm
            questionId={question.id}
            skillSlug={question.skill.slug}
            initialValues={{
              type: question.type,
              prompt: question.prompt,
              helper: question.helper ?? "",
              choices: options.choices,
              acceptedAnswers: options.acceptedAnswers,
              tiles: options.tiles,
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              required: question.required,
              publicationStatus: question.publicationStatus,
              suggestedFlashcardIds: question.suggestedFlashcards.map(
                (link) => link.flashcardId
              )
            }}
            suggestedFlashcardOptions={suggestedFlashcardOptions}
          />
        </section>
      </section>
    </main>
  );
}
