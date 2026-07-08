import { PublicationStatus } from "@/lib/generated/prisma/enums";
import { getPrisma } from "@/lib/db/prisma";

export async function getAdminSkillUnits() {
  const db = getPrisma();

  return db.unit.findMany({
    include: {
      level: {
        include: {
          course: true
        }
      },
      skills: {
        include: {
          questions: true
        },
        orderBy: {
          order: "asc"
        }
      }
    },
    orderBy: {
      order: "asc"
    }
  });
}

export async function getAdminSkillBySlug(skillSlug: string) {
  const db = getPrisma();

  return db.skill.findUnique({
    where: {
      slug: skillSlug
    },
    include: {
      unit: {
        include: {
          level: {
            include: {
              course: true
            }
          }
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

export async function getPublishedSkillBySlug(skillSlug: string) {
  const db = getPrisma();

  return db.skill.findFirst({
    where: {
      slug: skillSlug,
      publicationStatus: PublicationStatus.PUBLISHED
    },
    include: {
      unit: true
    }
  });
}
