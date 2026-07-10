import { getPrisma } from "@/lib/db/prisma";

export async function getQuestionsForSkill(skillSlug: string) {
  const db = getPrisma();

  return db.skill.findUnique({
    where: {
      slug: skillSlug
    },
    include: {
      unit: {
        include: {
          level: true
        }
      },
      questions: {
        orderBy: {
          order: "asc"
        }
      }
    }
  });
}

export async function getAdminQuestionById(questionId: string) {
  const db = getPrisma();

  return db.question.findUnique({
    where: {
      id: questionId
    },
    include: {
      skill: {
        include: {
          unit: {
            include: {
              level: true
            }
          }
        }
      },
      suggestedFlashcards: {
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
      }
    }
  });
}

export async function getSuggestedFlashcardOptions() {
  const db = getPrisma();

  const cards = await db.flashcard.findMany({
    where: {
      publicationStatus: "PUBLISHED",
      deck: {
        ownerType: "ADMIN",
        publicationStatus: "PUBLISHED"
      }
    },
    include: {
      deck: true
    },
    orderBy: [
      {
        deck: {
          levelLabel: "asc"
        }
      },
      {
        deck: {
          category: "asc"
        }
      },
      {
        deck: {
          title: "asc"
        }
      },
      {
        order: "asc"
      }
    ]
  });

  return cards.map((card) => ({
    id: card.id,
    label: `${card.deck.levelLabel} / ${card.deck.title} / ${card.front}`,
    detail: card.back
  }));
}
