export type SampleQuestionType =
  | "MULTIPLE_CHOICE"
  | "FILL_IN_BLANK"
  | "WORD_ORDERING";

export type SampleSkillKind = "REGULAR" | "UNIT_CHECKPOINT" | "FINAL_TEST";

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
  kind: SampleSkillKind;
  xp: number;
  passingScore?: number;
  requeueIncorrect: boolean;
  publicationStatus: "PUBLISHED";
  questions: SampleQuestion[];
};

export type SampleResource = {
  slug: string;
  title: string;
  description: string;
  type: "GRAMMAR_NOTE" | "PRONUNCIATION" | "WORKSHEET" | "EXTERNAL_LINK";
  levelLabel: string;
  content: string;
  url?: string;
  publicationStatus: "PUBLISHED";
  unitSlug?: string;
  skillSlug?: string;
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

type SkillSpec = {
  slug: string;
  title: string;
  description: string;
  focus: string;
  word: string;
  meaning: string;
  phrase: string;
  phraseMeaning: string;
  blankSentence: string;
  blankAnswer: string;
  blankChoices: string[];
  orderedWords: string[];
  grammarPoint: string;
  situation: string;
  miniText: string;
  miniAnswer: string;
};

type UnitSpec = {
  slug: string;
  title: string;
  summary: string;
  resourceFocus: string;
  skills: SkillSpec[];
};

const wrongMeanings = [
  "او امروز بیمار است.",
  "ما فردا خرید می‌کنیم.",
  "من قطار را پیدا نمی‌کنم.",
  "آن‌ها در خانه قهوه می‌نوشند.",
  "شما آخر هفته ورزش می‌کنید."
];

const wrongPhrases = [
  "Ich trinke Wasser.",
  "Wir kaufen Brot.",
  "Der Zug ist spät.",
  "Sie wohnt in Berlin.",
  "Kannst du mir helfen?"
];

const wrongGrammar = [
  "جایگاه فعل در پایان جمله است.",
  "همه اسم‌ها همیشه آرتیکل die می‌گیرند.",
  "در A1 هیچ فعلی صرف نمی‌شود.",
  "nicht همیشه قبل از فاعل می‌آید.",
  "حرف اضافه هیچ نقشی در معنی ندارد."
];

function choiceSet(correct: string, firstWrong: string, secondWrong: string) {
  return [correct, firstWrong, secondWrong];
}

function orderedSentence(words: string[]) {
  return words.join(" ");
}

function makeQuestion(
  skillSlug: string,
  order: number,
  type: SampleQuestionType,
  prompt: string,
  helper: string,
  choices: string[],
  correctAnswer: string,
  explanation: string
): SampleQuestion {
  return {
    id: `${skillSlug}-q${order}`,
    order,
    type,
    prompt,
    helper,
    choices,
    correctAnswer,
    explanation,
    required: true
  };
}

function makeSkillQuestions(spec: SkillSpec): SampleQuestion[] {
  const ordered = orderedSentence(spec.orderedWords);
  const reversed = [...spec.orderedWords].reverse().join(" ");
  const shifted = [...spec.orderedWords.slice(1), spec.orderedWords[0]].join(" ");

  return [
    makeQuestion(
      spec.slug,
      1,
      "MULTIPLE_CHOICE",
      `معنی فارسی «${spec.word}» چیست؟`,
      spec.focus,
      choiceSet(spec.meaning, wrongMeanings[0], wrongMeanings[1]),
      spec.meaning,
      `«${spec.word}» در این مهارت به معنی «${spec.meaning}» است.`
    ),
    makeQuestion(
      spec.slug,
      2,
      "MULTIPLE_CHOICE",
      `برای گفتن «${spec.phraseMeaning}» کدام جمله آلمانی مناسب است؟`,
      "کاربرد جمله",
      choiceSet(spec.phrase, wrongPhrases[0], wrongPhrases[1]),
      spec.phrase,
      `جمله‌ی «${spec.phrase}» طبیعی‌ترین انتخاب A1 برای این موقعیت است.`
    ),
    makeQuestion(
      spec.slug,
      3,
      "FILL_IN_BLANK",
      `جای خالی را کامل کنید: ${spec.blankSentence}`,
      "تکمیل جمله",
      spec.blankChoices,
      spec.blankAnswer,
      `در این جمله، پاسخ درست «${spec.blankAnswer}» است.`
    ),
    makeQuestion(
      spec.slug,
      4,
      "WORD_ORDERING",
      `ترتیب درست واژه‌ها را انتخاب کنید: ${spec.orderedWords.join(" / ")}`,
      "ترتیب جمله",
      choiceSet(ordered, reversed, shifted),
      ordered,
      "در جمله‌ی ساده‌ی آلمانی، فعل معمولا در جایگاه دوم می‌آید."
    ),
    makeQuestion(
      spec.slug,
      5,
      "MULTIPLE_CHOICE",
      `کدام گزینه به موضوع «${spec.focus}» مربوط است؟`,
      "واژگان",
      choiceSet(spec.word, "der Bahnhof", "der Apfel"),
      spec.word,
      `«${spec.word}» واژه‌ی کلیدی این مهارت است.`
    ),
    makeQuestion(
      spec.slug,
      6,
      "MULTIPLE_CHOICE",
      `نکته‌ی درست درباره‌ی «${spec.phrase}» کدام است؟`,
      "گرامر کوتاه",
      choiceSet(spec.grammarPoint, wrongGrammar[0], wrongGrammar[1]),
      spec.grammarPoint,
      spec.grammarPoint
    ),
    makeQuestion(
      spec.slug,
      7,
      "MULTIPLE_CHOICE",
      `موقعیت: ${spec.situation} چه می‌گویید؟`,
      "ارتباط روزمره",
      choiceSet(spec.phrase, wrongPhrases[2], wrongPhrases[3]),
      spec.phrase,
      `برای این موقعیت، «${spec.phrase}» پاسخ مناسب و کوتاه است.`
    ),
    makeQuestion(
      spec.slug,
      8,
      "MULTIPLE_CHOICE",
      `متن کوتاه: ${spec.miniText} کدام گزینه درست است؟`,
      "درک مطلب کوتاه",
      choiceSet(spec.miniAnswer, wrongMeanings[2], wrongMeanings[3]),
      spec.miniAnswer,
      "پاسخ درست از اطلاعات مستقیم متن کوتاه به دست می‌آید."
    )
  ];
}

function makeSkill(spec: SkillSpec): SampleSkill {
  return {
    id: spec.slug,
    slug: spec.slug,
    title: spec.title,
    description: spec.description,
    kind: "REGULAR",
    xp: 80,
    requeueIncorrect: true,
    publicationStatus: "PUBLISHED",
    questions: makeSkillQuestions(spec)
  };
}

function cloneQuestion(
  source: SampleQuestion,
  slug: string,
  order: number
): SampleQuestion {
  return {
    ...source,
    id: `${slug}-q${order}`,
    order
  };
}

function makeCheckpoint(unit: UnitSpec, skills: SampleSkill[]): SampleSkill {
  const slug = `${unit.slug}-checkpoint`;
  const questions = skills.flatMap((skill) => skill.questions.slice(0, 3)).map(
    (question, index) => cloneQuestion(question, slug, index + 1)
  );

  return {
    id: slug,
    slug,
    title: `${unit.title} checkpoint`,
    description: `Check your A1 control of ${unit.resourceFocus}.`,
    kind: "UNIT_CHECKPOINT",
    xp: 120,
    passingScore: 70,
    requeueIncorrect: false,
    publicationStatus: "PUBLISHED",
    questions
  };
}

const unitSpecs: UnitSpec[] = [
  {
    slug: "a1-first-contacts",
    title: "First contacts",
    summary: "Greet people, introduce yourself, spell simple words, and share languages.",
    resourceFocus: "greetings, names, countries, and languages",
    skills: [
      {
        slug: "greet-and-say-your-name",
        title: "Greet and say your name",
        description: "Use formal and informal greetings and introduce yourself.",
        focus: "greetings",
        word: "Hallo",
        meaning: "سلام",
        phrase: "Ich heiße Sara.",
        phraseMeaning: "اسم من سارا است",
        blankSentence: "Ich ___ Sara.",
        blankAnswer: "heiße",
        blankChoices: ["heiße", "heißt", "heißen"],
        orderedWords: ["Ich", "heiße", "Sara"],
        grammarPoint: "فعل heiße با ich صرف شده است.",
        situation: "در کلاس آلمانی می‌خواهید خودتان را معرفی کنید.",
        miniText: "Sara sagt: Ich heiße Sara. Ich komme aus Iran.",
        miniAnswer: "اسم او سارا است."
      },
      {
        slug: "ask-for-a-name",
        title: "Ask for a name",
        description: "Ask someone's name with du and Sie.",
        focus: "names",
        word: "Name",
        meaning: "نام",
        phrase: "Wie heißen Sie?",
        phraseMeaning: "نام شما چیست؟",
        blankSentence: "Wie ___ du?",
        blankAnswer: "heißt",
        blankChoices: ["heiße", "heißt", "heißen"],
        orderedWords: ["Wie", "heißt", "du"],
        grammarPoint: "برای du فعل به صورت heißt می‌آید.",
        situation: "با یک همکلاسی هم‌سن صحبت می‌کنید.",
        miniText: "Ali fragt: Wie heißt du? Nina antwortet: Ich heiße Nina.",
        miniAnswer: "نینا نام خودش را می‌گوید."
      },
      {
        slug: "say-origin-and-home",
        title: "Say origin and home",
        description: "Say where you come from and where you live.",
        focus: "origin",
        word: "Iran",
        meaning: "ایران",
        phrase: "Ich komme aus Iran.",
        phraseMeaning: "من اهل ایران هستم",
        blankSentence: "Ich komme ___ Iran.",
        blankAnswer: "aus",
        blankChoices: ["aus", "in", "und"],
        orderedWords: ["Ich", "komme", "aus", "Iran"],
        grammarPoint: "برای کشور مبدأ معمولا از aus استفاده می‌شود.",
        situation: "کسی می‌پرسد اهل کجا هستید.",
        miniText: "Mina kommt aus Iran. Sie wohnt in Berlin.",
        miniAnswer: "مینا اهل ایران است."
      },
      {
        slug: "share-languages-and-contact",
        title: "Share languages and contact",
        description: "Talk about languages, phone numbers, and email addresses.",
        focus: "languages",
        word: "Deutsch",
        meaning: "آلمانی",
        phrase: "Ich spreche Deutsch.",
        phraseMeaning: "من آلمانی صحبت می‌کنم",
        blankSentence: "Ich ___ Deutsch und Persisch.",
        blankAnswer: "spreche",
        blankChoices: ["spreche", "spricht", "sprechen"],
        orderedWords: ["Ich", "spreche", "Deutsch"],
        grammarPoint: "sprechen با ich به صورت spreche می‌آید.",
        situation: "می‌خواهید زبان‌هایی را که بلد هستید بگویید.",
        miniText: "Reza spricht Persisch, Deutsch und Englisch.",
        miniAnswer: "رضا سه زبان صحبت می‌کند."
      }
    ]
  },
  {
    slug: "a1-people-and-family",
    title: "People and family",
    summary: "Talk about wellbeing, farewells, family members, friends, and age.",
    resourceFocus: "people, family, friends, and age",
    skills: [
      {
        slug: "ask-how-someone-is",
        title: "Ask how someone is",
        description: "Ask and answer simple wellbeing questions.",
        focus: "wellbeing",
        word: "gut",
        meaning: "خوب",
        phrase: "Wie geht es dir?",
        phraseMeaning: "حالت چطور است؟",
        blankSentence: "Mir geht es ___.",
        blankAnswer: "gut",
        blankChoices: ["gut", "Name", "aus"],
        orderedWords: ["Mir", "geht", "es", "gut"],
        grammarPoint: "عبارت Mir geht es gut یک جواب ثابت و کاربردی است.",
        situation: "از دوستتان می‌پرسید حالش چطور است.",
        miniText: "Nina sagt: Mir geht es gut. Danke.",
        miniAnswer: "حال نینا خوب است."
      },
      {
        slug: "say-goodbye-politely",
        title: "Say goodbye politely",
        description: "Use common farewells in everyday situations.",
        focus: "farewells",
        word: "Tschüss",
        meaning: "خداحافظ",
        phrase: "Auf Wiedersehen!",
        phraseMeaning: "خداحافظ به شکل رسمی",
        blankSentence: "___ Wiedersehen!",
        blankAnswer: "Auf",
        blankChoices: ["Auf", "Aus", "Ich"],
        orderedWords: ["Auf", "Wiedersehen"],
        grammarPoint: "Auf Wiedersehen رسمی‌تر از Tschüss است.",
        situation: "از معلم یا کارمند اداره خداحافظی می‌کنید.",
        miniText: "Herr Braun sagt: Auf Wiedersehen, Frau Karimi.",
        miniAnswer: "خداحافظی رسمی است."
      },
      {
        slug: "introduce-family",
        title: "Introduce family",
        description: "Name family members and use simple possessives.",
        focus: "family",
        word: "Bruder",
        meaning: "برادر",
        phrase: "Das ist mein Bruder.",
        phraseMeaning: "این برادر من است",
        blankSentence: "Das ist ___ Bruder.",
        blankAnswer: "mein",
        blankChoices: ["mein", "meine", "deine"],
        orderedWords: ["Das", "ist", "mein", "Bruder"],
        grammarPoint: "Bruder مذکر است و در اینجا mein می‌آید.",
        situation: "عکس خانواده را نشان می‌دهید.",
        miniText: "Das ist mein Bruder. Er heißt Amir.",
        miniAnswer: "امیر برادر گوینده است."
      },
      {
        slug: "talk-about-friends-and-age",
        title: "Talk about friends and age",
        description: "Say who your friends are and ask about age.",
        focus: "friends",
        word: "Freundin",
        meaning: "دوست دختر / دوست مؤنث",
        phrase: "Meine Freundin ist zwanzig.",
        phraseMeaning: "دوست من بیست ساله است",
        blankSentence: "Wie alt ___ du?",
        blankAnswer: "bist",
        blankChoices: ["bist", "bin", "ist"],
        orderedWords: ["Wie", "alt", "bist", "du"],
        grammarPoint: "برای پرسیدن سن از Wie alt استفاده می‌شود.",
        situation: "سن یک همکلاسی را می‌پرسید.",
        miniText: "Lena ist 20 Jahre alt. Sie ist meine Freundin.",
        miniAnswer: "لنا بیست ساله است."
      }
    ]
  },
  {
    slug: "a1-food-and-drink",
    title: "Food and drink",
    summary: "Name food, say preferences, order breakfast, and shop with quantities.",
    resourceFocus: "food, drink, quantities, prices, and requests",
    skills: [
      {
        slug: "name-fruit-and-vegetables",
        title: "Name fruit and vegetables",
        description: "Ask what foods are called and spell useful items.",
        focus: "food names",
        word: "Apfel",
        meaning: "سیب",
        phrase: "Wie heißt das auf Deutsch?",
        phraseMeaning: "این به آلمانی چه می‌شود؟",
        blankSentence: "Der ___ ist rot.",
        blankAnswer: "Apfel",
        blankChoices: ["Apfel", "Kaffee", "Zug"],
        orderedWords: ["Der", "Apfel", "ist", "rot"],
        grammarPoint: "Apfel در این جمله با der آمده است.",
        situation: "اسم یک میوه را به آلمانی نمی‌دانید.",
        miniText: "Der Apfel ist rot. Die Banane ist gelb.",
        miniAnswer: "سیب قرمز است."
      },
      {
        slug: "say-food-preferences",
        title: "Say food preferences",
        description: "Say what you like to eat and drink.",
        focus: "preferences",
        word: "gern",
        meaning: "با میل / دوست داشتن در جمله",
        phrase: "Ich esse gern Reis.",
        phraseMeaning: "من برنج دوست دارم",
        blankSentence: "Ich trinke ___ Tee.",
        blankAnswer: "gern",
        blankChoices: ["gern", "kein", "aus"],
        orderedWords: ["Ich", "esse", "gern", "Reis"],
        grammarPoint: "gern بعد از فعل، علاقه را نشان می‌دهد.",
        situation: "می‌خواهید غذای مورد علاقه‌تان را بگویید.",
        miniText: "Omid isst gern Reis und trinkt gern Tee.",
        miniAnswer: "امید چای دوست دارد."
      },
      {
        slug: "plan-breakfast",
        title: "Plan breakfast",
        description: "Talk about breakfast food and drink.",
        focus: "breakfast",
        word: "Frühstück",
        meaning: "صبحانه",
        phrase: "Zum Frühstück trinke ich Kaffee.",
        phraseMeaning: "برای صبحانه قهوه می‌نوشم",
        blankSentence: "Zum Frühstück ___ ich Kaffee.",
        blankAnswer: "trinke",
        blankChoices: ["trinke", "trinkt", "trinken"],
        orderedWords: ["Ich", "trinke", "Kaffee"],
        grammarPoint: "trinken با ich به صورت trinke می‌آید.",
        situation: "در مورد صبحانه‌ی معمول خودتان حرف می‌زنید.",
        miniText: "Sara isst Brot und trinkt Kaffee zum Frühstück.",
        miniAnswer: "سارا برای صبحانه قهوه می‌نوشد."
      },
      {
        slug: "shop-for-food",
        title: "Shop for food",
        description: "Ask for food, prices, and quantities.",
        focus: "shopping",
        word: "Kilo",
        meaning: "کیلو",
        phrase: "Ich möchte ein Kilo Tomaten.",
        phraseMeaning: "من یک کیلو گوجه‌فرنگی می‌خواهم",
        blankSentence: "Ich ___ ein Kilo Tomaten.",
        blankAnswer: "möchte",
        blankChoices: ["möchte", "möchtest", "möchten"],
        orderedWords: ["Ich", "möchte", "ein", "Kilo", "Tomaten"],
        grammarPoint: "möchte یک درخواست مودبانه و ساده می‌سازد.",
        situation: "در فروشگاه مواد غذایی سفارش می‌دهید.",
        miniText: "Ali kauft ein Kilo Tomaten. Das kostet drei Euro.",
        miniAnswer: "علی یک کیلو گوجه می‌خرد."
      }
    ]
  },
  {
    slug: "a1-my-life",
    title: "My life",
    summary: "Talk about work, time, contact details, daily routines, and devices.",
    resourceFocus: "jobs, time, contact details, routines, and devices",
    skills: [
      {
        slug: "talk-about-job-and-time",
        title: "Talk about job and time",
        description: "Say your job and ask the time.",
        focus: "jobs and time",
        word: "Uhr",
        meaning: "ساعت",
        phrase: "Ich bin Ingenieur.",
        phraseMeaning: "من مهندس هستم",
        blankSentence: "Es ist acht ___.",
        blankAnswer: "Uhr",
        blankChoices: ["Uhr", "Tag", "Haus"],
        orderedWords: ["Ich", "bin", "Ingenieur"],
        grammarPoint: "برای شغل با ich از bin استفاده می‌شود.",
        situation: "خودتان و شغلتان را معرفی می‌کنید.",
        miniText: "Reza ist Ingenieur. Er arbeitet um acht Uhr.",
        miniAnswer: "رضا مهندس است."
      },
      {
        slug: "give-contact-details",
        title: "Give contact details",
        description: "Say address, phone number, and email slowly.",
        focus: "contact details",
        word: "Adresse",
        meaning: "آدرس",
        phrase: "Meine Adresse ist kurz.",
        phraseMeaning: "آدرس من کوتاه است",
        blankSentence: "Meine ___ ist neu.",
        blankAnswer: "Adresse",
        blankChoices: ["Adresse", "Banane", "Freizeit"],
        orderedWords: ["Meine", "Adresse", "ist", "neu"],
        grammarPoint: "Adresse مؤنث است و با meine می‌آید.",
        situation: "فرم ساده‌ی ثبت‌نام را کامل می‌کنید.",
        miniText: "Mina sagt ihre Telefonnummer langsam.",
        miniAnswer: "مینا شماره تلفن را آرام می‌گوید."
      },
      {
        slug: "describe-a-daily-routine",
        title: "Describe a daily routine",
        description: "Say what you do during the day.",
        focus: "daily routine",
        word: "Morgen",
        meaning: "صبح",
        phrase: "Am Morgen lerne ich Deutsch.",
        phraseMeaning: "صبح آلمانی می‌خوانم",
        blankSentence: "Am Morgen ___ ich Deutsch.",
        blankAnswer: "lerne",
        blankChoices: ["lerne", "lernt", "lernen"],
        orderedWords: ["Am", "Morgen", "lerne", "ich", "Deutsch"],
        grammarPoint: "وقتی زمان اول جمله می‌آید، فعل جایگاه دوم را حفظ می‌کند.",
        situation: "برنامه‌ی روزانه‌تان را توضیح می‌دهید.",
        miniText: "Am Morgen lernt Sara Deutsch. Am Abend kocht sie.",
        miniAnswer: "سارا صبح آلمانی می‌خواند."
      },
      {
        slug: "talk-about-devices",
        title: "Talk about devices",
        description: "Say which devices you have and need.",
        focus: "devices",
        word: "Handy",
        meaning: "موبایل",
        phrase: "Ich brauche mein Handy.",
        phraseMeaning: "من به موبایلم نیاز دارم",
        blankSentence: "Ich ___ mein Handy.",
        blankAnswer: "brauche",
        blankChoices: ["brauche", "brauchst", "braucht"],
        orderedWords: ["Ich", "brauche", "mein", "Handy"],
        grammarPoint: "brauchen با ich به صورت brauche می‌آید.",
        situation: "می‌گویید برای کار یا کلاس چه وسیله‌ای لازم دارید.",
        miniText: "Omid hat ein Handy und einen Laptop.",
        miniAnswer: "امید موبایل و لپ‌تاپ دارد."
      }
    ]
  },
  {
    slug: "a1-free-time",
    title: "Free time",
    summary: "Talk about hobbies, likes, weekends, obligations, and stress.",
    resourceFocus: "hobbies, weekend plans, and obligations",
    skills: [
      {
        slug: "name-hobbies",
        title: "Name hobbies",
        description: "Say which hobbies you have.",
        focus: "hobbies",
        word: "Hobby",
        meaning: "سرگرمی",
        phrase: "Mein Hobby ist Musik.",
        phraseMeaning: "سرگرمی من موسیقی است",
        blankSentence: "Mein ___ ist Musik.",
        blankAnswer: "Hobby",
        blankChoices: ["Hobby", "Bahnhof", "Arzt"],
        orderedWords: ["Mein", "Hobby", "ist", "Musik"],
        grammarPoint: "Hobby خنثی است، اما در این جمله mein ثابت می‌ماند.",
        situation: "در کلاس درباره‌ی سرگرمی‌ها حرف می‌زنید.",
        miniText: "Leila hört gern Musik. Musik ist ihr Hobby.",
        miniAnswer: "سرگرمی لیلا موسیقی است."
      },
      {
        slug: "say-what-you-like-doing",
        title: "Say what you like doing",
        description: "Talk about activities you enjoy.",
        focus: "likes",
        word: "spielen",
        meaning: "بازی کردن / نواختن",
        phrase: "Ich spiele gern Fußball.",
        phraseMeaning: "من فوتبال بازی کردن را دوست دارم",
        blankSentence: "Ich ___ gern Fußball.",
        blankAnswer: "spiele",
        blankChoices: ["spiele", "spielst", "spielt"],
        orderedWords: ["Ich", "spiele", "gern", "Fußball"],
        grammarPoint: "gern علاقه را نشان می‌دهد و بعد از فعل می‌آید.",
        situation: "می‌گویید در وقت آزاد چه کاری دوست دارید.",
        miniText: "Ali spielt gern Fußball, aber er schwimmt nicht gern.",
        miniAnswer: "علی فوتبال را دوست دارد."
      },
      {
        slug: "talk-about-weekends",
        title: "Talk about weekends",
        description: "Say what you can do on the weekend.",
        focus: "weekend",
        word: "Wochenende",
        meaning: "آخر هفته",
        phrase: "Am Wochenende besuche ich Freunde.",
        phraseMeaning: "آخر هفته دوستانم را می‌بینم",
        blankSentence: "Am Wochenende ___ ich Freunde.",
        blankAnswer: "besuche",
        blankChoices: ["besuche", "besucht", "besuchen"],
        orderedWords: ["Am", "Wochenende", "besuche", "ich", "Freunde"],
        grammarPoint: "عبارت زمانی اول جمله می‌تواند بیاید و فعل جایگاه دوم می‌ماند.",
        situation: "برنامه‌ی آخر هفته را توضیح می‌دهید.",
        miniText: "Mina besucht am Wochenende ihre Familie.",
        miniAnswer: "مینا آخر هفته خانواده‌اش را می‌بیند."
      },
      {
        slug: "talk-about-obligations",
        title: "Talk about obligations",
        description: "Say what you must do and what creates stress.",
        focus: "obligations",
        word: "müssen",
        meaning: "مجبور بودن / باید",
        phrase: "Ich muss heute lernen.",
        phraseMeaning: "من امروز باید درس بخوانم",
        blankSentence: "Ich ___ heute lernen.",
        blankAnswer: "muss",
        blankChoices: ["muss", "musst", "müssen"],
        orderedWords: ["Ich", "muss", "heute", "lernen"],
        grammarPoint: "بعد از فعل مودال، فعل اصلی به صورت مصدر می‌آید.",
        situation: "می‌گویید امروز چه کاری باید انجام دهید.",
        miniText: "Reza muss arbeiten. Das ist Stress.",
        miniAnswer: "رضا باید کار کند."
      }
    ]
  },
  {
    slug: "a1-city-and-home",
    title: "City and home",
    summary: "Describe where you live, places in town, rooms, furniture, and opinions.",
    resourceFocus: "places, housing, rooms, and opinions",
    skills: [
      {
        slug: "say-where-you-live",
        title: "Say where you live",
        description: "Say whether you live in a city, village, or country.",
        focus: "home place",
        word: "Stadt",
        meaning: "شهر",
        phrase: "Ich wohne in der Stadt.",
        phraseMeaning: "من در شهر زندگی می‌کنم",
        blankSentence: "Ich wohne in der ___.",
        blankAnswer: "Stadt",
        blankChoices: ["Stadt", "Milch", "Nummer"],
        orderedWords: ["Ich", "wohne", "in", "der", "Stadt"],
        grammarPoint: "wohnen با ich به صورت wohne می‌آید.",
        situation: "محل زندگی خود را معرفی می‌کنید.",
        miniText: "Sara wohnt in der Stadt. Die Stadt ist groß.",
        miniAnswer: "سارا در شهر زندگی می‌کند."
      },
      {
        slug: "describe-your-town",
        title: "Describe your town",
        description: "Say what a place offers and give a simple opinion.",
        focus: "town description",
        word: "schön",
        meaning: "زیبا",
        phrase: "Meine Stadt ist schön.",
        phraseMeaning: "شهر من زیباست",
        blankSentence: "Meine Stadt ___ schön.",
        blankAnswer: "ist",
        blankChoices: ["ist", "bin", "bist"],
        orderedWords: ["Meine", "Stadt", "ist", "schön"],
        grammarPoint: "برای Stadt از فعل ist استفاده می‌شود.",
        situation: "نظر ساده‌ای درباره‌ی شهر خود می‌دهید.",
        miniText: "Die Stadt ist klein, aber sehr schön.",
        miniAnswer: "شهر کوچک اما زیباست."
      },
      {
        slug: "name-rooms-and-furniture",
        title: "Name rooms and furniture",
        description: "Name common rooms and objects at home.",
        focus: "rooms",
        word: "Zimmer",
        meaning: "اتاق",
        phrase: "Das Zimmer ist hell.",
        phraseMeaning: "اتاق روشن است",
        blankSentence: "Das ___ ist hell.",
        blankAnswer: "Zimmer",
        blankChoices: ["Zimmer", "Brot", "Sport"],
        orderedWords: ["Das", "Zimmer", "ist", "hell"],
        grammarPoint: "Zimmer خنثی است و با das می‌آید.",
        situation: "اتاق خودتان را توصیف می‌کنید.",
        miniText: "Das Zimmer ist hell. Der Tisch ist klein.",
        miniAnswer: "اتاق روشن است."
      },
      {
        slug: "describe-your-flat",
        title: "Describe your flat",
        description: "Talk about your flat or house.",
        focus: "housing",
        word: "Wohnung",
        meaning: "آپارتمان",
        phrase: "Meine Wohnung hat zwei Zimmer.",
        phraseMeaning: "آپارتمان من دو اتاق دارد",
        blankSentence: "Meine Wohnung ___ zwei Zimmer.",
        blankAnswer: "hat",
        blankChoices: ["hat", "habe", "haben"],
        orderedWords: ["Meine", "Wohnung", "hat", "zwei", "Zimmer"],
        grammarPoint: "Wohnung سوم‌شخص مفرد است و با hat می‌آید.",
        situation: "خانه‌تان را برای یک دوست توضیح می‌دهید.",
        miniText: "Omid hat eine Wohnung. Sie hat zwei Zimmer.",
        miniAnswer: "آپارتمان امید دو اتاق دارد."
      }
    ]
  },
  {
    slug: "a1-weather-and-dates",
    title: "Weather and dates",
    summary: "Talk about weather, months, birthdays, places, and simple biography.",
    resourceFocus: "weather, months, dates, birthplaces, and biography",
    skills: [
      {
        slug: "talk-about-weather",
        title: "Talk about weather",
        description: "Understand and say simple weather information.",
        focus: "weather",
        word: "sonnig",
        meaning: "آفتابی",
        phrase: "Heute ist es sonnig.",
        phraseMeaning: "امروز هوا آفتابی است",
        blankSentence: "Heute ist es ___.",
        blankAnswer: "sonnig",
        blankChoices: ["sonnig", "zwanzig", "krank"],
        orderedWords: ["Heute", "ist", "es", "sonnig"],
        grammarPoint: "برای آب‌وهوا اغلب از es ist استفاده می‌شود.",
        situation: "وضعیت هوای امروز را می‌گویید.",
        miniText: "Heute ist es sonnig und warm.",
        miniAnswer: "امروز هوا آفتابی است."
      },
      {
        slug: "name-months-and-seasons",
        title: "Name months and seasons",
        description: "Talk about months and favorite times of year.",
        focus: "months",
        word: "Januar",
        meaning: "ژانویه",
        phrase: "Mein Lieblingsmonat ist Mai.",
        phraseMeaning: "ماه مورد علاقه‌ی من مه است",
        blankSentence: "Mein Lieblingsmonat ___ Mai.",
        blankAnswer: "ist",
        blankChoices: ["ist", "bin", "sind"],
        orderedWords: ["Mein", "Lieblingsmonat", "ist", "Mai"],
        grammarPoint: "Lieblingsmonat مفرد است و با ist می‌آید.",
        situation: "درباره‌ی ماه مورد علاقه‌تان صحبت می‌کنید.",
        miniText: "Leila mag Mai. Mai ist ihr Lieblingsmonat.",
        miniAnswer: "ماه مورد علاقه‌ی لیلا مه است."
      },
      {
        slug: "say-birthplace-and-birthday",
        title: "Say birthplace and birthday",
        description: "Ask and answer where and when someone was born.",
        focus: "personal dates",
        word: "geboren",
        meaning: "متولد",
        phrase: "Ich bin in Teheran geboren.",
        phraseMeaning: "من در تهران متولد شده‌ام",
        blankSentence: "Ich bin in Teheran ___.",
        blankAnswer: "geboren",
        blankChoices: ["geboren", "getrunken", "gekauft"],
        orderedWords: ["Ich", "bin", "in", "Teheran", "geboren"],
        grammarPoint: "برای محل تولد می‌توان از in استفاده کرد.",
        situation: "اطلاعات شخصی ساده می‌دهید.",
        miniText: "Ali ist in Shiraz geboren. Sein Geburtstag ist im Juni.",
        miniAnswer: "علی در شیراز متولد شده است."
      },
      {
        slug: "write-a-simple-biography",
        title: "Write a simple biography",
        description: "Combine name, age, origin, job, and hobby.",
        focus: "biography",
        word: "Lebenslauf",
        meaning: "رزومه / شرح حال",
        phrase: "Ich arbeite als Lehrer.",
        phraseMeaning: "من به عنوان معلم کار می‌کنم",
        blankSentence: "Ich arbeite ___ Lehrer.",
        blankAnswer: "als",
        blankChoices: ["als", "aus", "um"],
        orderedWords: ["Ich", "arbeite", "als", "Lehrer"],
        grammarPoint: "برای نقش یا شغل از als استفاده می‌شود.",
        situation: "یک شرح حال کوتاه می‌نویسید.",
        miniText: "Reza ist 30. Er arbeitet als Lehrer und wohnt in Hamburg.",
        miniAnswer: "رضا معلم است."
      }
    ]
  },
  {
    slug: "a1-getting-around",
    title: "Getting around",
    summary: "Use transport words, compare options, read timetables, and ask for directions.",
    resourceFocus: "transport, timetables, directions, and places",
    skills: [
      {
        slug: "name-transport",
        title: "Name transport",
        description: "Name transport options and say how you travel.",
        focus: "transport",
        word: "Bus",
        meaning: "اتوبوس",
        phrase: "Ich fahre mit dem Bus.",
        phraseMeaning: "من با اتوبوس می‌روم",
        blankSentence: "Ich fahre mit dem ___.",
        blankAnswer: "Bus",
        blankChoices: ["Bus", "Brot", "Arzt"],
        orderedWords: ["Ich", "fahre", "mit", "dem", "Bus"],
        grammarPoint: "بعد از mit معمولا داتیو می‌آید.",
        situation: "می‌گویید چطور به کلاس می‌روید.",
        miniText: "Mina fährt mit dem Bus zur Arbeit.",
        miniAnswer: "مینا با اتوبوس می‌رود."
      },
      {
        slug: "compare-transport",
        title: "Compare transport",
        description: "Say simple advantages and disadvantages.",
        focus: "comparison",
        word: "schnell",
        meaning: "سریع",
        phrase: "Die U-Bahn ist schnell.",
        phraseMeaning: "مترو سریع است",
        blankSentence: "Die U-Bahn ___ schnell.",
        blankAnswer: "ist",
        blankChoices: ["ist", "bin", "bist"],
        orderedWords: ["Die", "U-Bahn", "ist", "schnell"],
        grammarPoint: "U-Bahn مؤنث است، اما فعل همچنان ist است.",
        situation: "وسیله‌ی نقلیه‌ی محبوبتان را توضیح می‌دهید.",
        miniText: "Die U-Bahn ist schnell, aber das Auto ist teuer.",
        miniAnswer: "مترو سریع است."
      },
      {
        slug: "read-simple-timetables",
        title: "Read simple timetables",
        description: "Understand times and basic travel information.",
        focus: "timetables",
        word: "Zug",
        meaning: "قطار",
        phrase: "Der Zug fährt um neun Uhr.",
        phraseMeaning: "قطار ساعت نه حرکت می‌کند",
        blankSentence: "Der Zug fährt ___ neun Uhr.",
        blankAnswer: "um",
        blankChoices: ["um", "aus", "mit"],
        orderedWords: ["Der", "Zug", "fährt", "um", "neun", "Uhr"],
        grammarPoint: "برای ساعت دقیق از um استفاده می‌شود.",
        situation: "زمان حرکت قطار را می‌خوانید.",
        miniText: "Der Zug fährt um neun Uhr. Der Bus fährt um zehn Uhr.",
        miniAnswer: "قطار ساعت نه حرکت می‌کند."
      },
      {
        slug: "ask-for-directions",
        title: "Ask for directions",
        description: "Ask where something is and follow simple directions.",
        focus: "directions",
        word: "Bahnhof",
        meaning: "ایستگاه قطار",
        phrase: "Wo ist der Bahnhof?",
        phraseMeaning: "ایستگاه قطار کجاست؟",
        blankSentence: "Wo ist der ___?",
        blankAnswer: "Bahnhof",
        blankChoices: ["Bahnhof", "Kaffee", "Monat"],
        orderedWords: ["Wo", "ist", "der", "Bahnhof"],
        grammarPoint: "پرسش‌های Wo برای مکان استفاده می‌شوند.",
        situation: "در شهر دنبال ایستگاه قطار هستید.",
        miniText: "Der Bahnhof ist links. Die Bank ist rechts.",
        miniAnswer: "ایستگاه قطار سمت چپ است."
      }
    ]
  },
  {
    slug: "a1-with-friends",
    title: "With friends",
    summary: "Make plans, react to invitations, order in a restaurant, and hold small talk.",
    resourceFocus: "invitations, restaurants, parties, and reasons",
    skills: [
      {
        slug: "make-plans",
        title: "Make plans",
        description: "Ask whether someone has time and suggest an activity.",
        focus: "plans",
        word: "Zeit",
        meaning: "وقت",
        phrase: "Hast du am Samstag Zeit?",
        phraseMeaning: "شنبه وقت داری؟",
        blankSentence: "Hast du am Samstag ___?",
        blankAnswer: "Zeit",
        blankChoices: ["Zeit", "Brot", "Zimmer"],
        orderedWords: ["Hast", "du", "am", "Samstag", "Zeit"],
        grammarPoint: "در پرسش بله/خیر، فعل در ابتدای جمله می‌آید.",
        situation: "دوستی را برای آخر هفته دعوت می‌کنید.",
        miniText: "Ali fragt: Hast du Zeit? Sara sagt: Ja, gern.",
        miniAnswer: "سارا قبول می‌کند."
      },
      {
        slug: "react-to-suggestions",
        title: "React to suggestions",
        description: "Accept, decline, and give a simple reason.",
        focus: "reactions",
        word: "leider",
        meaning: "متأسفانه",
        phrase: "Leider kann ich nicht.",
        phraseMeaning: "متأسفانه نمی‌توانم",
        blankSentence: "Leider ___ ich nicht.",
        blankAnswer: "kann",
        blankChoices: ["kann", "kannst", "können"],
        orderedWords: ["Leider", "kann", "ich", "nicht"],
        grammarPoint: "بعد از kann، فعل اصلی می‌تواند حذف شود اگر از متن معلوم باشد.",
        situation: "دعوتی را مودبانه رد می‌کنید.",
        miniText: "Mina kann nicht kommen. Sie muss arbeiten.",
        miniAnswer: "مینا باید کار کند."
      },
      {
        slug: "order-at-a-restaurant",
        title: "Order at a restaurant",
        description: "Order food and drink politely.",
        focus: "restaurant",
        word: "Speisekarte",
        meaning: "منوی غذا",
        phrase: "Ich nehme eine Suppe.",
        phraseMeaning: "من یک سوپ می‌گیرم",
        blankSentence: "Ich ___ eine Suppe.",
        blankAnswer: "nehme",
        blankChoices: ["nehme", "nimmt", "nehmen"],
        orderedWords: ["Ich", "nehme", "eine", "Suppe"],
        grammarPoint: "nehmen با ich به صورت nehme می‌آید.",
        situation: "در رستوران سفارش می‌دهید.",
        miniText: "Reza nimmt eine Suppe und ein Wasser.",
        miniAnswer: "رضا سوپ سفارش می‌دهد."
      },
      {
        slug: "make-party-small-talk",
        title: "Make party small talk",
        description: "Start and keep a simple party conversation.",
        focus: "small talk",
        word: "Party",
        meaning: "مهمانی",
        phrase: "Kennst du viele Leute hier?",
        phraseMeaning: "اینجا افراد زیادی را می‌شناسی؟",
        blankSentence: "Kennst du viele ___ hier?",
        blankAnswer: "Leute",
        blankChoices: ["Leute", "Äpfel", "Züge"],
        orderedWords: ["Kennst", "du", "viele", "Leute", "hier"],
        grammarPoint: "در پرسش بله/خیر، فعل اول می‌آید.",
        situation: "در مهمانی می‌خواهید گفتگو را شروع کنید.",
        miniText: "Lena ist auf einer Party. Sie kennt zwei Leute.",
        miniAnswer: "لنا دو نفر را می‌شناسد."
      }
    ]
  },
  {
    slug: "a1-travel-and-past",
    title: "Travel and past",
    summary: "Talk about seasons, travel wishes, German-speaking countries, hotels, and past trips.",
    resourceFocus: "travel, seasons, countries, hotels, and first past forms",
    skills: [
      {
        slug: "talk-about-seasons-and-travel-wishes",
        title: "Talk about travel wishes",
        description: "Say when and where you want to travel.",
        focus: "travel wishes",
        word: "Sommer",
        meaning: "تابستان",
        phrase: "Ich möchte im Sommer reisen.",
        phraseMeaning: "من می‌خواهم تابستان سفر کنم",
        blankSentence: "Ich möchte im Sommer ___.",
        blankAnswer: "reisen",
        blankChoices: ["reisen", "trinkt", "geboren"],
        orderedWords: ["Ich", "möchte", "im", "Sommer", "reisen"],
        grammarPoint: "بعد از möchte فعل اصلی به صورت مصدر می‌آید.",
        situation: "از برنامه‌ی سفر دلخواهتان می‌گویید.",
        miniText: "Sara möchte im Sommer nach Österreich reisen.",
        miniAnswer: "سارا می‌خواهد تابستان سفر کند."
      },
      {
        slug: "understand-country-facts",
        title: "Understand country facts",
        description: "Ask and answer simple facts about German-speaking countries.",
        focus: "countries",
        word: "Österreich",
        meaning: "اتریش",
        phrase: "Wien ist in Österreich.",
        phraseMeaning: "وین در اتریش است",
        blankSentence: "Wien ist in ___.",
        blankAnswer: "Österreich",
        blankChoices: ["Österreich", "Kaffee", "Freitag"],
        orderedWords: ["Wien", "ist", "in", "Österreich"],
        grammarPoint: "برای شهر و کشور از in استفاده می‌شود.",
        situation: "یک واقعیت ساده درباره‌ی کشورها می‌گویید.",
        miniText: "Wien ist die Hauptstadt von Österreich.",
        miniAnswer: "وین پایتخت اتریش است."
      },
      {
        slug: "book-simple-accommodation",
        title: "Book simple accommodation",
        description: "Talk about hotels and holiday accommodation.",
        focus: "hotel",
        word: "Hotel",
        meaning: "هتل",
        phrase: "Ich suche ein Zimmer.",
        phraseMeaning: "من دنبال یک اتاق هستم",
        blankSentence: "Ich suche ein ___.",
        blankAnswer: "Zimmer",
        blankChoices: ["Zimmer", "Apfel", "Sport"],
        orderedWords: ["Ich", "suche", "ein", "Zimmer"],
        grammarPoint: "Zimmer خنثی است و با ein می‌آید.",
        situation: "برای سفر دنبال اتاق هستید.",
        miniText: "Omid sucht ein Zimmer im Hotel.",
        miniAnswer: "امید دنبال اتاق است."
      },
      {
        slug: "talk-about-a-past-trip",
        title: "Talk about a past trip",
        description: "Say where you were and what you did yesterday or on holiday.",
        focus: "past trip",
        word: "gestern",
        meaning: "دیروز",
        phrase: "Ich war gestern in Berlin.",
        phraseMeaning: "من دیروز در برلین بودم",
        blankSentence: "Ich ___ gestern in Berlin.",
        blankAnswer: "war",
        blankChoices: ["war", "bin", "habe"],
        orderedWords: ["Ich", "war", "gestern", "in", "Berlin"],
        grammarPoint: "war گذشته‌ی ساده‌ی sein برای ich است.",
        situation: "از سفر کوتاه دیروز حرف می‌زنید.",
        miniText: "Mina war gestern in Berlin. Sie hat Fotos gemacht.",
        miniAnswer: "مینا دیروز در برلین بود."
      }
    ]
  },
  {
    slug: "a1-sport-and-health",
    title: "Sport and health",
    summary: "Talk about body parts, sports, preferences, fitness instructions, and illness.",
    resourceFocus: "body, sport, fitness, illness, and doctor visits",
    skills: [
      {
        slug: "name-body-parts",
        title: "Name body parts",
        description: "Name basic body parts and say what hurts.",
        focus: "body",
        word: "Kopf",
        meaning: "سر",
        phrase: "Mein Kopf tut weh.",
        phraseMeaning: "سرم درد می‌کند",
        blankSentence: "Mein Kopf tut ___.",
        blankAnswer: "weh",
        blankChoices: ["weh", "gern", "aus"],
        orderedWords: ["Mein", "Kopf", "tut", "weh"],
        grammarPoint: "عبارت tut weh برای درد استفاده می‌شود.",
        situation: "در مطب پزشک از درد می‌گویید.",
        miniText: "Ali sagt: Mein Kopf tut weh.",
        miniAnswer: "سر علی درد می‌کند."
      },
      {
        slug: "talk-about-favorite-sport",
        title: "Talk about favorite sport",
        description: "Say what sport you like and what you do not like.",
        focus: "sport",
        word: "Sport",
        meaning: "ورزش",
        phrase: "Ich mag Tennis.",
        phraseMeaning: "من تنیس را دوست دارم",
        blankSentence: "Ich ___ Tennis.",
        blankAnswer: "mag",
        blankChoices: ["mag", "möchte", "muss"],
        orderedWords: ["Ich", "mag", "Tennis"],
        grammarPoint: "mögen با ich به صورت mag می‌آید.",
        situation: "ورزش مورد علاقه‌تان را می‌گویید.",
        miniText: "Sara mag Tennis, aber sie mag Fußball nicht.",
        miniAnswer: "سارا تنیس را دوست دارد."
      },
      {
        slug: "understand-fitness-instructions",
        title: "Understand fitness instructions",
        description: "Follow simple exercise instructions.",
        focus: "fitness",
        word: "langsam",
        meaning: "آهسته",
        phrase: "Mach die Übung langsam.",
        phraseMeaning: "تمرین را آهسته انجام بده",
        blankSentence: "Mach die Übung ___.",
        blankAnswer: "langsam",
        blankChoices: ["langsam", "teuer", "geboren"],
        orderedWords: ["Mach", "die", "Übung", "langsam"],
        grammarPoint: "در دستور دوستانه، فعل می‌تواند اول جمله بیاید.",
        situation: "مربی تمرین ساده‌ای می‌دهد.",
        miniText: "Der Trainer sagt: Mach die Übung langsam.",
        miniAnswer: "تمرین باید آهسته انجام شود."
      },
      {
        slug: "visit-the-doctor",
        title: "Visit the doctor",
        description: "Say symptoms and understand simple advice.",
        focus: "doctor",
        word: "Husten",
        meaning: "سرفه",
        phrase: "Ich habe Husten.",
        phraseMeaning: "من سرفه دارم",
        blankSentence: "Ich habe ___.",
        blankAnswer: "Husten",
        blankChoices: ["Husten", "Bahnhof", "Sommer"],
        orderedWords: ["Ich", "habe", "Husten"],
        grammarPoint: "برای بسیاری از علائم از Ich habe استفاده می‌شود.",
        situation: "علائم خود را به پزشک می‌گویید.",
        miniText: "Mina hat Husten und Fieber. Sie geht zum Arzt.",
        miniAnswer: "مینا سرفه دارد."
      }
    ]
  },
  {
    slug: "a1-work-and-life",
    title: "Work and life",
    summary: "Talk about dream jobs, workplace priorities, advice, work-life balance, and invitations.",
    resourceFocus: "jobs, workplace priorities, advice, and work-life balance",
    skills: [
      {
        slug: "describe-a-dream-job",
        title: "Describe a dream job",
        description: "Name jobs and say what matters to you.",
        focus: "dream job",
        word: "Traumjob",
        meaning: "شغل رویایی",
        phrase: "Mein Traumjob ist Arzt.",
        phraseMeaning: "شغل رویایی من پزشک است",
        blankSentence: "Mein Traumjob ___ Arzt.",
        blankAnswer: "ist",
        blankChoices: ["ist", "bin", "sind"],
        orderedWords: ["Mein", "Traumjob", "ist", "Arzt"],
        grammarPoint: "Traumjob مفرد است و با ist می‌آید.",
        situation: "از شغل رویایی خود می‌گویید.",
        miniText: "Omid möchte Arzt werden. Das ist sein Traumjob.",
        miniAnswer: "امید می‌خواهد پزشک شود."
      },
      {
        slug: "read-simple-job-ads",
        title: "Read simple job ads",
        description: "Understand workplace details and priorities.",
        focus: "job ads",
        word: "Arbeitszeit",
        meaning: "ساعت کاری",
        phrase: "Die Arbeitszeit ist flexibel.",
        phraseMeaning: "ساعت کاری منعطف است",
        blankSentence: "Die Arbeitszeit ist ___.",
        blankAnswer: "flexibel",
        blankChoices: ["flexibel", "krank", "links"],
        orderedWords: ["Die", "Arbeitszeit", "ist", "flexibel"],
        grammarPoint: "Arbeitszeit مؤنث است، اما فعل جمله ist است.",
        situation: "یک آگهی شغلی ساده می‌خوانید.",
        miniText: "Die Arbeitszeit ist flexibel. Das Team ist klein.",
        miniAnswer: "ساعت کاری منعطف است."
      },
      {
        slug: "report-advice",
        title: "Report advice",
        description: "Say what someone recommends or says.",
        focus: "advice",
        word: "sollen",
        meaning: "باید / توصیه شدن",
        phrase: "Der Arzt sagt, ich soll schlafen.",
        phraseMeaning: "پزشک می‌گوید باید بخوابم",
        blankSentence: "Ich ___ mehr schlafen.",
        blankAnswer: "soll",
        blankChoices: ["soll", "sollen", "sollst"],
        orderedWords: ["Ich", "soll", "mehr", "schlafen"],
        grammarPoint: "بعد از soll فعل اصلی به صورت مصدر می‌آید.",
        situation: "توصیه‌ی پزشک را بازگو می‌کنید.",
        miniText: "Der Arzt sagt: Reza soll mehr schlafen.",
        miniAnswer: "رضا باید بیشتر بخوابد."
      },
      {
        slug: "write-a-farewell-invitation",
        title: "Write a farewell invitation",
        description: "Invite people to a simple event and mention time.",
        focus: "invitation",
        word: "Einladung",
        meaning: "دعوت‌نامه",
        phrase: "Wir treffen uns um sechs Uhr.",
        phraseMeaning: "ما ساعت شش همدیگر را می‌بینیم",
        blankSentence: "Wir treffen uns ___ sechs Uhr.",
        blankAnswer: "um",
        blankChoices: ["um", "bei", "zu"],
        orderedWords: ["Wir", "treffen", "uns", "um", "sechs", "Uhr"],
        grammarPoint: "برای زمان دقیق از um استفاده می‌شود.",
        situation: "برای یک دورهمی خداحافظی دعوت می‌نویسید.",
        miniText: "Die Party ist um sechs Uhr. Alle Kollegen kommen.",
        miniAnswer: "مهمانی ساعت شش است."
      }
    ]
  }
];

function makeFinalTest(units: SampleUnit[]): SampleSkill {
  const slug = "a1-final-test";
  const regularSkills = units.flatMap((unit) =>
    unit.skills.filter((skill) => skill.kind === "REGULAR")
  );
  const questions = regularSkills
    .slice(0, 40)
    .map((skill, index) => cloneQuestion(skill.questions[index % skill.questions.length], slug, index + 1));

  return {
    id: slug,
    slug,
    title: "Final A1 Test",
    description: "Sample your readiness across the full A1 path.",
    kind: "FINAL_TEST",
    xp: 300,
    passingScore: 75,
    requeueIncorrect: false,
    publicationStatus: "PUBLISHED",
    questions
  };
}

function buildUnits() {
  const units = unitSpecs.map((unit) => {
    const skills = unit.skills.map((skill) => makeSkill(skill));

    return {
      slug: unit.slug,
      title: unit.title,
      summary: unit.summary,
      skills: [...skills, makeCheckpoint(unit, skills)]
    };
  });

  units[units.length - 1].skills.push(makeFinalTest(units));

  return units;
}

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
      units: buildUnits()
    }
  ]
};

export const sampleResources: SampleResource[] = unitSpecs.flatMap((unit) => [
  {
    slug: `${unit.slug}-grammar-guide`,
    title: `${unit.title} grammar guide`,
    description: `Persian-first grammar support for ${unit.resourceFocus}.`,
    type: "GRAMMAR_NOTE",
    levelLabel: "A1",
    content: `این راهنما نکته‌های پایه‌ی A1 برای ${unit.resourceFocus} را با توضیح فارسی و مثال‌های کوتاه آلمانی مرور می‌کند.`,
    publicationStatus: "PUBLISHED",
    unitSlug: unit.slug
  },
  {
    slug: `${unit.slug}-pronunciation-notes`,
    title: `${unit.title} pronunciation notes`,
    description: `Written pronunciation support for ${unit.resourceFocus}.`,
    type: "PRONUNCIATION",
    levelLabel: "A1",
    content: `برای تلفظ، واژه‌های این واحد را کوتاه، شمرده، و با توجه به تکیه‌ی هجایی تمرین کنید. فایل صوتی در نسخه‌ی بعدی اضافه می‌شود.`,
    publicationStatus: "PUBLISHED",
    unitSlug: unit.slug
  },
  {
    slug: `${unit.slug}-worksheet`,
    title: `${unit.title} worksheet`,
    description: `A text-only worksheet for practicing ${unit.resourceFocus}.`,
    type: "WORKSHEET",
    levelLabel: "A1",
    content: `سه جمله‌ی کوتاه آلمانی درباره‌ی ${unit.resourceFocus} بنویسید و سپس معنی فارسی هر جمله را کنار آن بیاورید.`,
    publicationStatus: "PUBLISHED",
    unitSlug: unit.slug
  }
]);

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

export function getPublishedResources() {
  return sampleResources.filter(
    (resource) => resource.publicationStatus === "PUBLISHED"
  );
}

export function getPublishedResource(resourceSlug: string) {
  const resource = getPublishedResources().find(
    (candidate) => candidate.slug === resourceSlug
  );

  if (!resource) {
    return undefined;
  }

  const unit = sampleCourse.levels
    .flatMap((level) => level.units)
    .find((candidate) => candidate.slug === resource.unitSlug);
  const skill = resource.skillSlug
    ? getPublishedSkill(resource.skillSlug)
    : unit?.skills.find((candidate) => candidate.kind === "REGULAR");

  return {
    ...resource,
    unitTitle: unit?.title,
    relatedSkillSlug: skill?.slug,
    relatedSkillTitle: skill?.title
  };
}

export function getA1ContentSummary() {
  const units = sampleCourse.levels[0]?.units ?? [];
  const skills = units.flatMap((unit) => unit.skills);
  const regularSkillCount = skills.filter((skill) => skill.kind === "REGULAR").length;
  const checkpointCount = skills.filter((skill) => skill.kind === "UNIT_CHECKPOINT").length;
  const finalTestCount = skills.filter((skill) => skill.kind === "FINAL_TEST").length;
  const questionCount = skills.reduce((total, skill) => total + skill.questions.length, 0);

  return {
    unitCount: units.length,
    regularSkillCount,
    checkpointCount,
    finalTestCount,
    questionCount,
    resourceCount: sampleResources.length
  };
}
