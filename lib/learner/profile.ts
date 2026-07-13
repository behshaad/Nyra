import { getPrisma } from "@/lib/db/prisma";
import { devAuthUserId } from "@/lib/learner/preferences";
import { devLearnerProfile } from "@/lib/learning/sample-content";

export type LearnerProfileView = {
  displayName: string;
  sourceLanguage: string;
  targetLanguage: string;
  currentLevel: string;
  dailyGoalMinutes: number;
};

export async function getLearnerProfileView(
  authUserId = devAuthUserId
): Promise<LearnerProfileView> {
  try {
    const db = getPrisma();
    const profile = await db.learnerProfile.findUnique({
      where: {
        authUserId
      },
      select: {
        displayName: true,
        sourceLanguage: true,
        targetLanguage: true,
        currentLevel: true,
        dailyGoalMinutes: true
      }
    });

    if (profile) {
      return profile;
    }
  } catch (error) {
    if (
      !(error instanceof Error) ||
      (!error.message.includes("DATABASE_URL is required") &&
        !error.message.includes("Can't reach database server"))
    ) {
      throw error;
    }
  }

  return {
    displayName: devLearnerProfile.displayName,
    sourceLanguage: devLearnerProfile.sourceLanguage,
    targetLanguage: devLearnerProfile.targetLanguage,
    currentLevel: devLearnerProfile.currentLevel,
    dailyGoalMinutes: devLearnerProfile.dailyGoalMinutes
  };
}
