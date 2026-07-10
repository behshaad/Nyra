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

type SeedFlashcard = readonly [
  string,
  string,
  string,
  string,
  "EASY" | "MEDIUM" | "HARD"
];

const a2UnitFlashcardDecks: Array<{
  slug: string;
  title: string;
  description: string;
  category: string;
  unitSlug: string;
  cards: readonly SeedFlashcard[];
}> = [
  {
    slug: "a2-unit-1-core-vocabulary",
    title: "واژگان اصلی A2 واحد 1",
    description: "سی فلش‌کارت نویسنده‌شده برای واحد اول A2: آلمانی در زندگی جهانی.",
    category: "Unit 1",
    unitSlug: "a2-german-in-global-life",
    cards: a2LessonOneFlashcards
  },
  {
    slug: "a2-unit-2-core-vocabulary",
    title: "واژگان اصلی A2 واحد 2",
    description: "فلش‌کارت‌های واحد دوم A2 برای لباس، ظاهر، خرید و پیشنهاد دادن.",
    category: "Unit 2",
    unitSlug: "a2-appearance-and-recommendations",
    cards: [
      ["der Mantel", "پالتو", "Der Mantel sieht elegant aus.", "پالتو شیک به نظر می‌رسد.", "EASY"],
      ["die Jacke", "کت / ژاکت", "Haben Sie diese Jacke in Groesse M?", "آیا این ژاکت را در سایز M دارید؟", "EASY"],
      ["die Groesse", "سایز / اندازه", "Welche Groesse tragen Sie?", "چه سایزی می‌پوشید؟", "EASY"],
      ["der Anzug", "کت‌وشلوار", "Er traegt einen schwarzen Anzug.", "او کت‌وشلوار مشکی می‌پوشد.", "MEDIUM"],
      ["die Bluse", "بلوز زنانه", "Die Bluse passt gut.", "بلوز خوب اندازه است.", "MEDIUM"],
      ["die Stiefel", "چکمه‌ها", "Die Stiefel sind sehr bequem.", "چکمه‌ها خیلی راحت هستند.", "MEDIUM"],
      ["aussehen", "به نظر رسیدن", "Du siehst heute elegant aus.", "امروز شیک به نظر می‌رسی.", "HARD"],
      ["tragen", "پوشیدن", "Ich trage gern helle Farben.", "من رنگ‌های روشن را دوست دارم بپوشم.", "MEDIUM"],
      ["passen", "اندازه بودن / مناسب بودن", "Die Hose passt mir nicht.", "شلوار اندازه من نیست.", "MEDIUM"],
      ["empfehlen", "پیشنهاد کردن", "Ich empfehle dir diese Schuhe.", "این کفش‌ها را به تو پیشنهاد می‌کنم.", "HARD"],
      ["bequem", "راحت", "Die Schuhe sind bequem.", "کفش‌ها راحت هستند.", "EASY"],
      ["elegant", "شیک", "Das Kleid ist sehr elegant.", "لباس خیلی شیک است.", "EASY"],
      ["teuer", "گران", "Der Mantel ist zu teuer.", "پالتو خیلی گران است.", "EASY"],
      ["guenstig", "مقرون‌به‌صرفه", "Diese Jacke ist guenstig.", "این ژاکت مقرون‌به‌صرفه است.", "MEDIUM"],
      ["die Farbe", "رنگ", "Welche Farbe gefaellt dir?", "کدام رنگ را دوست داری؟", "EASY"],
      ["schwarz", "مشکی", "Ich suche einen schwarzen Anzug.", "دنبال کت‌وشلوار مشکی هستم.", "EASY"],
      ["hell", "روشن", "Helle Farben passen gut zu dir.", "رنگ‌های روشن به تو می‌آیند.", "MEDIUM"],
      ["dunkel", "تیره", "Die dunkle Jacke ist schoen.", "ژاکت تیره زیباست.", "MEDIUM"],
      ["der Vorschlag", "پیشنهاد", "Dein Vorschlag ist gut.", "پیشنهادت خوب است.", "MEDIUM"],
      ["die Empfehlung", "توصیه / پیشنهاد", "Danke fuer die Empfehlung.", "ممنون بابت پیشنهاد.", "HARD"],
      ["umtauschen", "تعویض کردن", "Kann ich die Jacke umtauschen?", "می‌توانم ژاکت را تعویض کنم؟", "HARD"],
      ["anprobieren", "پرو کردن", "Ich moechte die Hose anprobieren.", "می‌خواهم شلوار را پرو کنم.", "HARD"],
      ["die Kasse", "صندوق", "Die Kasse ist dort links.", "صندوق آنجا سمت چپ است.", "EASY"],
      ["der Schauspieler", "بازیگر مرد", "Der Schauspieler traegt oft Schwarz.", "بازیگر اغلب مشکی می‌پوشد.", "MEDIUM"],
      ["der Filmstar", "ستاره فیلم", "Der Filmstar sieht sehr modern aus.", "ستاره فیلم خیلی مدرن به نظر می‌رسد.", "MEDIUM"]
    ]
  },
  {
    slug: "a2-unit-3-core-vocabulary",
    title: "واژگان اصلی A2 واحد 3",
    description: "فلش‌کارت‌های واحد سوم A2 برای خانواده، رابطه‌ها، دوستی و خبر گرفتن.",
    category: "Unit 3",
    unitSlug: "a2-family-relationships-and-friends",
    cards: [
      ["die Verwandten", "خویشاوندان", "Meine Verwandten wohnen in Berlin.", "خویشاوندان من در برلین زندگی می‌کنند.", "MEDIUM"],
      ["verheiratet", "متاهل", "Sie sind seit zwei Jahren verheiratet.", "آن‌ها دو سال است ازدواج کرده‌اند.", "EASY"],
      ["ledig", "مجرد", "Mein Bruder ist ledig.", "برادرم مجرد است.", "EASY"],
      ["das Paar", "زوج", "Das Paar plant eine Reise.", "زوج یک سفر برنامه‌ریزی می‌کند.", "EASY"],
      ["die Beziehung", "رابطه", "Ihre Beziehung ist sehr stabil.", "رابطه آن‌ها خیلی پایدار است.", "MEDIUM"],
      ["vertrauen", "اعتماد کردن", "Ich vertraue meiner besten Freundin.", "به بهترین دوستم اعتماد دارم.", "HARD"],
      ["sich melden", "خبر دادن / تماس گرفتن", "Melde dich bitte am Wochenende.", "لطفاً آخر هفته خبر بده.", "HARD"],
      ["kennenlernen", "آشنا شدن", "Wir haben uns im Kurs kennengelernt.", "ما در کلاس با هم آشنا شدیم.", "HARD"],
      ["gemeinsam", "مشترک / با هم", "Wir kochen oft gemeinsam.", "ما اغلب با هم آشپزی می‌کنیم.", "MEDIUM"],
      ["zu Besuch", "برای دیدار / مهمان", "Meine Tante ist zu Besuch.", "خاله‌ام مهمان است.", "MEDIUM"],
      ["der Onkel", "عمو / دایی", "Mein Onkel wohnt in Wien.", "عمویم در وین زندگی می‌کند.", "EASY"],
      ["die Tante", "عمه / خاله", "Meine Tante ruft oft an.", "خاله‌ام اغلب تماس می‌گیرد.", "EASY"],
      ["der Cousin", "پسرعمو / پسرخاله", "Mein Cousin studiert Medizin.", "پسرخاله‌ام پزشکی می‌خواند.", "EASY"],
      ["die Cousine", "دخترعمو / دخترخاله", "Meine Cousine arbeitet in Hamburg.", "دخترخاله‌ام در هامبورگ کار می‌کند.", "EASY"],
      ["die Schwiegereltern", "والدین همسر", "Meine Schwiegereltern kommen morgen.", "والدین همسرم فردا می‌آیند.", "HARD"],
      ["der Kontakt", "ارتباط", "Wir haben noch Kontakt.", "ما هنوز ارتباط داریم.", "MEDIUM"],
      ["anrufen", "تماس گرفتن", "Ich rufe dich spaeter an.", "بعداً به تو زنگ می‌زنم.", "MEDIUM"],
      ["besuchen", "دیدار کردن", "Wir besuchen unsere Freunde.", "ما دوستانمان را می‌بینیم.", "EASY"],
      ["erzaehlen", "تعریف کردن", "Erzaehl mir von deiner Familie.", "درباره خانواده‌ات برایم تعریف کن.", "MEDIUM"],
      ["streiten", "بحث / دعوا کردن", "Geschwister streiten manchmal.", "خواهر و برادرها گاهی بحث می‌کنند.", "MEDIUM"],
      ["sich versoehnen", "آشتی کردن", "Nach dem Streit versoehnen sie sich.", "بعد از دعوا آشتی می‌کنند.", "HARD"],
      ["ehrlich", "صادق", "Eine ehrliche Freundin ist wichtig.", "یک دوست صادق مهم است.", "MEDIUM"],
      ["zuverlaessig", "قابل اعتماد", "Mein Freund ist zuverlaessig.", "دوستم قابل اعتماد است.", "MEDIUM"],
      ["die Freundschaft", "دوستی", "Unsere Freundschaft ist alt.", "دوستی ما قدیمی است.", "MEDIUM"],
      ["das Wochenende", "آخر هفته", "Melde dich am Wochenende.", "آخر هفته خبر بده.", "EASY"]
    ]
  },
  {
    slug: "a2-unit-4-core-vocabulary",
    title: "واژگان اصلی A2 واحد 4",
    description: "فلش‌کارت‌های واحد چهارم A2 برای خانه، اقامت، ایمیل و وسایل خانه.",
    category: "Unit 4",
    unitSlug: "a2-housing-stays-and-email",
    cards: [
      ["der Wohnungstausch", "تعویض خانه", "Wir machen einen Wohnungstausch.", "ما تعویض خانه انجام می‌دهیم.", "HARD"],
      ["die Unterkunft", "محل اقامت", "Die Unterkunft ist zentral.", "محل اقامت مرکزی است.", "MEDIUM"],
      ["die Anfrage", "درخواست / پرس‌وجو", "Vielen Dank fuer Ihre Anfrage.", "از درخواست شما سپاسگزاریم.", "MEDIUM"],
      ["die Vermieterin", "صاحبخانه زن", "Die Vermieterin antwortet per E-Mail.", "صاحبخانه با ایمیل پاسخ می‌دهد.", "HARD"],
      ["tauschen", "عوض کردن", "Wir tauschen die Wohnung.", "ما خانه را عوض می‌کنیم.", "MEDIUM"],
      ["buchen", "رزرو کردن", "Ich buche ein Zimmer.", "یک اتاق رزرو می‌کنم.", "MEDIUM"],
      ["ankommen", "رسیدن", "Wir kommen am Montag an.", "ما دوشنبه می‌رسیم.", "HARD"],
      ["abreisen", "عزیمت کردن", "Wir reisen am Freitag ab.", "ما جمعه می‌رویم.", "HARD"],
      ["der Topf", "قابلمه", "Der Topf steht im Schrank.", "قابلمه در کمد است.", "EASY"],
      ["die Tasse", "فنجان", "Stell die Tasse auf den Tisch.", "فنجان را روی میز بگذار.", "EASY"],
      ["der Teller", "بشقاب", "Die Teller sind neben der Spuele.", "بشقاب‌ها کنار سینک هستند.", "EASY"],
      ["die Spuele", "سینک ظرفشویی", "Die Spuele ist in der Kueche.", "سینک در آشپزخانه است.", "MEDIUM"],
      ["der Schrank", "کمد", "Der Topf steht im Schrank.", "قابلمه در کمد است.", "EASY"],
      ["der Tisch", "میز", "Die Tasse steht auf dem Tisch.", "فنجان روی میز است.", "EASY"],
      ["stellen", "گذاشتن ایستاده", "Stell die Flasche auf den Tisch.", "بطری را روی میز بگذار.", "HARD"],
      ["legen", "گذاشتن خوابیده", "Leg das Buch aufs Bett.", "کتاب را روی تخت بگذار.", "HARD"],
      ["haengen", "آویزان کردن / بودن", "Das Bild haengt an der Wand.", "تابلو روی دیوار آویزان است.", "HARD"],
      ["die Wand", "دیوار", "Das Bild haengt an der Wand.", "تابلو روی دیوار است.", "EASY"],
      ["das Regal", "قفسه", "Die Buecher stehen im Regal.", "کتاب‌ها در قفسه هستند.", "MEDIUM"],
      ["die Heizung", "شوفاژ / گرمایش", "Die Heizung funktioniert nicht.", "شوفاژ کار نمی‌کند.", "MEDIUM"],
      ["funktionieren", "کار کردن", "Das WLAN funktioniert gut.", "وای‌فای خوب کار می‌کند.", "MEDIUM"],
      ["das WLAN", "وای‌فای", "Gibt es WLAN in der Wohnung?", "آیا در خانه وای‌فای هست؟", "EASY"],
      ["die Nachricht", "پیام", "Ich schreibe eine kurze Nachricht.", "یک پیام کوتاه می‌نویسم.", "EASY"],
      ["freundliche Gruesse", "با احترام", "Freundliche Gruesse, Sara", "با احترام، سارا", "MEDIUM"],
      ["bitte", "لطفاً", "Stell die Tasse bitte auf den Tisch.", "لطفاً فنجان را روی میز بگذار.", "EASY"]
    ]
  }
];

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

  for (const deck of a2UnitFlashcardDecks) {
    const unit = await prisma.unit.findUnique({
      where: {
        slug: deck.unitSlug
      }
    });
    const flashcards = deck.cards.map(
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
    );

    await prisma.flashcardDeck.upsert({
      where: {
        slug: deck.slug
      },
      create: {
        slug: deck.slug,
        title: deck.title,
        description: deck.description,
        levelLabel: "A2",
        category: deck.category,
        ownerType: "ADMIN",
        publicationStatus: "PUBLISHED",
        unitId: unit?.id,
        flashcards: {
          create: flashcards
        }
      },
      update: {
        title: deck.title,
        description: deck.description,
        levelLabel: "A2",
        category: deck.category,
        ownerType: "ADMIN",
        publicationStatus: "PUBLISHED",
        unitId: unit?.id,
        flashcards: {
          deleteMany: {},
          create: flashcards
        }
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
