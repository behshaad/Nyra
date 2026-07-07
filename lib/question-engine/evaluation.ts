import type { QuestionType } from "@/lib/generated/prisma/enums";

export type EvaluatableQuestion = {
  type: QuestionType;
  correctAnswer: string;
};

function normalizeAnswer(answer: string) {
  return answer.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function evaluateAnswer(
  question: EvaluatableQuestion,
  submittedAnswer: string
) {
  const normalizedSubmitted = normalizeAnswer(submittedAnswer);
  const normalizedCorrect = normalizeAnswer(question.correctAnswer);

  return normalizedSubmitted === normalizedCorrect;
}
