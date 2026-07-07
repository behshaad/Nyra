import type { QuestionType } from "@/lib/generated/prisma/enums";

export type LearningQuestionView = {
  id: string;
  type: QuestionType;
  prompt: string;
  helper: string | null;
  choices: string[];
};

export type LearningSessionView = {
  sessionId: string;
  skill: {
    id: string;
    slug: string;
    title: string;
    description: string;
    xp: number;
  };
  status: "ACTIVE" | "COMPLETED";
  currentQuestion: LearningQuestionView | null;
  progressPercent: number;
  remainingQuestionCount: number;
};

export type AnswerFeedbackView = {
  sessionId: string;
  questionId: string;
  isCorrect: boolean;
  explanation: string;
  completed: boolean;
  xpAwarded: number;
  nextQuestion: LearningQuestionView | null;
  progressPercent: number;
};
