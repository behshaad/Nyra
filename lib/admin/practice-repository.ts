import { getPrisma } from "@/lib/db/prisma";
import {
  projectAdminPracticeOverview,
  type AdminPracticeOverview
} from "@/lib/admin/practice-overview";

export type AdminPracticeCourseOption = {
  slug: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
};

export type AdminPracticeSelection = {
  courses: AdminPracticeCourseOption[];
  overview: AdminPracticeOverview | null;
  selectionRequired: boolean;
};

export async function getAdminPracticeSelection(
  requestedCourseSlug?: string
): Promise<AdminPracticeSelection> {
  const db = getPrisma();
  const courses = await db.course.findMany({
    select: {
      slug: true,
      title: true,
      sourceLanguage: true,
      targetLanguage: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  const selectedSlug = requestedCourseSlug ?? (courses.length === 1 ? courses[0]?.slug : undefined);

  if (!selectedSlug) {
    return {
      courses,
      overview: null,
      selectionRequired: courses.length > 1
    };
  }

  const course = await db.course.findUnique({
    where: {
      slug: selectedSlug
    },
    include: {
      levels: {
        include: {
          units: {
            include: {
              skills: {
                include: {
                  questions: {
                    select: {
                      id: true,
                      required: true,
                      publicationStatus: true
                    }
                  }
                },
                orderBy: {
                  order: "asc"
                }
              }
            },
            orderBy: {
              order: "asc"
            }
          }
        },
        orderBy: {
          order: "asc"
        }
      }
    }
  });

  return {
    courses,
    overview: course ? projectAdminPracticeOverview(course) : null,
    selectionRequired: false
  };
}
