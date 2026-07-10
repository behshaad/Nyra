import type { QuestionType, SkillKind } from "@/lib/generated/prisma/enums";

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
    kind: SkillKind;
    xp: number;
    passingScore: number | null;
  };
  status: "ACTIVE" | "COMPLETED";
  currentQuestion: LearningQuestionView | null;
  progressPercent: number;
  remainingQuestionCount: number;
  scorePercent: number | null;
  passed: boolean | null;
};

export type SuggestedFlashcardView = {
  id: string;
  deckTitle: string;
  front: string;
  back: string;
  article: string | null;
  example: string;
  exampleMeaning: string;
  pronunciationAudioUrl: string | null;
};

export type AnswerFeedbackView = {
  sessionId: string;
  questionId: string;
  isCorrect: boolean;
  explanation: string;
  suggestedFlashcards: SuggestedFlashcardView[];
  completed: boolean;
  xpAwarded: number;
  nextQuestion: LearningQuestionView | null;
  progressPercent: number;
  scorePercent: number | null;
  passed: boolean | null;
};
