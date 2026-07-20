import {
  FlashcardDeckOwnerType,
  LearningSessionStatus,
  ProgressEventType,
  PublicationStatus,
  QuestionAttemptResult
} from "@/lib/generated/prisma/enums";
import type { PrismaClient } from "@/lib/generated/prisma/client";
import { evaluateAnswer } from "@/lib/question-engine/evaluation";
import { questionOptionsFrom } from "@/lib/question-engine/question-options";
import type {
  AnswerFeedbackView,
  LearningQuestionView,
  LearningSessionView,
  SuggestedFlashcardView
} from "@/lib/question-engine/types";

type QuestionRecord = {
  id: string;
  type: LearningQuestionView["type"];
  prompt: string;
  helper: string | null;
  choices: unknown;
  correctAnswer: string;
  explanation: string;
};

type AttemptRecord = {
  result: QuestionAttemptResult;
};

function questionToView(question: QuestionRecord): LearningQuestionView {
  const options = questionOptionsFrom(question.choices);

  return {
    id: question.id,
    type: question.type,
    prompt: question.prompt,
    helper: question.helper,
    choices: options.choices,
    tiles: options.tiles.length > 0 ? options.tiles : options.choices
  };
}

function queueFromSession(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
    ? value
    : [];
}

function uniqueQuestionIdsFromAttempts(
  attempts: Array<{ questionId: string }>
) {
  return new Set(attempts.map((attempt) => attempt.questionId)).size;
}

function progressPercent(totalQuestions: number, remainingQuestions: number) {
  if (totalQuestions === 0) {
    return 100;
  }

  return Math.round(
    ((totalQuestions - remainingQuestions) / totalQuestions) * 100
  );
}

function scorePercent(totalQuestions: number, correctAttempts: number) {
  if (totalQuestions === 0) {
    return 100;
  }

  return Math.round((correctAttempts / totalQuestions) * 100);
}

function passed(score: number | null, passingScore: number | null) {
  return score === null || passingScore === null ? null : score >= passingScore;
}

function suggestedFlashcardToView(
  link: {
    flashcard: {
      id: string;
      front: string;
      back: string;
      article: string | null;
      example: string;
      exampleMeaning: string;
      pronunciationAudioUrl: string | null;
      deck: {
        title: string;
      };
    };
  }
): SuggestedFlashcardView {
  return {
    id: link.flashcard.id,
    deckTitle: link.flashcard.deck.title,
    front: link.flashcard.front,
    back: link.flashcard.back,
    article: link.flashcard.article,
    example: link.flashcard.example,
    exampleMeaning: link.flashcard.exampleMeaning,
    pronunciationAudioUrl: link.flashcard.pronunciationAudioUrl
  };
}

export class QuestionEngine {
  constructor(private readonly db: PrismaClient) {}

  async startOrResumeSession(input: {
    learnerProfileId: string;
    skillSlug: string;
  }): Promise<LearningSessionView> {
    const skill = await this.db.skill.findUniqueOrThrow({
      where: {
        slug: input.skillSlug
      },
      include: {
        questions: {
          where: {
            required: true,
            publicationStatus: PublicationStatus.PUBLISHED
          },
          orderBy: {
            order: "asc"
          }
        }
      }
    });

    if (skill.publicationStatus !== PublicationStatus.PUBLISHED) {
      throw new Error("Skill is not published.");
    }

    const existing = await this.db.learningSession.findFirst({
      where: {
        learnerProfileId: input.learnerProfileId,
        skillId: skill.id,
        status: LearningSessionStatus.ACTIVE
      },
      orderBy: {
        startedAt: "desc"
      }
    });

    const session =
      existing ??
      (await this.db.learningSession.create({
        data: {
          learnerProfileId: input.learnerProfileId,
          skillId: skill.id,
          questionQueue: skill.questions.map((question) => question.id),
          progressEvents: {
            create: {
              learnerProfileId: input.learnerProfileId,
              skillId: skill.id,
              type: ProgressEventType.SKILL_STARTED
            }
          }
        }
      }));

    const queue = queueFromSession(session.questionQueue);
    const currentQuestion = skill.questions.find(
      (question) => question.id === queue[0]
    );

    return {
      sessionId: session.id,
      skill: {
        id: skill.id,
        slug: skill.slug,
        title: skill.title,
        description: skill.description,
        kind: skill.kind,
        xp: skill.xp,
        passingScore: skill.passingScore
      },
      status: session.status,
      currentQuestion: currentQuestion ? questionToView(currentQuestion) : null,
      progressPercent: progressPercent(skill.questions.length, queue.length),
      remainingQuestionCount: queue.length,
      scorePercent: null,
      passed: null
    };
  }

  async submitAnswer(input: {
    sessionId: string;
    learnerProfileId: string;
    submittedAnswer: string;
  }): Promise<AnswerFeedbackView> {
    return this.db.$transaction(async (tx) => {
      const session = await tx.learningSession.findFirstOrThrow({
        where: {
          id: input.sessionId,
          learnerProfileId: input.learnerProfileId
        },
        include: {
          attempts: true,
          skill: {
            include: {
              questions: {
                where: {
                  required: true,
                  publicationStatus: PublicationStatus.PUBLISHED
                },
                orderBy: {
                  order: "asc"
                }
              }
            }
          }
        }
      });

      if (session.status === LearningSessionStatus.COMPLETED) {
        throw new Error("Learning Session is already complete.");
      }

      const queue = queueFromSession(session.questionQueue);
      const sessionQuestionCount =
        uniqueQuestionIdsFromAttempts(session.attempts) + queue.length;
      const questionId = queue[0];
      const question = session.skill.questions.find(
        (candidate) => candidate.id === questionId
      );

      if (!question) {
        throw new Error("Learning Session has no current Question.");
      }

      const isCorrect = evaluateAnswer(question, input.submittedAnswer);
      const result = isCorrect
        ? QuestionAttemptResult.CORRECT
        : QuestionAttemptResult.INCORRECT;
      const nextQueue =
        isCorrect || !session.skill.requeueIncorrect
          ? queue.slice(1)
          : [...queue.slice(1), question.id];
      const completed = nextQueue.length === 0;
      const correctAttemptCount =
        session.attempts.filter(
          (attempt: AttemptRecord) =>
            attempt.result === QuestionAttemptResult.CORRECT
        ).length + (isCorrect ? 1 : 0);
      const currentScore = session.skill.requeueIncorrect
        ? null
        : scorePercent(sessionQuestionCount, correctAttemptCount);
      const currentPassed = completed
        ? passed(currentScore, session.skill.passingScore)
        : null;
      const xpAwarded =
        completed && (currentPassed !== false) ? session.skill.xp : 0;

      await tx.questionAttempt.create({
        data: {
          learningSessionId: session.id,
          questionId: question.id,
          submittedAnswer: input.submittedAnswer,
          result,
          feedback: question.explanation
        }
      });

      await tx.progressEvent.create({
        data: {
          learnerProfileId: session.learnerProfileId,
          learningSessionId: session.id,
          skillId: session.skillId,
          type: ProgressEventType.QUESTION_ANSWERED,
          metadata: {
            questionId: question.id,
            result
          }
        }
      });

      if (completed) {
        await tx.progressEvent.createMany({
          data: [
            {
              learnerProfileId: session.learnerProfileId,
              learningSessionId: session.id,
              skillId: session.skillId,
              type: ProgressEventType.SKILL_COMPLETED,
              metadata: {
                scorePercent: currentScore,
                passed: currentPassed
              }
            },
            {
              learnerProfileId: session.learnerProfileId,
              learningSessionId: session.id,
              skillId: session.skillId,
              type: ProgressEventType.XP_AWARDED,
              xp: xpAwarded
            }
          ]
        });
      }

      await tx.learningSession.update({
        where: {
          id: session.id
        },
        data: {
          questionQueue: nextQueue,
          status: completed
            ? LearningSessionStatus.COMPLETED
            : LearningSessionStatus.ACTIVE,
          completedAt: completed ? new Date() : null,
          xpAwardedAt: completed ? new Date() : null
        }
      });

      const nextQuestion = session.skill.questions.find(
        (candidate) => candidate.id === nextQueue[0]
      );
      const suggestedFlashcards = isCorrect
        ? []
        : await tx.questionSuggestedFlashcard
            .findMany({
              where: {
                questionId: question.id,
                flashcard: {
                  publicationStatus: PublicationStatus.PUBLISHED,
                  deck: {
                    ownerType: FlashcardDeckOwnerType.ADMIN,
                    publicationStatus: PublicationStatus.PUBLISHED
                  }
                }
              },
              include: {
                flashcard: {
                  include: {
                    deck: true
                  }
                }
              },
              orderBy: {
                order: "asc"
              }
            })
            .then((links) => links.map(suggestedFlashcardToView));

      return {
        sessionId: session.id,
        questionId: question.id,
        isCorrect,
        explanation: question.explanation,
        suggestedFlashcards,
        completed,
        xpAwarded,
        nextQuestion: nextQuestion ? questionToView(nextQuestion) : null,
        progressPercent: progressPercent(
          sessionQuestionCount,
          nextQueue.length
        ),
        scorePercent: currentScore,
        passed: currentPassed
      };
    });
  }
}
