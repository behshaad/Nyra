import type { QuestionType } from "@/lib/generated/prisma/enums";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";

export type EvaluatableQuestion = {
  type: QuestionType;
  choices: unknown;
  correctAnswer: string;
};

function normalizeAnswer(answer: string) {
  return answer
    .trim()
    .replace(/[.!?؟]+$/u, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase()
    .replaceAll("ä", "ae")
    .replaceAll("ö", "oe")
    .replaceAll("ü", "ue")
    .replaceAll("ß", "ss");
}

export function evaluateAnswer(
  question: EvaluatableQuestion,
  submittedAnswer: string
) {
  const normalizedSubmitted = normalizeAnswer(submittedAnswer);
  const acceptedAnswers = [
    question.correctAnswer,
    ...questionOptionsFrom(question.choices).acceptedAnswers
  ];

  return acceptedAnswers.some(
    (answer) => normalizedSubmitted === normalizeAnswer(answer)
  );
}
