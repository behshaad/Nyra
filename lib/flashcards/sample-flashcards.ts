export type FlashcardDifficulty = "easy" | "medium" | "hard";

export type Flashcard = {
  id: string;
  front: string;
  back: string;
  article?: string;
  example: string;
  exampleMeaning: string;
  level: "A1" | "A2" | "B1" | "B2";
  skillSlug: string;
  skillTitle: string;
  difficulty: FlashcardDifficulty;
  pronunciation: string;
};

export const flashcards: Flashcard[] = [
  {
    id: "familie",
    front: "Familie",
    back: "خانواده",
    article: "die",
    example: "Das ist meine Familie.",
    exampleMeaning: "این خانواده من است.",
    level: "A1",
    skillSlug: "introduce-family",
    skillTitle: "خانواده را معرفی کن",
    difficulty: "easy",
    pronunciation: "fa-MEE-lee-uh"
  },
  {
    id: "bruder",
    front: "Bruder",
    back: "برادر",
    article: "der",
    example: "Das ist mein Bruder.",
    exampleMeaning: "این برادر من است.",
    level: "A1",
    skillSlug: "introduce-family",
    skillTitle: "خانواده را معرفی کن",
    difficulty: "easy",
    pronunciation: "BROO-duh"
  },
  {
    id: "heissen",
    front: "heißen",
    back: "نام داشتن",
    example: "Ich heiße Sara.",
    exampleMeaning: "اسم من سارا است.",
    level: "A1",
    skillSlug: "greet-and-say-your-name",
    skillTitle: "سلام کن و نامت را بگو",
    difficulty: "medium",
    pronunciation: "HY-sen"
  },
  {
    id: "wohnen",
    front: "wohnen",
    back: "زندگی کردن / ساکن بودن",
    example: "Ich wohne in Berlin.",
    exampleMeaning: "من در برلین زندگی می‌کنم.",
    level: "A1",
    skillSlug: "say-origin-and-home",
    skillTitle: "اهل کجا بودن و محل زندگی",
    difficulty: "medium",
    pronunciation: "VOH-nen"
  },
  {
    id: "moechte",
    front: "möchte",
    back: "می‌خواهم",
    example: "Ich möchte ein Kilo Tomaten.",
    exampleMeaning: "من یک کیلو گوجه‌فرنگی می‌خواهم.",
    level: "A1",
    skillSlug: "shop-for-food",
    skillTitle: "خرید خوراکی",
    difficulty: "hard",
    pronunciation: "MOEKH-tuh"
  },
  {
    id: "bahnhof",
    front: "Bahnhof",
    back: "ایستگاه قطار",
    article: "der",
    example: "Wo ist der Bahnhof?",
    exampleMeaning: "ایستگاه قطار کجاست؟",
    level: "A1",
    skillSlug: "ask-for-directions",
    skillTitle: "مسیر بپرس",
    difficulty: "easy",
    pronunciation: "BAHN-hohf"
  }
];
