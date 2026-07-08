import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import {
  devLearnerProfile,
  sampleCourse,
  sampleResources
} from "../lib/learning/sample-content";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed Nyra.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.course.deleteMany({
    where: {
      slug: sampleCourse.slug
    }
  });

  await prisma.learnerProfile.upsert({
    where: {
      authUserId: "dev-local-learner"
    },
    create: {
      authUserId: "dev-local-learner",
      displayName: devLearnerProfile.displayName,
      sourceLanguage: devLearnerProfile.sourceLanguage,
      targetLanguage: devLearnerProfile.targetLanguage,
      interfaceLanguage: devLearnerProfile.interfaceLanguage,
      currentLevel: devLearnerProfile.currentLevel,
      dailyGoalMinutes: devLearnerProfile.dailyGoalMinutes,
      onboardingComplete: true
    },
    update: {
      displayName: devLearnerProfile.displayName,
      sourceLanguage: devLearnerProfile.sourceLanguage,
      targetLanguage: devLearnerProfile.targetLanguage,
      interfaceLanguage: devLearnerProfile.interfaceLanguage,
      currentLevel: devLearnerProfile.currentLevel,
      dailyGoalMinutes: devLearnerProfile.dailyGoalMinutes,
      onboardingComplete: true
    }
  });

  await prisma.course.create({
    data: {
      slug: sampleCourse.slug,
      title: sampleCourse.title,
      sourceLanguage: sampleCourse.sourceLanguage,
      targetLanguage: sampleCourse.targetLanguage,
      interfaceLanguage: sampleCourse.interfaceLanguage,
      levels: {
        create: sampleCourse.levels.map((level, levelIndex) => ({
          order: levelIndex + 1,
          label: level.label,
          title: level.title,
          units: {
            create: level.units.map((unit, unitIndex) => ({
              order: unitIndex + 1,
              slug: unit.slug,
              title: unit.title,
              summary: unit.summary,
              skills: {
                create: unit.skills.map((skill, skillIndex) => ({
                  order: skillIndex + 1,
                  slug: skill.slug,
                  title: skill.title,
                  description: skill.description,
                  kind: skill.kind,
                  xp: skill.xp,
                  passingScore: skill.passingScore,
                  requeueIncorrect: skill.requeueIncorrect,
                  publicationStatus: skill.publicationStatus,
                  questions: {
                    create: skill.questions.map((question) => ({
                      order: question.order,
                      type: question.type,
                      prompt: question.prompt,
                      helper: question.helper,
                      choices: question.choices,
                      correctAnswer: question.correctAnswer,
                      explanation: question.explanation,
                      required: question.required,
                      publicationStatus: "PUBLISHED"
                    }))
                  }
                }))
              }
            }))
          }
        }))
      }
    }
  });

  for (const resource of sampleResources) {
    const unit = resource.unitSlug
      ? await prisma.unit.findUnique({
          where: {
            slug: resource.unitSlug
          }
        })
      : null;
    const skill = resource.skillSlug
      ? await prisma.skill.findUnique({
          where: {
            slug: resource.skillSlug
          }
        })
      : null;

    await prisma.resource.upsert({
      where: {
        slug: resource.slug
      },
      create: {
        slug: resource.slug,
        title: resource.title,
        description: resource.description,
        type: resource.type,
        levelLabel: resource.levelLabel,
        content: resource.content,
        url: resource.url,
        publicationStatus: resource.publicationStatus,
        unitId: unit?.id,
        skillId: skill?.id
      },
      update: {
        title: resource.title,
        description: resource.description,
        type: resource.type,
        levelLabel: resource.levelLabel,
        content: resource.content,
        url: resource.url,
        publicationStatus: resource.publicationStatus,
        unitId: unit?.id,
        skillId: skill?.id
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
