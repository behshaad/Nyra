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
      }
    }
  });
}
