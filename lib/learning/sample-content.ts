export type SampleQuestionType =
  | "MULTIPLE_CHOICE"
  | "FILL_IN_BLANK"
  | "WORD_ORDERING";

export type SampleQuestion = {
  id: string;
  order: number;
  type: SampleQuestionType;
  prompt: string;
  helper: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  required: boolean;
};

export type SampleSkill = {
  id: string;
  slug: string;
  title: string;
  description: string;
  xp: number;
  publicationStatus: "PUBLISHED";
  questions: SampleQuestion[];
};

export type SampleUnit = {
  slug: string;
  title: string;
  summary: string;
  skills: SampleSkill[];
};

export type SampleCourse = {
  slug: string;
  title: string;
  sourceLanguage: string;
  targetLanguage: string;
  interfaceLanguage: string;
  levels: Array<{
    label: string;
    title: string;
    units: SampleUnit[];
  }>;
};

export const devLearnerProfile = {
  id: "dev-learner",
  displayName: "Dev Learner",
  sourceLanguage: "Persian",
  targetLanguage: "German",
  interfaceLanguage: "Persian",
  currentLevel: "A1",
  dailyGoalMinutes: 10
};

export const sampleCourse: SampleCourse = {
  slug: "persian-to-german",
  title: "Persian Speakers Learning German",
  sourceLanguage: "Persian",
  targetLanguage: "German",
  interfaceLanguage: "Persian",
  levels: [
    {
      label: "A1",
      title: "A1 Foundations",
      units: [
        {
          slug: "a1-family-basics",
          title: "Family basics",
          summary:
            "Introduce family members, possessive pronouns, and simple A1 sentence order.",
          skills: [
            {
              id: "family-basics",
              slug: "family-basics",
              title: "Family basics",
              description:
                "Talk about family members with Persian-first grammar notes and German sentence rhythm.",
              xp: 80,
              publicationStatus: "PUBLISHED",
              questions: [
                {
                  id: "family-q1",
                  order: 1,
                  type: "MULTIPLE_CHOICE",
                  prompt:
                    "Choose the best Persian meaning for: Ich heiße Sara.",
                  helper: "A1 introductions",
                  choices: [
                    "من سارا هستم.",
                    "من سارا را دوست دارم.",
                    "سارا کجاست؟"
                  ],
                  correctAnswer: "من سارا هستم.",
                  explanation:
                    "'Ich heiße ...' is the natural German phrase for saying your name.",
                  required: true
                },
                {
                  id: "family-q2",
                  order: 2,
                  type: "FILL_IN_BLANK",
                  prompt: "Complete the sentence: Das ist ___ Bruder.",
                  helper: "Possessive pronouns",
                  choices: ["mein", "meine", "einen"],
                  correctAnswer: "mein",
                  explanation:
                    "'Bruder' is masculine, so the nominative possessive form is 'mein'.",
                  required: true
                },
                {
                  id: "family-q3",
                  order: 3,
                  type: "WORD_ORDERING",
                  prompt:
                    "Put the words in the natural order: komme / Iran / aus / Ich",
                  helper: "German sentence order",
                  choices: [
                    "Ich komme aus Iran",
                    "Aus ich Iran komme",
                    "Komme ich Iran aus"
                  ],
                  correctAnswer: "Ich komme aus Iran",
                  explanation:
                    "The verb usually takes the second position in a simple German sentence.",
                  required: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export function getPublishedSkills() {
  return sampleCourse.levels.flatMap((level) =>
    level.units.flatMap((unit) =>
      unit.skills.map((skill) => ({
        ...skill,
        levelLabel: level.label,
        unitSlug: unit.slug,
        unitTitle: unit.title
      }))
    )
  );
}

export function getPublishedSkill(skillSlug: string) {
  return getPublishedSkills().find((skill) => skill.slug === skillSlug);
}
