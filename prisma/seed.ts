import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import {
  devLearnerProfile,
  sampleCourse,
  sampleResources
} from "../lib/learning/sample-content";

const a2LessonOneFlashcards = [
  ["der Alltag", "زندگی روزمره", "Mein Alltag ist jetzt ruhiger.", "زندگی روزمره من حالا آرام‌تر است.", "MEDIUM"],
  ["sich erinnern", "به خاطر آوردن", "Ich erinnere mich an den ersten Tag.", "من روز اول را به خاطر می‌آورم.", "HARD"],
  ["die Erfahrung", "تجربه", "Diese Erfahrung war wichtig fuer mich.", "این تجربه برای من مهم بود.", "MEDIUM"],
  ["der Termin", "وقت / قرار", "Ich habe morgen einen Termin.", "من فردا یک وقت دارم.", "EASY"],
  ["verschieben", "جابجا کردن / عقب انداختن", "Koennen wir den Termin verschieben?", "می‌توانیم وقت را جابجا کنیم؟", "HARD"],
  ["zuverlaessig", "قابل اعتماد", "Meine Kollegin ist sehr zuverlaessig.", "همکار من خیلی قابل اعتماد است.", "MEDIUM"],
  ["die Besprechung", "جلسه کاری", "Die Besprechung beginnt um neun Uhr.", "جلسه ساعت نه شروع می‌شود.", "MEDIUM"],
  ["teilnehmen", "شرکت کردن", "Ich nehme an der Besprechung teil.", "من در جلسه شرکت می‌کنم.", "HARD"],
  ["die Nachricht", "پیام / خبر", "Ich schreibe dir spaeter eine Nachricht.", "بعداً برایت پیام می‌نویسم.", "EASY"],
  ["erklaeren", "توضیح دادن", "Kannst du das bitte noch einmal erklaeren?", "می‌توانی لطفاً دوباره توضیح بدهی؟", "MEDIUM"],
  ["die Entscheidung", "تصمیم", "Das war eine schwere Entscheidung.", "این یک تصمیم سخت بود.", "HARD"],
  ["entscheiden", "تصمیم گرفتن", "Wir entscheiden morgen.", "ما فردا تصمیم می‌گیریم.", "MEDIUM"],
  ["die Moeglichkeit", "امکان", "Es gibt zwei Moeglichkeiten.", "دو امکان وجود دارد.", "MEDIUM"],
  ["moeglich", "ممکن", "Ist ein Treffen am Freitag moeglich?", "آیا ملاقات در جمعه ممکن است؟", "EASY"],
  ["die Verbesserung", "بهبود", "Ich sehe eine klare Verbesserung.", "من یک بهبود واضح می‌بینم.", "HARD"],
  ["verbessern", "بهبود دادن", "Ich moechte mein Deutsch verbessern.", "می‌خواهم آلمانی‌ام را بهتر کنم.", "MEDIUM"],
  ["der Vorschlag", "پیشنهاد", "Dein Vorschlag klingt gut.", "پیشنهادت خوب به نظر می‌رسد.", "MEDIUM"],
  ["vorschlagen", "پیشنهاد دادن", "Ich schlage einen Spaziergang vor.", "من یک پیاده‌روی پیشنهاد می‌کنم.", "HARD"],
  ["die Gewohnheit", "عادت", "Das ist eine gute Gewohnheit.", "این یک عادت خوب است.", "MEDIUM"],
  ["gewoehnlich", "معمولاً / معمولی", "Gewoehnlich lerne ich abends.", "معمولاً شب‌ها درس می‌خوانم.", "MEDIUM"],
  ["der Unterschied", "تفاوت", "Was ist der Unterschied?", "تفاوت چیست؟", "EASY"],
  ["unterschiedlich", "متفاوت", "Die Antworten sind unterschiedlich.", "پاسخ‌ها متفاوت هستند.", "MEDIUM"],
  ["die Meinung", "نظر", "Meiner Meinung nach ist das richtig.", "به نظر من این درست است.", "EASY"],
  ["zustimmen", "موافقت کردن", "Ich stimme dir zu.", "من با تو موافقم.", "MEDIUM"],
  ["ablehnen", "رد کردن", "Sie lehnt den Vorschlag ab.", "او پیشنهاد را رد می‌کند.", "HARD"],
  ["die Loesung", "راه‌حل", "Wir brauchen eine einfache Loesung.", "ما به یک راه‌حل ساده نیاز داریم.", "MEDIUM"],
  ["loesen", "حل کردن", "Wir koennen das Problem loesen.", "ما می‌توانیم مشکل را حل کنیم.", "MEDIUM"],
  ["der Fortschritt", "پیشرفت", "Dein Fortschritt ist deutlich.", "پیشرفتت واضح است.", "MEDIUM"],
  ["erreichen", "رسیدن به / دست یافتن", "Ich moechte mein Ziel erreichen.", "می‌خواهم به هدفم برسم.", "MEDIUM"],
  ["das Ziel", "هدف", "Mein Ziel ist B1.", "هدف من B1 است.", "EASY"]
] as const;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to seed Nyra.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.flashcardDeck.deleteMany();
  await prisma.resource.deleteMany();

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
      interfaceTheme: "SYSTEM",
      currentLevel: devLearnerProfile.currentLevel,
      dailyGoalMinutes: devLearnerProfile.dailyGoalMinutes,
      onboardingComplete: true
    },
    update: {
      displayName: devLearnerProfile.displayName,
      sourceLanguage: devLearnerProfile.sourceLanguage,
      targetLanguage: devLearnerProfile.targetLanguage,
      interfaceLanguage: devLearnerProfile.interfaceLanguage,
      interfaceTheme: "SYSTEM",
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
        language: resource.language,
        thumbnailIcon: resource.thumbnailIcon,
        metadata: resource.metadata,
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
        language: resource.language,
        thumbnailIcon: resource.thumbnailIcon,
        metadata: resource.metadata,
        content: resource.content,
        url: resource.url,
        publicationStatus: resource.publicationStatus,
        unitId: unit?.id,
        skillId: skill?.id
      }
    });
  }

  await prisma.flashcardDeck.upsert({
    where: {
      slug: "a2-lesson-1-core-vocabulary"
    },
    create: {
      slug: "a2-lesson-1-core-vocabulary",
      title: "A2 Lesson 1 Core Vocabulary",
      description: "Thirty admin-authored A2 flashcards for the first A2 lesson category.",
      levelLabel: "A2",
      category: "Lesson 1",
      ownerType: "ADMIN",
      publicationStatus: "PUBLISHED",
      flashcards: {
        create: a2LessonOneFlashcards.map(
          ([front, back, example, exampleMeaning, difficulty], index) => ({
            order: index + 1,
            front,
            back,
            example,
            exampleMeaning,
            difficulty,
            article: front.startsWith("der ")
              ? "der"
              : front.startsWith("die ")
                ? "die"
                : front.startsWith("das ")
                  ? "das"
                  : null,
            pronunciation: front.replace(/^(der|die|das) /, "")
          })
        )
      }
    },
    update: {
      title: "A2 Lesson 1 Core Vocabulary",
      description: "Thirty admin-authored A2 flashcards for the first A2 lesson category.",
      levelLabel: "A2",
      category: "Lesson 1",
      ownerType: "ADMIN",
      publicationStatus: "PUBLISHED",
      flashcards: {
        deleteMany: {},
        create: a2LessonOneFlashcards.map(
          ([front, back, example, exampleMeaning, difficulty], index) => ({
            order: index + 1,
            front,
            back,
            example,
            exampleMeaning,
            difficulty,
            article: front.startsWith("der ")
              ? "der"
              : front.startsWith("die ")
                ? "die"
                : front.startsWith("das ")
                  ? "das"
                  : null,
            pronunciation: front.replace(/^(der|die|das) /, "")
          })
        )
      }
    }
  });
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
