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
  choices: string[] | {
    choices: string[];
    acceptedAnswers: string[];
    tiles: string[];
  };
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
  publicationStatus: "DRAFT" | "IN_REVIEW" | "PUBLISHED";
  questions: SampleQuestion[];
};

export type SampleResource = {
  slug: string;
  title: string;
  description: string;
  type:
    | "BOOK"
    | "VIDEO"
    | "AUDIO_LESSON"
    | "EXTERNAL_LINK"
    | "GRAMMAR_RESOURCE"
    | "READING_MATERIAL"
    | "LEARNING_GUIDE";
  levelLabel: string;
  language: string;
  thumbnailIcon: string;
  metadata: Record<string, string>;
  content: string;
  url?: string;
  publicationStatus: "DRAFT" | "IN_REVIEW" | "PUBLISHED";
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

export type LearningContentDisplayLanguage = "fa" | "en" | "de";

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

type UnitLearnerCopy = {
  title: string;
  summary: string;
  resourceFocus: string;
};

type SkillLearnerCopy = {
  title: string;
  description: string;
  focus: string;
};

const unitLearnerCopy: Record<string, UnitLearnerCopy> = {
  "a1-first-contacts": {
    title: "اولین آشنایی‌ها",
    summary: "سلام و احوالپرسی، معرفی خود، هجی کردن واژه‌های ساده و گفتن زبان‌ها.",
    resourceFocus: "سلام و احوالپرسی، نام، کشورها و زبان‌ها"
  },
  "a1-people-and-family": {
    title: "آدم‌ها و خانواده",
    summary: "درباره حال، خداحافظی، اعضای خانواده، دوستان و سن صحبت کنید.",
    resourceFocus: "آدم‌ها، خانواده، دوستان و سن"
  },
  "a1-food-and-drink": {
    title: "غذا و نوشیدنی",
    summary: "خوراکی‌ها را نام ببرید، علاقه‌ها را بگویید، صبحانه سفارش دهید و خرید ساده انجام دهید.",
    resourceFocus: "غذا، نوشیدنی، مقدار، قیمت و درخواست مودبانه"
  },
  "a1-my-life": {
    title: "زندگی من",
    summary: "درباره کار، ساعت، اطلاعات تماس، برنامه روزانه و وسایل دیجیتال حرف بزنید.",
    resourceFocus: "شغل، ساعت، اطلاعات تماس، برنامه روزانه و وسایل"
  },
  "a1-free-time": {
    title: "وقت آزاد",
    summary: "درباره سرگرمی‌ها، علاقه‌ها، آخر هفته، کارهای لازم و استرس صحبت کنید.",
    resourceFocus: "سرگرمی، برنامه آخر هفته و کارهای لازم"
  },
  "a1-city-and-home": {
    title: "شهر و خانه",
    summary: "محل زندگی، جاهای شهر، اتاق‌ها، وسایل خانه و نظر ساده را توصیف کنید.",
    resourceFocus: "مکان‌ها، خانه، اتاق‌ها و نظر دادن"
  },
  "a1-weather-and-dates": {
    title: "هوا و تاریخ‌ها",
    summary: "درباره آب‌وهوا، ماه‌ها، تولد، محل تولد و شرح حال کوتاه صحبت کنید.",
    resourceFocus: "آب‌وهوا، ماه‌ها، تاریخ‌ها، محل تولد و شرح حال"
  },
  "a1-getting-around": {
    title: "رفت‌وآمد در شهر",
    summary: "واژه‌های حمل‌ونقل، مقایسه گزینه‌ها، زمان حرکت و مسیر پرسیدن را تمرین کنید.",
    resourceFocus: "حمل‌ونقل، زمان‌بندی، مسیر دادن و مکان‌های شهری"
  },
  "a1-with-friends": {
    title: "با دوستان",
    summary: "قرار گذاشتن، واکنش به پیشنهاد، سفارش در رستوران و گفتگوی کوتاه را تمرین کنید.",
    resourceFocus: "دعوت، رستوران، مهمانی و دلیل آوردن"
  },
  "a1-travel-and-past": {
    title: "سفر و گذشته",
    summary: "فصل‌ها، آرزوهای سفر، کشورهای آلمانی‌زبان، هتل و اولین جمله‌های گذشته را تمرین کنید.",
    resourceFocus: "سفر، فصل‌ها، کشورها، هتل و شکل‌های ساده گذشته"
  },
  "a1-sport-and-health": {
    title: "ورزش و سلامتی",
    summary: "اعضای بدن، ورزش، علاقه‌ها، دستورهای تمرینی و بیماری را بیان کنید.",
    resourceFocus: "بدن، ورزش، تمرین، بیماری و مراجعه به پزشک"
  },
  "a1-work-and-life": {
    title: "کار و زندگی",
    summary: "شغل رویایی، اولویت‌های کاری، توصیه، تعادل کار و زندگی و دعوت را تمرین کنید.",
    resourceFocus: "شغل، اولویت‌های کاری، توصیه و تعادل کار و زندگی"
  }
};

const skillLearnerCopy: Record<string, SkillLearnerCopy> = {
  "greet-and-say-your-name": {
    title: "سلام کن و نامت را بگو",
    description: "سلام رسمی و غیررسمی را تشخیص بده و خودت را معرفی کن.",
    focus: "سلام و معرفی"
  },
  "ask-for-a-name": {
    title: "نام کسی را بپرس",
    description: "با du و Sie نام طرف مقابل را مودبانه یا دوستانه بپرس.",
    focus: "پرسیدن نام"
  },
  "say-origin-and-home": {
    title: "اهل کجا بودن و محل زندگی",
    description: "بگو اهل کجا هستی و کجا زندگی می‌کنی.",
    focus: "کشور و محل زندگی"
  },
  "share-languages-and-contact": {
    title: "زبان‌ها و اطلاعات تماس",
    description: "درباره زبان‌ها، شماره تلفن و ایمیل جمله‌های ساده بساز.",
    focus: "زبان‌ها و تماس"
  },
  "ask-how-someone-is": {
    title: "حال کسی را بپرس",
    description: "پرسش و پاسخ ساده برای احوالپرسی را تمرین کن.",
    focus: "حال و احوال"
  },
  "say-goodbye-politely": {
    title: "مودبانه خداحافظی کن",
    description: "خداحافظی‌های رایج را در موقعیت‌های روزمره به کار ببر.",
    focus: "خداحافظی"
  },
  "introduce-family": {
    title: "خانواده را معرفی کن",
    description: "اعضای خانواده را نام ببر و مالکیت ساده را تمرین کن.",
    focus: "خانواده"
  },
  "talk-about-friends-and-age": {
    title: "دوستان و سن",
    description: "درباره دوستان حرف بزن و سن را بپرس یا بگو.",
    focus: "دوستان و سن"
  },
  "name-fruit-and-vegetables": {
    title: "میوه و سبزی را نام ببر",
    description: "اسم خوراکی‌ها را بپرس و چند واژه کاربردی را هجی کن.",
    focus: "نام خوراکی‌ها"
  },
  "say-food-preferences": {
    title: "علاقه غذایی را بگو",
    description: "بگو چه چیزی را دوست داری بخوری یا بنوشی.",
    focus: "علاقه غذایی"
  },
  "plan-breakfast": {
    title: "صبحانه را توصیف کن",
    description: "درباره خوراکی‌ها و نوشیدنی‌های صبحانه صحبت کن.",
    focus: "صبحانه"
  },
  "shop-for-food": {
    title: "خرید خوراکی",
    description: "خوراکی، قیمت و مقدار را ساده و مودبانه بپرس.",
    focus: "خرید"
  },
  "talk-about-job-and-time": {
    title: "شغل و ساعت",
    description: "شغلت را بگو و ساعت را بپرس یا اعلام کن.",
    focus: "شغل و ساعت"
  },
  "give-contact-details": {
    title: "اطلاعات تماس بده",
    description: "آدرس، شماره تلفن و ایمیل را آرام و روشن بگو.",
    focus: "اطلاعات تماس"
  },
  "describe-a-daily-routine": {
    title: "برنامه روزانه را بگو",
    description: "کارهای روزانه را با جمله‌های کوتاه توضیح بده.",
    focus: "برنامه روزانه"
  },
  "talk-about-devices": {
    title: "درباره وسایل حرف بزن",
    description: "بگو چه وسیله‌هایی داری و به چه چیزهایی نیاز داری.",
    focus: "وسایل"
  },
  "name-hobbies": {
    title: "سرگرمی‌ها را نام ببر",
    description: "بگو چه سرگرمی‌هایی داری.",
    focus: "سرگرمی‌ها"
  },
  "say-what-you-like-doing": {
    title: "بگو چه کاری را دوست داری",
    description: "درباره کارهایی که در وقت آزاد دوست داری انجام دهی حرف بزن.",
    focus: "علاقه‌ها"
  },
  "talk-about-weekends": {
    title: "درباره آخر هفته حرف بزن",
    description: "بگو آخر هفته چه کارهایی می‌توانی انجام دهی.",
    focus: "آخر هفته"
  },
  "talk-about-obligations": {
    title: "کارهای لازم را بگو",
    description: "بگو چه کاری باید انجام دهی و چه چیزی استرس ایجاد می‌کند.",
    focus: "وظیفه و اجبار"
  },
  "say-where-you-live": {
    title: "بگو کجا زندگی می‌کنی",
    description: "بگو در شهر، روستا یا کشور زندگی می‌کنی.",
    focus: "محل زندگی"
  },
  "describe-your-town": {
    title: "شهر خودت را توصیف کن",
    description: "درباره امکانات شهر و نظر ساده خودت جمله بساز.",
    focus: "توصیف شهر"
  },
  "name-rooms-and-furniture": {
    title: "اتاق‌ها و وسایل خانه",
    description: "اتاق‌ها و وسایل رایج خانه را نام ببر.",
    focus: "اتاق‌ها"
  },
  "describe-your-flat": {
    title: "آپارتمان خودت را توصیف کن",
    description: "درباره خانه یا آپارتمان خودت جمله‌های ساده بساز.",
    focus: "خانه"
  },
  "talk-about-weather": {
    title: "درباره هوا حرف بزن",
    description: "اطلاعات ساده آب‌وهوا را بفهم و بیان کن.",
    focus: "آب‌وهوا"
  },
  "name-months-and-seasons": {
    title: "ماه‌ها و فصل‌ها",
    description: "درباره ماه‌ها و زمان‌های مورد علاقه سال صحبت کن.",
    focus: "ماه‌ها"
  },
  "say-birthplace-and-birthday": {
    title: "تولد و محل تولد",
    description: "بپرس و بگو کسی کجا و چه زمانی به دنیا آمده است.",
    focus: "تاریخ‌های شخصی"
  },
  "write-a-simple-biography": {
    title: "شرح حال کوتاه بساز",
    description: "نام، سن، کشور، شغل و سرگرمی را در یک معرفی کوتاه ترکیب کن.",
    focus: "شرح حال"
  },
  "name-transport": {
    title: "وسایل حمل‌ونقل",
    description: "گزینه‌های حمل‌ونقل را نام ببر و بگو چطور رفت‌وآمد می‌کنی.",
    focus: "حمل‌ونقل"
  },
  "compare-transport": {
    title: "حمل‌ونقل را مقایسه کن",
    description: "مزیت‌ها و ایرادهای ساده وسایل رفت‌وآمد را بگو.",
    focus: "مقایسه"
  },
  "read-simple-timetables": {
    title: "زمان حرکت را بخوان",
    description: "ساعت‌ها و اطلاعات ساده سفر را بفهم.",
    focus: "جدول زمان‌بندی"
  },
  "ask-for-directions": {
    title: "مسیر بپرس",
    description: "بپرس چیزی کجاست و مسیر ساده را دنبال کن.",
    focus: "مسیر"
  },
  "make-plans": {
    title: "قرار بگذار",
    description: "بپرس کسی وقت دارد یا نه و یک فعالیت پیشنهاد بده.",
    focus: "قرار گذاشتن"
  },
  "react-to-suggestions": {
    title: "به پیشنهاد واکنش نشان بده",
    description: "قبول کن، رد کن و یک دلیل ساده بیاور.",
    focus: "واکنش"
  },
  "order-at-a-restaurant": {
    title: "در رستوران سفارش بده",
    description: "غذا و نوشیدنی را مودبانه سفارش بده.",
    focus: "رستوران"
  },
  "make-party-small-talk": {
    title: "گفتگوی کوتاه در مهمانی",
    description: "یک گفتگوی ساده را در مهمانی شروع کن و ادامه بده.",
    focus: "گفتگوی کوتاه"
  },
  "talk-about-seasons-and-travel-wishes": {
    title: "آرزوی سفر را بگو",
    description: "بگو چه زمانی و به کجا می‌خواهی سفر کنی.",
    focus: "آرزوی سفر"
  },
  "understand-country-facts": {
    title: "اطلاعات کشورها را بفهم",
    description: "واقعیت‌های ساده درباره کشورهای آلمانی‌زبان را بپرس و پاسخ بده.",
    focus: "کشورها"
  },
  "book-simple-accommodation": {
    title: "اقامت ساده پیدا کن",
    description: "درباره هتل و محل اقامت در سفر صحبت کن.",
    focus: "هتل"
  },
  "talk-about-a-past-trip": {
    title: "از سفر گذشته بگو",
    description: "بگو کجا بودی و دیروز یا در سفر چه کار کردی.",
    focus: "سفر گذشته"
  },
  "name-body-parts": {
    title: "اعضای بدن را نام ببر",
    description: "اعضای پایه بدن را بگو و درد را بیان کن.",
    focus: "بدن"
  },
  "talk-about-favorite-sport": {
    title: "ورزش مورد علاقه",
    description: "بگو چه ورزشی را دوست داری یا دوست نداری.",
    focus: "ورزش"
  },
  "understand-fitness-instructions": {
    title: "دستورهای تمرینی را بفهم",
    description: "دستورهای ساده برای تمرین ورزشی را دنبال کن.",
    focus: "تمرین ورزشی"
  },
  "visit-the-doctor": {
    title: "مراجعه به پزشک",
    description: "علائم بیماری را بگو و توصیه ساده را بفهم.",
    focus: "پزشک"
  },
  "describe-a-dream-job": {
    title: "شغل رویایی را توصیف کن",
    description: "شغل‌ها را نام ببر و بگو چه چیزهایی برایت مهم است.",
    focus: "شغل رویایی"
  },
  "read-simple-job-ads": {
    title: "آگهی شغلی ساده بخوان",
    description: "جزئیات محیط کار و اولویت‌های شغلی را بفهم.",
    focus: "آگهی شغلی"
  },
  "report-advice": {
    title: "توصیه را بازگو کن",
    description: "بگو کسی چه چیزی توصیه یا بیان کرده است.",
    focus: "توصیه"
  },
  "write-a-farewell-invitation": {
    title: "دعوت خداحافظی بنویس",
    description: "برای یک رویداد ساده دعوت بنویس و زمان را بگو.",
    focus: "دعوت"
  }
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

function acceptedAnswerOptions(acceptedAnswers: string[] = []) {
  return {
    choices: [],
    acceptedAnswers,
    tiles: []
  };
}

function wordOrderingOptions(words: string[], acceptedAnswers: string[] = []) {
  return {
    choices: [],
    acceptedAnswers,
    tiles: words
  };
}

function makeQuestion(
  skillSlug: string,
  order: number,
  type: SampleQuestionType,
  prompt: string,
  helper: string,
  choices: SampleQuestion["choices"],
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

function makeA2SkillQuestions(spec: SkillSpec): SampleQuestion[] {
  const ordered = orderedSentence(spec.orderedWords);

  return [
    makeQuestion(
      spec.slug,
      1,
      "MULTIPLE_CHOICE",
      `معنی دقیق «${spec.word}» در این موقعیت چیست؟`,
      spec.focus,
      choiceSet(spec.meaning, wrongMeanings[0], wrongMeanings[1]),
      spec.meaning,
      `در این مهارت، «${spec.word}» به معنی «${spec.meaning}» استفاده می‌شود.`
    ),
    makeQuestion(
      spec.slug,
      2,
      "MULTIPLE_CHOICE",
      `کدام جمله برای موقعیت زیر مناسب‌تر است؟ ${spec.situation}`,
      "کاربرد ارتباطی",
      choiceSet(spec.phrase, wrongPhrases[0], wrongPhrases[1]),
      spec.phrase,
      `برای این موقعیت، «${spec.phrase}» پاسخ طبیعی و کاربردی است.`
    ),
    makeQuestion(
      spec.slug,
      3,
      "FILL_IN_BLANK",
      `جای خالی را تایپ کنید: ${spec.blankSentence}`,
      "تولید کوتاه",
      acceptedAnswerOptions(),
      spec.blankAnswer,
      `پاسخ درست «${spec.blankAnswer}» است.`
    ),
    makeQuestion(
      spec.slug,
      4,
      "FILL_IN_BLANK",
      `واژه آلمانی مناسب برای «${spec.meaning}» را تایپ کنید.`,
      "واژگان فعال",
      acceptedAnswerOptions([spec.word.replace(/^(der|die|das) /, "")]),
      spec.word,
      `«${spec.word}» واژه‌ی اصلی این مهارت است.`
    ),
    makeQuestion(
      spec.slug,
      5,
      "FILL_IN_BLANK",
      `جمله را کامل کنید: ${spec.phrase.replace(spec.blankAnswer, "___")}`,
      "دقت گرامری",
      acceptedAnswerOptions(),
      spec.blankAnswer,
      spec.grammarPoint
    ),
    makeQuestion(
      spec.slug,
      6,
      "WORD_ORDERING",
      "با کاشی‌ها جمله درست بسازید.",
      "ترتیب واژه‌ها",
      wordOrderingOptions(spec.orderedWords),
      ordered,
      "در این جمله ترتیب واژه‌ها معنی و نقش گرامری را روشن می‌کند."
    ),
    makeQuestion(
      spec.slug,
      7,
      "WORD_ORDERING",
      "یک جمله دوم با همین الگوی ساختاری بسازید.",
      "ساخت جمله",
      wordOrderingOptions(spec.orderedWords),
      ordered,
      "در تمرین ترتیب واژه، همه کاشی‌ها باید در یک جمله کامل استفاده شوند."
    ),
    makeQuestion(
      spec.slug,
      8,
      "MULTIPLE_CHOICE",
      `متن کوتاه: ${spec.miniText} کدام برداشت درست است؟`,
      "درک مطلب کوتاه",
      choiceSet(spec.miniAnswer, wrongMeanings[2], wrongMeanings[3]),
      spec.miniAnswer,
      "پاسخ درست از اطلاعات مستقیم متن کوتاه به دست می‌آید."
    )
  ];
}

function makeSkill(
  spec: SkillSpec,
  publicationStatus: SampleSkill["publicationStatus"] = "PUBLISHED",
  questionBuilder: (spec: SkillSpec) => SampleQuestion[] = makeSkillQuestions
): SampleSkill {
  const learnerCopy = skillLearnerCopy[spec.slug];
  const localizedSpec = learnerCopy ? { ...spec, ...learnerCopy } : spec;

  return {
    id: localizedSpec.slug,
    slug: localizedSpec.slug,
    title: localizedSpec.title,
    description: localizedSpec.description,
    kind: "REGULAR",
    xp: 80,
    requeueIncorrect: true,
    publicationStatus,
    questions: publicationStatus === "PUBLISHED" ? questionBuilder(localizedSpec) : []
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

function makeCheckpoint(
  unit: UnitSpec,
  skills: SampleSkill[],
  levelLabel = "A1",
  publicationStatus: SampleSkill["publicationStatus"] = "PUBLISHED"
): SampleSkill {
  const slug = `${unit.slug}-checkpoint`;
  const questions = skills.flatMap((skill) => skill.questions.slice(0, 3)).map(
    (question, index) => cloneQuestion(question, slug, index + 1)
  );

  return {
    id: slug,
    slug,
    title: `${unit.title}: آزمونک`,
    description: `کنترل ${levelLabel} خودت را در موضوع ${unit.resourceFocus} بسنج.`,
    kind: "UNIT_CHECKPOINT",
    xp: 120,
    passingScore: 70,
    requeueIncorrect: false,
    publicationStatus,
    questions: publicationStatus === "PUBLISHED" ? questions : []
  };
}

function makeA2Checkpoint(
  unit: UnitSpec,
  skills: SampleSkill[],
  publicationStatus: SampleSkill["publicationStatus"] = "PUBLISHED",
  levelLabel = "A2"
): SampleSkill {
  const slug = `${unit.slug}-checkpoint`;
  const questionsByType = {
    multipleChoice: skills.flatMap((skill) =>
      skill.questions.filter((question) => question.type === "MULTIPLE_CHOICE")
    ),
    fillInBlank: skills.flatMap((skill) =>
      skill.questions.filter((question) => question.type === "FILL_IN_BLANK")
    ),
    wordOrdering: skills.flatMap((skill) =>
      skill.questions.filter((question) => question.type === "WORD_ORDERING")
    )
  };
  const selectedQuestions = [
    ...questionsByType.multipleChoice.slice(0, 3),
    ...questionsByType.fillInBlank.slice(0, 4),
    ...questionsByType.wordOrdering.slice(0, 3),
    ...questionsByType.multipleChoice.slice(3, 5)
  ].map((question, index) => cloneQuestion(question, slug, index + 1));

  return {
    id: slug,
    slug,
    title: `${unit.title}: آزمونک`,
    description: `کنترل ${levelLabel} خودت را در موضوع ${unit.resourceFocus} بسنج.`,
    kind: "UNIT_CHECKPOINT",
    xp: 120,
    passingScore: 70,
    requeueIncorrect: false,
    publicationStatus,
    questions: publicationStatus === "PUBLISHED" ? selectedQuestions : []
  };
}

function localizeUnit(unit: UnitSpec): UnitSpec {
  const learnerCopy = unitLearnerCopy[unit.slug];

  return {
    ...unit,
    ...(learnerCopy ?? {}),
    skills: unit.skills.map((skill) => ({
      ...skill,
      ...(skillLearnerCopy[skill.slug] ?? {})
    }))
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
    title: "آزمون نهایی A1",
    description: "آمادگی خودت را در کل مسیر A1 بسنج.",
    kind: "FINAL_TEST",
    xp: 300,
    passingScore: 75,
    requeueIncorrect: false,
    publicationStatus: "PUBLISHED",
    questions
  };
}

function buildUnits() {
  const units = unitSpecs.map((unitSpec) => {
    const unit = localizeUnit(unitSpec);
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

type LearningPathDisplaySkill = {
  title: string;
  description: string;
};

type LearningPathDisplayUnit = {
  title: string;
  summary: string;
  skills: Record<string, LearningPathDisplaySkill>;
};

export type LearningPathDisplayCopy = {
  levelTitle: string;
  units: Record<string, LearningPathDisplayUnit>;
};

const persianTextPattern = /[\u0600-\u06FF]/;

function titleCase(value: string) {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function humanizeSlug(slug: string) {
  return titleCase(
    slug
      .replace(/^(a\d|b\d|c\d)-/, "")
      .replace(/-checkpoint$/, " checkpoint")
      .replace(/-/g, " ")
  );
}

function nonPersianOrFallback(value: string, fallback: string) {
  return persianTextPattern.test(value) ? fallback : value;
}

function fallbackSkillDescription(title: string) {
  return `Practice ${title.toLowerCase()}.`;
}

function levelDisplayTitle(levelLabel: string, title: string, language: LearningContentDisplayLanguage) {
  if (language === "fa") {
    return title;
  }

  if (language === "de") {
    return `${levelLabel}-Lernpfad`;
  }

  return `${levelLabel} Learning Path`;
}

function a1EnglishDisplayUnits() {
  return Object.fromEntries(
    unitSpecs.map((unit) => {
      const skills = Object.fromEntries(
        unit.skills.map((skill) => [
          skill.slug,
          {
            title: skill.title,
            description: skill.description
          }
        ])
      );
      const checkpointTitle = `${unit.title}: Unit Checkpoint`;

      skills[`${unit.slug}-checkpoint`] = {
        title: checkpointTitle,
        description: `Check your A1 control for ${unit.resourceFocus}.`
      };

      return [
        unit.slug,
        {
          title: unit.title,
          summary: unit.summary,
          skills
        }
      ];
    })
  );
}

export function getLearningPathDisplayCopy(
  levelLabel: string,
  language: LearningContentDisplayLanguage = "fa"
): LearningPathDisplayCopy {
  const level = sampleCourse.levels.find((candidate) => candidate.label === levelLabel);

  if (!level) {
    return {
      levelTitle:
        language === "de" ? `${levelLabel}-Lernpfad` : `${levelLabel} Learning Path`,
      units: {}
    };
  }

  if (language === "fa") {
    return {
      levelTitle: level.title,
      units: Object.fromEntries(
        level.units.map((unit) => [
          unit.slug,
          {
            title: unit.title,
            summary: unit.summary,
            skills: Object.fromEntries(
              unit.skills.map((skill) => [
                skill.slug,
                {
                  title: skill.title,
                  description: skill.description
                }
              ])
            )
          }
        ])
      )
    };
  }

  const a1Units = levelLabel === "A1" ? a1EnglishDisplayUnits() : {};

  return {
    levelTitle: levelDisplayTitle(level.label, level.title, language),
    units: Object.fromEntries(
      level.units.map((unit) => {
        const unitFallback = a1Units[unit.slug];
        const unitTitle = nonPersianOrFallback(
          unitFallback?.title ?? unit.title,
          humanizeSlug(unit.slug)
        );
        const summary = nonPersianOrFallback(
          unitFallback?.summary ?? unit.summary,
          `Practice ${unitTitle.toLowerCase()} topics.`
        );

        return [
          unit.slug,
          {
            title: unitTitle,
            summary,
            skills: Object.fromEntries(
              unit.skills.map((skill) => {
                const skillFallback = unitFallback?.skills[skill.slug];
                const skillTitle = nonPersianOrFallback(
                  skillFallback?.title ?? skill.title,
                  skill.kind === "FINAL_TEST"
                    ? `Final ${level.label} Test`
                    : skill.kind === "UNIT_CHECKPOINT"
                      ? `${unitTitle}: Unit Checkpoint`
                      : humanizeSlug(skill.slug)
                );

                return [
                  skill.slug,
                  {
                    title: skillTitle,
                    description: nonPersianOrFallback(
                      skillFallback?.description ?? skill.description,
                      skill.kind === "FINAL_TEST"
                        ? `Review and check your ${level.label} progress.`
                        : skill.kind === "UNIT_CHECKPOINT"
                          ? `Check your ${level.label} control for this unit.`
                          : fallbackSkillDescription(skillTitle)
                    )
                  }
                ];
              })
            )
          }
        ];
      })
    )
  };
}

const a2UnitOneSpec: UnitSpec = {
  slug: "a2-german-in-global-life",
  title: "آلمانی در زندگی جهانی",
  summary: "دوباره ارتباط بگیرید، درباره جابه‌جایی بین کشورها حرف بزنید، تجربه‌های اخیر را بگویید و دلیل یادگیری آلمانی را توضیح دهید.",
  resourceFocus: "ارتباط دوباره، زندگی جهانی، تجربه‌های اخیر و دلیل یادگیری آلمانی",
  skills: [
    {
      slug: "a2-reconnect-and-ask-how-someone-is",
      title: "حال کسی را دوباره بپرس",
      description: "بعد از مدتی با کسی ارتباط بگیر و با ضمیرهای داتیو حال، کمک و علاقه را بیان کن.",
      focus: "ارتباط دوباره و داتیو",
      word: "wiedersehen",
      meaning: "دوباره دیدن",
      phrase: "Lange nicht gesehen! Wie geht es dir?",
      phraseMeaning: "خیلی وقت است ندیدمت! حالت چطور است؟",
      blankSentence: "Wie geht es ___?",
      blankAnswer: "dir",
      blankChoices: ["dir", "du", "dich"],
      orderedWords: ["Mir", "geht", "es", "gut"],
      grammarPoint: "بعد از Wie geht es از ضمیر داتیو مثل dir، Ihnen یا euch استفاده می‌شود.",
      situation: "بعد از چند ماه یک همکلاسی قدیمی را می‌بینید.",
      miniText: "Nina sieht Ben nach langer Zeit. Sie sagt: Lange nicht gesehen! Wie geht es dir?",
      miniAnswer: "نینا حال بن را می‌پرسد."
    },
    {
      slug: "a2-talk-about-moving-abroad",
      title: "درباره رفتن به کشور دیگر حرف بزن",
      description: "درباره کشور، شهر، کار یا تحصیل در خارج و پرسش‌های wo، woher، wohin و seit wann صحبت کن.",
      focus: "زندگی و کار در کشور دیگر",
      word: "die Unterkunft",
      meaning: "محل اقامت",
      phrase: "Ich wohne seit drei Monaten in Berlin.",
      phraseMeaning: "سه ماه است در برلین زندگی می‌کنم.",
      blankSentence: "Ich wohne ___ drei Monaten in Berlin.",
      blankAnswer: "seit",
      blankChoices: ["seit", "nach", "aus"],
      orderedWords: ["Ich", "komme", "aus", "Teheran"],
      grammarPoint: "برای مدت زمانی که از گذشته شروع شده و هنوز ادامه دارد از seit استفاده می‌شود.",
      situation: "در کلاس درباره تجربه زندگی در یک شهر جدید حرف می‌زنید.",
      miniText: "Arman kommt aus Teheran. Er wohnt seit drei Monaten in Berlin und sucht eine Unterkunft.",
      miniAnswer: "آرمان سه ماه است در برلین زندگی می‌کند."
    },
    {
      slug: "a2-describe-recent-experiences",
      title: "تجربه‌های اخیر را در گذشته بگو",
      description: "اتفاق‌های اخیر را با Perfekt، فعل کمکی درست و فعل‌های جداشدنی تعریف کن.",
      focus: "تجربه‌های اخیر در Perfekt",
      word: "kennengelernt",
      meaning: "آشنا شده / شناخت پیدا کرده",
      phrase: "Ich habe gestern eine Kollegin kennengelernt.",
      phraseMeaning: "دیروز با یک همکار آشنا شدم.",
      blankSentence: "Ich ___ gestern eine Kollegin kennengelernt.",
      blankAnswer: "habe",
      blankChoices: ["habe", "bin", "ist"],
      orderedWords: ["Wir", "sind", "nach", "Berlin", "gefahren"],
      grammarPoint: "در Perfekt، حرکت از جایی به جای دیگر معمولا با sein می‌آید.",
      situation: "درباره روز اول در یک شهر جدید صحبت می‌کنید.",
      miniText: "Sara ist um sieben Uhr aufgestanden. Dann ist sie zur Arbeit gefahren und hat neue Leute kennengelernt.",
      miniAnswer: "سارا با آدم‌های جدید آشنا شده است."
    },
    {
      slug: "a2-explain-why-you-learn-german",
      title: "دلیل یادگیری آلمانی را توضیح بده",
      description: "با weil دلیل بیاور، درباره کار و تحصیل حرف بزن و معنی واژه‌ها را بپرس.",
      focus: "دلیل آوردن با weil",
      word: "der Sprachkurs",
      meaning: "کلاس زبان",
      phrase: "Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.",
      phraseMeaning: "آلمانی یاد می‌گیرم چون می‌خواهم در آلمان کار کنم.",
      blankSentence: "Ich lerne Deutsch, ___ ich hier arbeiten möchte.",
      blankAnswer: "weil",
      blankChoices: ["weil", "aber", "oder"],
      orderedWords: ["Was", "bedeutet", "Sprachkurs"],
      grammarPoint: "در جمله فرعی با weil فعل صرف‌شده در پایان جمله می‌آید.",
      situation: "کسی می‌پرسد چرا آلمانی یاد می‌گیرید.",
      miniText: "Omid lernt Deutsch, weil er einen Master in Deutschland machen möchte.",
      miniAnswer: "امید برای تحصیل در آلمان آلمانی یاد می‌گیرد."
    }
  ]
};

const a2PublishedUnitSpecs: UnitSpec[] = [
  a2UnitOneSpec,
  {
    slug: "a2-appearance-and-recommendations",
    title: "ظاهر، لباس و پیشنهاد دادن",
    summary: "لباس و ظاهر را توصیف کنید، در خرید نظر بدهید و پیشنهاد یا توصیه مودبانه بسازید.",
    resourceFocus: "لباس، ظاهر، خرید و پیشنهاد",
    skills: [
      {
        slug: "a2-describe-clothes-and-style",
        title: "لباس و استایل را توصیف کن",
        description: "رنگ، جنس و ظاهر لباس‌ها را با جمله‌های دقیق‌تر بیان کن.",
        focus: "لباس و ظاهر",
        word: "der Mantel",
        meaning: "پالتو",
        phrase: "Der Mantel sieht sehr elegant aus.",
        phraseMeaning: "پالتو خیلی شیک به نظر می‌رسد",
        blankSentence: "Der Mantel sieht sehr ___ aus.",
        blankAnswer: "elegant",
        blankChoices: ["elegant", "durstig", "gestern"],
        orderedWords: ["Der", "Mantel", "sieht", "elegant", "aus"],
        grammarPoint: "در فعل جداشدنی aussehen، بخش aus در پایان جمله می‌آید.",
        situation: "در فروشگاه ظاهر یک پالتو را توصیف می‌کنید.",
        miniText: "Lena probiert einen Mantel. Er sieht elegant aus, aber er ist teuer.",
        miniAnswer: "پالتو شیک است اما گران است."
      },
      {
        slug: "a2-shop-for-clothes",
        title: "در خرید لباس گفتگو کن",
        description: "سایز، قیمت، پسندیدن و عوض کردن گزینه‌ها را تمرین کن.",
        focus: "خرید لباس",
        word: "die Groesse",
        meaning: "سایز / اندازه",
        phrase: "Haben Sie diese Jacke in Groesse M?",
        phraseMeaning: "آیا این کت را در سایز M دارید؟",
        blankSentence: "Haben Sie diese Jacke in ___ M?",
        blankAnswer: "Groesse",
        blankChoices: ["Groesse", "Kasse", "Farbe"],
        orderedWords: ["Ich", "nehme", "die", "Jacke", "in", "M"],
        grammarPoint: "برای پرسیدن سایز لباس از in Groesse استفاده می‌شود.",
        situation: "در بوتیک دنبال سایز مناسب می‌گردید.",
        miniText: "Omid fragt nach Groesse M. Die Verkaeuferin bringt eine andere Jacke.",
        miniAnswer: "امید سایز M می‌خواهد."
      },
      {
        slug: "a2-talk-about-public-figures",
        title: "درباره چهره‌های معروف حرف بزن",
        description: "ظاهر و تاثیر یک شخص شناخته‌شده را کوتاه توصیف کن.",
        focus: "توصیف افراد",
        word: "der Schauspieler",
        meaning: "بازیگر مرد",
        phrase: "Der Schauspieler traegt oft einen schwarzen Anzug.",
        phraseMeaning: "بازیگر اغلب کت‌وشلوار مشکی می‌پوشد",
        blankSentence: "Der Schauspieler traegt oft einen schwarzen ___.",
        blankAnswer: "Anzug",
        blankChoices: ["Anzug", "Termin", "Bahnhof"],
        orderedWords: ["Der", "Schauspieler", "traegt", "einen", "Anzug"],
        grammarPoint: "بعد از traegt، مفعول مستقیم با آکوزاتیو می‌آید.",
        situation: "ظاهر یک بازیگر را برای دوستتان توصیف می‌کنید.",
        miniText: "Der Schauspieler ist bekannt. Auf Fotos traegt er oft einen schwarzen Anzug.",
        miniAnswer: "او اغلب کت‌وشلوار مشکی می‌پوشد."
      },
      {
        slug: "a2-make-a-recommendation",
        title: "پیشنهاد مودبانه بده",
        description: "با ساختارهای ساده پیشنهاد بده و دلیل کوتاه بیاور.",
        focus: "پیشنهاد دادن",
        word: "empfehlen",
        meaning: "پیشنهاد کردن / توصیه کردن",
        phrase: "Ich empfehle dir diese Schuhe.",
        phraseMeaning: "من این کفش‌ها را به تو پیشنهاد می‌کنم",
        blankSentence: "Ich ___ dir diese Schuhe.",
        blankAnswer: "empfehle",
        blankChoices: ["empfehle", "gefaellt", "hilfst"],
        orderedWords: ["Ich", "empfehle", "dir", "diese", "Schuhe"],
        grammarPoint: "در جمله Ich empfehle dir، ضمیر dir داتیو است.",
        situation: "به دوستتان یک لباس یا کفش مناسب پیشنهاد می‌دهید.",
        miniText: "Die Schuhe sind bequem und nicht teuer. Sara empfiehlt sie ihrer Freundin.",
        miniAnswer: "سارا کفش‌ها را پیشنهاد می‌کند."
      }
    ]
  },
  {
    slug: "a2-family-relationships-and-friends",
    title: "خانواده، رابطه‌ها و دوستان",
    summary: "درباره خانواده، رابطه‌ها، زوج‌ها، دوستی و تغییرات زندگی شخصی صحبت کنید.",
    resourceFocus: "خانواده، رابطه‌ها و دوستی",
    skills: [
      {
        slug: "a2-describe-family-relationships",
        title: "رابطه‌های خانوادگی را توصیف کن",
        description: "نسبت‌ها، نقش‌ها و وضعیت خانوادگی را روشن بیان کن.",
        focus: "خانواده",
        word: "die Verwandten",
        meaning: "خویشاوندان",
        phrase: "Meine Verwandten wohnen in verschiedenen Staedten.",
        phraseMeaning: "خویشاوندان من در شهرهای مختلف زندگی می‌کنند",
        blankSentence: "Meine ___ wohnen in verschiedenen Staedten.",
        blankAnswer: "Verwandten",
        blankChoices: ["Verwandten", "Schuhe", "Konten"],
        orderedWords: ["Meine", "Verwandten", "wohnen", "in", "Berlin"],
        grammarPoint: "Verwandten جمع است و فعل wohnen با آن می‌آید.",
        situation: "درباره خانواده گسترده خود حرف می‌زنید.",
        miniText: "Mina hat viele Verwandte. Einige wohnen in Berlin, andere in Wien.",
        miniAnswer: "خویشاوندان مینا در شهرهای مختلف زندگی می‌کنند."
      },
      {
        slug: "a2-talk-about-couples-and-plans",
        title: "درباره زوج‌ها و برنامه‌ها حرف بزن",
        description: "برنامه‌های مشترک، ازدواج یا زندگی مشترک را ساده توضیح بده.",
        focus: "رابطه‌ها",
        word: "verheiratet",
        meaning: "متاهل",
        phrase: "Sie sind seit zwei Jahren verheiratet.",
        phraseMeaning: "آن‌ها دو سال است ازدواج کرده‌اند",
        blankSentence: "Sie sind seit zwei Jahren ___.",
        blankAnswer: "verheiratet",
        blankChoices: ["verheiratet", "geoeffnet", "billig"],
        orderedWords: ["Sie", "sind", "seit", "zwei", "Jahren", "verheiratet"],
        grammarPoint: "برای مدت ادامه‌دار از seit همراه با داتیو زمانی استفاده می‌شود.",
        situation: "درباره وضعیت رابطه یک زوج توضیح می‌دهید.",
        miniText: "Nina und Ben sind verheiratet. Sie planen eine Reise mit der Familie.",
        miniAnswer: "نینا و بن متاهل هستند."
      },
      {
        slug: "a2-describe-friendships",
        title: "دوستی‌ها را توصیف کن",
        description: "درباره آشنایی، اعتماد و فعالیت‌های مشترک حرف بزن.",
        focus: "دوستی",
        word: "vertrauen",
        meaning: "اعتماد کردن",
        phrase: "Ich vertraue meiner besten Freundin.",
        phraseMeaning: "من به بهترین دوستم اعتماد دارم",
        blankSentence: "Ich ___ meiner besten Freundin.",
        blankAnswer: "vertraue",
        blankChoices: ["vertraue", "traegt", "tauscht"],
        orderedWords: ["Ich", "vertraue", "meiner", "besten", "Freundin"],
        grammarPoint: "فعل vertrauen با داتیو می‌آید.",
        situation: "توضیح می‌دهید چرا یک دوست برایتان مهم است.",
        miniText: "Ali kennt Reza seit der Schule. Er vertraut ihm und spricht oft mit ihm.",
        miniAnswer: "علی به رضا اعتماد دارد."
      },
      {
        slug: "a2-family-and-friends-check-in",
        title: "خبر خانواده و دوستان را بپرس",
        description: "حال و خبر افراد نزدیک را در گفتگوی طبیعی دنبال کن.",
        focus: "خبر گرفتن",
        word: "sich melden",
        meaning: "خبر دادن / تماس گرفتن",
        phrase: "Melde dich bitte am Wochenende.",
        phraseMeaning: "لطفاً آخر هفته خبر بده",
        blankSentence: "Melde dich bitte am ___.",
        blankAnswer: "Wochenende",
        blankChoices: ["Wochenende", "Schrank", "Anzug"],
        orderedWords: ["Melde", "dich", "bitte", "am", "Wochenende"],
        grammarPoint: "در درخواست دوستانه، فعل در ابتدای جمله می‌آید.",
        situation: "از دوستی می‌خواهید آخر هفته خبر بدهد.",
        miniText: "Sara ist sehr beschaeftigt. Ihre Mutter sagt: Melde dich bitte am Wochenende.",
        miniAnswer: "مادر از سارا می‌خواهد آخر هفته خبر بدهد."
      }
    ]
  },
  {
    slug: "a2-housing-stays-and-email",
    title: "خانه، اقامت و ایمیل",
    summary: "اقامت، خانه، آشپزخانه، درخواست‌های خانگی و ایمیل‌های کاربردی را تمرین کنید.",
    resourceFocus: "خانه، اقامت، وسایل و ایمیل",
    skills: [
      {
        slug: "a2-arrange-a-home-stay",
        title: "اقامت را هماهنگ کن",
        description: "درباره خانه، اتاق، زمان ورود و نیازها سوال بپرس.",
        focus: "اقامت",
        word: "der Wohnungstausch",
        meaning: "تعویض خانه / خانه‌تبادل",
        phrase: "Wir tauschen die Wohnung fuer eine Woche.",
        phraseMeaning: "ما خانه را برای یک هفته عوض می‌کنیم",
        blankSentence: "Wir tauschen die Wohnung fuer eine ___.",
        blankAnswer: "Woche",
        blankChoices: ["Woche", "Bluse", "Frage"],
        orderedWords: ["Wir", "tauschen", "die", "Wohnung", "fuer", "eine", "Woche"],
        grammarPoint: "برای مدت با fuer و آکوزاتیو می‌توان بازه زمانی را بیان کرد.",
        situation: "برای اقامت کوتاه درباره تعویض خانه حرف می‌زنید.",
        miniText: "Familie Novak tauscht die Wohnung fuer eine Woche. Die Gaeste kommen am Montag.",
        miniAnswer: "تعویض خانه برای یک هفته است."
      },
      {
        slug: "a2-write-a-practical-email",
        title: "ایمیل کاربردی بنویس",
        description: "درخواست، توضیح کوتاه و پایان مودبانه را در ایمیل تمرین کن.",
        focus: "ایمیل",
        word: "die Anfrage",
        meaning: "درخواست / پرس‌وجو",
        phrase: "Vielen Dank fuer Ihre Anfrage.",
        phraseMeaning: "از درخواست شما بسیار سپاسگزاریم",
        blankSentence: "Vielen Dank fuer Ihre ___.",
        blankAnswer: "Anfrage",
        blankChoices: ["Anfrage", "Kueche", "Jacke"],
        orderedWords: ["Vielen", "Dank", "fuer", "Ihre", "Anfrage"],
        grammarPoint: "در ایمیل رسمی از Ihre برای خطاب مودبانه استفاده می‌شود.",
        situation: "به یک درخواست اقامت با ایمیل پاسخ می‌دهید.",
        miniText: "Herr Meier schreibt eine Anfrage. Die Vermieterin antwortet freundlich.",
        miniAnswer: "آقای مایر یک درخواست نوشته است."
      },
      {
        slug: "a2-describe-kitchen-and-home-items",
        title: "وسایل خانه را توصیف کن",
        description: "وسایل آشپزخانه و محل آن‌ها را با جمله‌های دقیق‌تر بگو.",
        focus: "وسایل خانه",
        word: "der Topf",
        meaning: "قابلمه",
        phrase: "Der Topf steht im Schrank.",
        phraseMeaning: "قابلمه در کمد است",
        blankSentence: "Der Topf steht im ___.",
        blankAnswer: "Schrank",
        blankChoices: ["Schrank", "Anzug", "Projekt"],
        orderedWords: ["Der", "Topf", "steht", "im", "Schrank"],
        grammarPoint: "برای محل ثابت از stehen و حرف اضافه مکانی استفاده می‌شود.",
        situation: "به مهمان توضیح می‌دهید وسایل آشپزخانه کجاست.",
        miniText: "Der Topf steht im Schrank. Die Teller sind neben der Spuele.",
        miniAnswer: "قابلمه در کمد است."
      },
      {
        slug: "a2-ask-someone-to-place-items",
        title: "از کسی بخواه چیزی را جابه‌جا کند",
        description: "درخواست‌های خانگی و ضمیرهای مفعولی را تمرین کن.",
        focus: "درخواست خانگی",
        word: "stellen",
        meaning: "گذاشتن به حالت ایستاده",
        phrase: "Stell die Tasse bitte auf den Tisch.",
        phraseMeaning: "لطفاً فنجان را روی میز بگذار",
        blankSentence: "Stell die Tasse bitte auf den ___.",
        blankAnswer: "Tisch",
        blankChoices: ["Tisch", "Mantel", "Traum"],
        orderedWords: ["Stell", "die", "Tasse", "bitte", "auf", "den", "Tisch"],
        grammarPoint: "در درخواست جهت‌دار با auf den Tisch از آکوزاتیو استفاده می‌شود.",
        situation: "در آشپزخانه از کسی می‌خواهید فنجان را روی میز بگذارد.",
        miniText: "Die Tasse steht noch in der Kueche. Amir stellt sie auf den Tisch.",
        miniAnswer: "امیر فنجان را روی میز می‌گذارد."
      }
    ]
  },
  {
    slug: "a2-food-parties-and-restaurants",
    title: "غذا، مهمانی و رستوران",
    summary: "درباره خرید، مهمانی، غذا خوردن بیرون و تجربه رستوران صحبت کنید.",
    resourceFocus: "غذا، مهمانی، رستوران و خرید",
    skills: [
      {
        slug: "a2-discuss-shopping-and-packaging",
        title: "درباره خرید و بسته‌بندی حرف بزن",
        description: "انتخاب‌های روزمره و نظر درباره مصرف را بیان کن.",
        focus: "خرید و بسته‌بندی",
        word: "die Plastiktuete",
        meaning: "کیسه پلاستیکی",
        phrase: "Ich nehme lieber eine Stofftasche.",
        phraseMeaning: "ترجیح می‌دهم یک کیسه پارچه‌ای بردارم",
        blankSentence: "Ich nehme lieber eine ___.",
        blankAnswer: "Stofftasche",
        blankChoices: ["Stofftasche", "Speisekarte", "Haltestelle"],
        orderedWords: ["Ich", "nehme", "lieber", "eine", "Stofftasche"],
        grammarPoint: "lieber برای بیان ترجیح می‌آید و قبل از بخش اصلی فعل قرار می‌گیرد.",
        situation: "در خرید درباره بسته‌بندی بهتر حرف می‌زنید.",
        miniText: "Nina kauft Obst. Sie nimmt keine Plastiktuete, sondern eine Stofftasche.",
        miniAnswer: "نینا کیسه پارچه‌ای برمی‌دارد."
      },
      {
        slug: "a2-plan-a-childrens-party",
        title: "یک مهمانی را برنامه‌ریزی کن",
        description: "خوراکی‌ها، زمان و کارهای لازم برای مهمانی را هماهنگ کن.",
        focus: "مهمانی",
        word: "der Kindergeburtstag",
        meaning: "جشن تولد کودک",
        phrase: "Wir bereiten den Kindergeburtstag vor.",
        phraseMeaning: "ما جشن تولد کودک را آماده می‌کنیم",
        blankSentence: "Wir bereiten den Kindergeburtstag ___.",
        blankAnswer: "vor",
        blankChoices: ["vor", "mit", "aus"],
        orderedWords: ["Wir", "bereiten", "den", "Kindergeburtstag", "vor"],
        grammarPoint: "در فعل جداشدنی vorbereiten، بخش vor در پایان جمله می‌آید.",
        situation: "برای تولد یک کودک خوراکی و برنامه آماده می‌کنید.",
        miniText: "Am Samstag kommen zehn Kinder. Die Eltern bereiten Kuchen und Spiele vor.",
        miniAnswer: "والدین کیک و بازی آماده می‌کنند."
      },
      {
        slug: "a2-order-and-react-in-a-restaurant",
        title: "در رستوران سفارش بده و واکنش نشان بده",
        description: "سفارش، نظر درباره غذا و درخواست مودبانه را تمرین کن.",
        focus: "رستوران",
        word: "die Speisekarte",
        meaning: "منوی غذا",
        phrase: "Koennen wir bitte die Speisekarte haben?",
        phraseMeaning: "می‌توانیم لطفاً منو را داشته باشیم؟",
        blankSentence: "Koennen wir bitte die ___ haben?",
        blankAnswer: "Speisekarte",
        blankChoices: ["Speisekarte", "Wohnung", "Stofftasche"],
        orderedWords: ["Wir", "haetten", "gern", "die", "Speisekarte"],
        grammarPoint: "haetten gern یک شکل مودبانه برای درخواست در رستوران است.",
        situation: "در رستوران مودبانه منو می‌خواهید.",
        miniText: "Im Restaurant fragt Amir nach der Speisekarte. Danach bestellt er eine Suppe.",
        miniAnswer: "امیر اول منو می‌خواهد."
      },
      {
        slug: "a2-describe-a-meal-experience",
        title: "تجربه یک غذا را توصیف کن",
        description: "درباره یک وعده غذا، مکان و حس کلی آن حرف بزن.",
        focus: "تجربه غذا",
        word: "die Spezialitaet",
        meaning: "غذای ویژه / تخصصی",
        phrase: "Die Spezialitaet des Hauses war sehr lecker.",
        phraseMeaning: "غذای ویژه رستوران خیلی خوشمزه بود",
        blankSentence: "Die Spezialitaet des Hauses war sehr ___.",
        blankAnswer: "lecker",
        blankChoices: ["lecker", "leer", "ledig"],
        orderedWords: ["Die", "Spezialitaet", "war", "sehr", "lecker"],
        grammarPoint: "برای توصیف تجربه گذشته می‌توان از war + صفت استفاده کرد.",
        situation: "بعد از شام درباره تجربه غذا حرف می‌زنید.",
        miniText: "Sara war in Wien essen. Die Spezialitaet des Hauses war lecker, aber teuer.",
        miniAnswer: "غذای ویژه خوشمزه اما گران بود."
      }
    ]
  },
  {
    slug: "a2-urban-culture-and-events",
    title: "فرهنگ شهری و رویدادها",
    summary: "هنر شهری، سفر کم‌هزینه، سینمای روباز و اجرای کوتاه را در شهر دنبال کنید.",
    resourceFocus: "فرهنگ شهری، سفر و رویداد",
    skills: [
      {
        slug: "a2-talk-about-street-art",
        title: "درباره هنر شهری حرف بزن",
        description: "اثر هنری، مکان و نظر شخصی را کوتاه توصیف کن.",
        focus: "هنر شهری",
        word: "die Streetart",
        meaning: "هنر خیابانی",
        phrase: "Die Streetart macht die Strasse bunter.",
        phraseMeaning: "هنر خیابانی خیابان را رنگارنگ‌تر می‌کند",
        blankSentence: "Die Streetart macht die Strasse ___.",
        blankAnswer: "bunter",
        blankChoices: ["bunter", "muede", "krank"],
        orderedWords: ["Die", "Streetart", "macht", "die", "Strasse", "bunter"],
        grammarPoint: "صفت مقایسه‌ای bunter نشان می‌دهد چیزی رنگارنگ‌تر می‌شود.",
        situation: "درباره یک اثر هنری روی دیوار شهر نظر می‌دهید.",
        miniText: "An der Wand ist neue Streetart. Viele Leute fotografieren das Bild.",
        miniAnswer: "مردم از اثر هنری عکس می‌گیرند."
      },
      {
        slug: "a2-plan-a-backpack-trip",
        title: "سفر کوله‌گردی را برنامه‌ریزی کن",
        description: "بودجه، مسیر و وسایل ضروری را توضیح بده.",
        focus: "سفر کم‌هزینه",
        word: "der Rucksack",
        meaning: "کوله‌پشتی",
        phrase: "Ich reise nur mit einem Rucksack.",
        phraseMeaning: "فقط با یک کوله‌پشتی سفر می‌کنم",
        blankSentence: "Ich reise nur mit einem ___.",
        blankAnswer: "Rucksack",
        blankChoices: ["Rucksack", "Topf", "Anzug"],
        orderedWords: ["Ich", "reise", "nur", "mit", "einem", "Rucksack"],
        grammarPoint: "بعد از mit از داتیو استفاده می‌شود: einem Rucksack.",
        situation: "برای سفر کم‌هزینه وسایل ضروری را توضیح می‌دهید.",
        miniText: "Omid reist zwei Wochen mit dem Rucksack. Er nimmt nur wenige Sachen mit.",
        miniAnswer: "امید سبک سفر می‌کند."
      },
      {
        slug: "a2-discuss-open-air-events",
        title: "درباره رویداد روباز حرف بزن",
        description: "زمان، مکان، بلیت و علاقه به یک برنامه فرهنگی را بیان کن.",
        focus: "رویداد شهری",
        word: "das Open-Air-Kino",
        meaning: "سینمای روباز",
        phrase: "Das Open-Air-Kino beginnt um neun Uhr.",
        phraseMeaning: "سینمای روباز ساعت نه شروع می‌شود",
        blankSentence: "Das Open-Air-Kino beginnt um ___ Uhr.",
        blankAnswer: "neun",
        blankChoices: ["neun", "neu", "nie"],
        orderedWords: ["Das", "Open-Air-Kino", "beginnt", "um", "neun", "Uhr"],
        grammarPoint: "برای زمان دقیق از um استفاده می‌شود.",
        situation: "درباره زمان و مکان یک برنامه فرهنگی حرف می‌زنید.",
        miniText: "Heute gibt es Open-Air-Kino im Park. Der Film beginnt um neun Uhr.",
        miniAnswer: "فیلم ساعت نه شروع می‌شود."
      },
      {
        slug: "a2-share-a-short-performance",
        title: "یک اجرای کوتاه را معرفی کن",
        description: "موضوع، حس و واکنش مخاطب را ساده توضیح بده.",
        focus: "اجرا",
        word: "der Poetry Slam",
        meaning: "اجرای شعر / اسلم شعر",
        phrase: "Beim Poetry Slam lesen Menschen kurze Texte vor.",
        phraseMeaning: "در اجرای شعر مردم متن‌های کوتاه می‌خوانند",
        blankSentence: "Beim Poetry Slam lesen Menschen kurze Texte ___.",
        blankAnswer: "vor",
        blankChoices: ["vor", "ein", "ab"],
        orderedWords: ["Menschen", "lesen", "kurze", "Texte", "vor"],
        grammarPoint: "در فعل جداشدنی vorlesen، بخش vor در پایان جمله می‌آید.",
        situation: "یک اجرای کوتاه فرهنگی را به دوستتان معرفی می‌کنید.",
        miniText: "Beim Poetry Slam liest Lara einen kurzen Text vor. Das Publikum lacht.",
        miniAnswer: "لارا یک متن کوتاه می‌خواند."
      }
    ]
  },
  {
    slug: "a2-school-work-and-dream-jobs",
    title: "مدرسه، کار و شغل رویایی",
    summary: "برنامه آموزشی، مدرسه، شغل‌ها و مسیر شغلی دلخواه را توصیف کنید.",
    resourceFocus: "مدرسه، کار و شغل",
    skills: [
      {
        slug: "a2-describe-a-plan",
        title: "یک برنامه را توضیح بده",
        description: "مراحل، زمان و هدف یک برنامه آموزشی یا کاری را بیان کن.",
        focus: "برنامه",
        word: "der Plan",
        meaning: "برنامه",
        phrase: "Mein Plan fuer naechstes Jahr ist klar.",
        phraseMeaning: "برنامه من برای سال آینده روشن است",
        blankSentence: "Mein Plan fuer naechstes Jahr ist ___.",
        blankAnswer: "klar",
        blankChoices: ["klar", "leer", "krank"],
        orderedWords: ["Mein", "Plan", "ist", "klar"],
        grammarPoint: "Plan مفرد است و با ist می‌آید.",
        situation: "برنامه آموزشی یا کاری آینده را توضیح می‌دهید.",
        miniText: "Reza hat einen Plan. Er macht zuerst einen Kurs und sucht dann Arbeit.",
        miniAnswer: "رضا اول یک دوره می‌گذراند."
      },
      {
        slug: "a2-talk-about-school-experience",
        title: "درباره تجربه مدرسه حرف بزن",
        description: "درس‌ها، معلم‌ها و مسیر آموزشی را توضیح بده.",
        focus: "مدرسه",
        word: "die Ausbildung",
        meaning: "دوره آموزشی / آموزش حرفه‌ای",
        phrase: "Ich mache eine Ausbildung im Krankenhaus.",
        phraseMeaning: "من در بیمارستان آموزش حرفه‌ای می‌گذرانم",
        blankSentence: "Ich mache eine ___ im Krankenhaus.",
        blankAnswer: "Ausbildung",
        blankChoices: ["Ausbildung", "Speisekarte", "Jacke"],
        orderedWords: ["Ich", "mache", "eine", "Ausbildung", "im", "Krankenhaus"],
        grammarPoint: "eine Ausbildung machen یک ترکیب رایج برای آموزش حرفه‌ای است.",
        situation: "درباره مسیر آموزشی خود توضیح می‌دهید.",
        miniText: "Mina macht eine Ausbildung. Sie lernt drei Tage pro Woche im Betrieb.",
        miniAnswer: "مینا آموزش حرفه‌ای می‌گذراند."
      },
      {
        slug: "a2-compare-jobs",
        title: "شغل‌ها را مقایسه کن",
        description: "وظیفه‌ها، محیط کار و علاقه شخصی را مقایسه کن.",
        focus: "شغل‌ها",
        word: "die Arbeitszeit",
        meaning: "ساعت کاری",
        phrase: "Die Arbeitszeit ist flexibler als frueher.",
        phraseMeaning: "ساعت کاری از قبل انعطاف‌پذیرتر است",
        blankSentence: "Die Arbeitszeit ist ___ als frueher.",
        blankAnswer: "flexibler",
        blankChoices: ["flexibler", "schwer", "krank"],
        orderedWords: ["Die", "Arbeitszeit", "ist", "sehr", "flexibel"],
        grammarPoint: "برای مقایسه از صفت مقایسه‌ای + als استفاده می‌شود.",
        situation: "دو شغل را از نظر زمان کاری مقایسه می‌کنید.",
        miniText: "Job A hat flexible Arbeitszeiten. Job B beginnt immer um sechs Uhr.",
        miniAnswer: "Job A انعطاف بیشتری دارد."
      },
      {
        slug: "a2-describe-your-dream-job",
        title: "شغل رویایی‌ات را توضیح بده",
        description: "دلیل انتخاب شغل و توانایی‌های لازم را بیان کن.",
        focus: "شغل رویایی",
        word: "der Traumjob",
        meaning: "شغل رویایی",
        phrase: "Mein Traumjob verbindet Sprache und Menschen.",
        phraseMeaning: "شغل رویایی من زبان و انسان‌ها را به هم وصل می‌کند",
        blankSentence: "Mein Traumjob ___ Sprache und Menschen.",
        blankAnswer: "verbindet",
        blankChoices: ["verbindet", "vertrauen", "tauscht"],
        orderedWords: ["Mein", "Traumjob", "verbindet", "Sprache", "und", "Menschen"],
        grammarPoint: "با فاعل مفرد Mein Traumjob، فعل verbindet می‌آید.",
        situation: "دلیل انتخاب شغل رویایی خود را توضیح می‌دهید.",
        miniText: "Sara moechte Lehrerin werden. Ihr Traumjob verbindet Sprache und Menschen.",
        miniAnswer: "سارا می‌خواهد معلم شود."
      }
    ]
  },
  {
    slug: "a2-health-happiness-and-satisfaction",
    title: "سلامت، خوشبختی و رضایت",
    summary: "درباره سلامت، توصیه پزشکی، رضایت و چیزهایی که خوشحال‌تان می‌کند حرف بزنید.",
    resourceFocus: "سلامت، خوشبختی و رضایت",
    skills: [
      {
        slug: "a2-explain-symptoms-to-a-doctor",
        title: "علائم را برای پزشک توضیح بده",
        description: "درد، مدت و شدت مشکل را روشن بیان کن.",
        focus: "پزشک",
        word: "die Schmerzen",
        meaning: "دردها",
        phrase: "Ich habe seit gestern starke Schmerzen.",
        phraseMeaning: "از دیروز درد شدید دارم",
        blankSentence: "Ich habe seit gestern starke ___.",
        blankAnswer: "Schmerzen",
        blankChoices: ["Schmerzen", "Schuhe", "Plaene"],
        orderedWords: ["Ich", "habe", "seit", "gestern", "starke", "Schmerzen"],
        grammarPoint: "Schmerzen معمولاً به صورت جمع استفاده می‌شود.",
        situation: "در مطب پزشک مشکل خود را توضیح می‌دهید.",
        miniText: "Amir hat seit gestern Schmerzen. Er geht heute zum Arzt.",
        miniAnswer: "امیر از دیروز درد دارد."
      },
      {
        slug: "a2-talk-about-happiness",
        title: "درباره خوشبختی حرف بزن",
        description: "چیزهایی را که برایت مهم و خوشحال‌کننده‌اند بیان کن.",
        focus: "خوشبختی",
        word: "zufrieden",
        meaning: "راضی",
        phrase: "Ich bin mit meinem Alltag zufrieden.",
        phraseMeaning: "از زندگی روزمره‌ام راضی هستم",
        blankSentence: "Ich bin mit meinem Alltag ___.",
        blankAnswer: "zufrieden",
        blankChoices: ["zufrieden", "ledig", "leer"],
        orderedWords: ["Ich", "bin", "mit", "meinem", "Alltag", "zufrieden"],
        grammarPoint: "بعد از mit از داتیو استفاده می‌شود: meinem Alltag.",
        situation: "درباره چیزهایی که خوشحالتان می‌کند حرف می‌زنید.",
        miniText: "Mina hat mehr Zeit fuer Freunde. Deshalb ist sie mit ihrem Alltag zufrieden.",
        miniAnswer: "مینا از زندگی روزمره‌اش راضی است."
      },
      {
        slug: "a2-describe-a-satisfied-person",
        title: "یک فرد راضی را توصیف کن",
        description: "سبک زندگی و دلیل رضایت یک نفر را توضیح بده.",
        focus: "رضایت",
        word: "das Glueck",
        meaning: "خوشبختی / خوش‌شانسی",
        phrase: "Glueck bedeutet fuer ihn Zeit mit der Familie.",
        phraseMeaning: "خوشبختی برای او یعنی وقت با خانواده",
        blankSentence: "Glueck bedeutet fuer ihn Zeit mit der ___.",
        blankAnswer: "Familie",
        blankChoices: ["Familie", "Kasse", "Spuele"],
        orderedWords: ["Glueck", "bedeutet", "Zeit", "mit", "der", "Familie"],
        grammarPoint: "bedeuten برای توضیح معنی یا مفهوم چیزی استفاده می‌شود.",
        situation: "توضیح می‌دهید چرا یک نفر احساس رضایت دارد.",
        miniText: "Fuer Reza bedeutet Glueck nicht viel Geld, sondern Zeit mit der Familie.",
        miniAnswer: "برای رضا خوشبختی یعنی وقت با خانواده."
      },
      {
        slug: "a2-give-health-advice",
        title: "توصیه سلامتی بده",
        description: "با باید و بهتر است توصیه ساده و محترمانه بساز.",
        focus: "توصیه",
        word: "sich ausruhen",
        meaning: "استراحت کردن",
        phrase: "Du solltest dich heute ausruhen.",
        phraseMeaning: "امروز باید استراحت کنی",
        blankSentence: "Du solltest dich heute ___.",
        blankAnswer: "ausruhen",
        blankChoices: ["ausruhen", "anprobieren", "umtauschen"],
        orderedWords: ["Du", "solltest", "dich", "heute", "ausruhen"],
        grammarPoint: "بعد از solltest فعل اصلی به صورت مصدر می‌آید.",
        situation: "به دوستی که خسته یا بیمار است توصیه می‌دهید.",
        miniText: "Nina hat Kopfschmerzen. Ihre Freundin sagt: Du solltest dich ausruhen.",
        miniAnswer: "دوستش به او توصیه می‌کند استراحت کند."
      }
    ]
  },
  {
    slug: "a2-media-apps-and-free-time",
    title: "رسانه، اپلیکیشن و وقت آزاد",
    summary: "برنامه تلویزیونی، اپلیکیشن محبوب، روز مورد علاقه و فعالیت‌های آزاد را بیان کنید.",
    resourceFocus: "رسانه، اپلیکیشن و وقت آزاد",
    skills: [
      {
        slug: "a2-discuss-tv-programs",
        title: "درباره برنامه تلویزیونی حرف بزن",
        description: "نوع برنامه، زمان پخش و نظر شخصی را بیان کن.",
        focus: "تلویزیون",
        word: "die Sendung",
        meaning: "برنامه تلویزیونی",
        phrase: "Die Sendung laeuft jeden Freitag.",
        phraseMeaning: "این برنامه هر جمعه پخش می‌شود",
        blankSentence: "Die Sendung laeuft jeden ___.",
        blankAnswer: "Freitag",
        blankChoices: ["Freitag", "Fenster", "Fehler"],
        orderedWords: ["Die", "Sendung", "laeuft", "jeden", "Freitag"],
        grammarPoint: "برای برنامه‌ای که مرتب تکرار می‌شود، می‌توان از jeden + روز هفته استفاده کرد.",
        situation: "برنامه تلویزیونی مورد علاقه‌تان را معرفی می‌کنید.",
        miniText: "Omid sieht gern eine Reisesendung. Sie laeuft jeden Freitag um acht Uhr.",
        miniAnswer: "برنامه هر جمعه پخش می‌شود."
      },
      {
        slug: "a2-present-a-favorite-app",
        title: "اپلیکیشن محبوبت را معرفی کن",
        description: "کاربرد، مزیت و دلیل علاقه به یک اپ را توضیح بده.",
        focus: "اپلیکیشن",
        word: "die App",
        meaning: "اپلیکیشن",
        phrase: "Diese App hilft mir beim Deutschlernen.",
        phraseMeaning: "این اپلیکیشن در یادگیری آلمانی به من کمک می‌کند",
        blankSentence: "Diese App hilft mir beim ___.",
        blankAnswer: "Deutschlernen",
        blankChoices: ["Deutschlernen", "Abendessen", "Ausruhen"],
        orderedWords: ["Diese", "App", "hilft", "mir", "beim", "Deutschlernen"],
        grammarPoint: "فعل helfen با داتیو می‌آید: mir.",
        situation: "به دوستتان می‌گویید چرا از یک اپ استفاده می‌کنید.",
        miniText: "Mina benutzt eine Lernapp. Die App erinnert sie jeden Tag an neue Woerter.",
        miniAnswer: "اپ هر روز واژه‌های جدید را یادآوری می‌کند."
      },
      {
        slug: "a2-describe-a-favorite-day",
        title: "روز مورد علاقه‌ات را توصیف کن",
        description: "برنامه روز، فعالیت‌ها و حس شخصی را توضیح بده.",
        focus: "روز محبوب",
        word: "der Lieblingstag",
        meaning: "روز مورد علاقه",
        phrase: "Mein Lieblingstag ist Samstag, weil ich frei habe.",
        phraseMeaning: "روز مورد علاقه من شنبه است چون آزاد هستم",
        blankSentence: "Mein Lieblingstag ist Samstag, ___ ich frei habe.",
        blankAnswer: "weil",
        blankChoices: ["weil", "oder", "aber"],
        orderedWords: ["Mein", "Lieblingstag", "ist", "Samstag"],
        grammarPoint: "در جمله فرعی با weil، فعل صرف‌شده در پایان جمله می‌آید.",
        situation: "درباره بهترین روز هفته و دلیل آن حرف می‌زنید.",
        miniText: "Fuer Sara ist Samstag der Lieblingstag. Sie schlaeft lange und trifft Freunde.",
        miniAnswer: "سارا شنبه را دوست دارد."
      },
      {
        slug: "a2-plan-free-time",
        title: "وقت آزاد را برنامه‌ریزی کن",
        description: "پیشنهاد، زمان و ترجیح برای فعالیت آزاد را بیان کن.",
        focus: "وقت آزاد",
        word: "die Freizeit",
        meaning: "وقت آزاد",
        phrase: "Wollen wir am Wochenende ins Kino gehen?",
        phraseMeaning: "می‌خواهیم آخر هفته به سینما برویم؟",
        blankSentence: "Wollen wir am Wochenende ins ___ gehen?",
        blankAnswer: "Kino",
        blankChoices: ["Kino", "Konto", "Kissen"],
        orderedWords: ["Wir", "gehen", "am", "Wochenende", "ins", "Kino"],
        grammarPoint: "برای حرکت به سمت سینما از ins Kino استفاده می‌شود.",
        situation: "برای آخر هفته با دوستتان برنامه می‌ریزید.",
        miniText: "Ben hat am Samstag frei. Er moechte mit Amir ins Kino gehen.",
        miniAnswer: "بن برای سینما برنامه دارد."
      }
    ]
  },
  {
    slug: "a2-social-behavior-compliments-and-gifts",
    title: "رفتار اجتماعی، تعریف و هدیه",
    summary: "رفتار مودبانه، تعریف کردن، آشنایی و هدیه دادن را در موقعیت‌های اجتماعی تمرین کنید.",
    resourceFocus: "رفتار اجتماعی، تعریف و هدیه",
    skills: [
      {
        slug: "a2-sound-friendly-and-polite",
        title: "دوستانه و مودبانه حرف بزن",
        description: "لحن مناسب، خواهش و پاسخ محترمانه را تمرین کن.",
        focus: "ادب اجتماعی",
        word: "hoeflich",
        meaning: "مودب",
        phrase: "Koennten Sie mir bitte kurz helfen?",
        phraseMeaning: "می‌توانید لطفاً کوتاه به من کمک کنید؟",
        blankSentence: "Koennten Sie mir bitte kurz ___?",
        blankAnswer: "helfen",
        blankChoices: ["helfen", "hoeren", "holen"],
        orderedWords: ["Koennten", "Sie", "mir", "bitte", "helfen"],
        grammarPoint: "Koennten Sie یک شکل مودبانه‌تر برای درخواست است.",
        situation: "در یک موقعیت رسمی کمک کوتاهی می‌خواهید.",
        miniText: "Im Amt versteht Sara ein Formular nicht. Sie fragt hoeflich nach Hilfe.",
        miniAnswer: "سارا مودبانه کمک می‌خواهد."
      },
      {
        slug: "a2-make-and-respond-to-compliments",
        title: "تعریف کن و پاسخ بده",
        description: "تعریف کوتاه، تشکر و واکنش طبیعی را بساز.",
        focus: "تعریف",
        word: "das Kompliment",
        meaning: "تعریف / تمجید",
        phrase: "Danke fuer das nette Kompliment.",
        phraseMeaning: "ممنون برای این تعریف خوب",
        blankSentence: "Danke fuer das nette ___.",
        blankAnswer: "Kompliment",
        blankChoices: ["Kompliment", "Konto", "Kino"],
        orderedWords: ["Danke", "fuer", "das", "nette", "Kompliment"],
        grammarPoint: "بعد از fuer معمولاً آکوزاتیو می‌آید: das nette Kompliment.",
        situation: "کسی از لباس یا کار شما تعریف می‌کند و پاسخ می‌دهید.",
        miniText: "Nina sagt: Dein Vortrag war sehr gut. Reza bedankt sich fuer das Kompliment.",
        miniAnswer: "رضا بابت تعریف تشکر می‌کند."
      },
      {
        slug: "a2-describe-a-person-you-want-to-meet",
        title: "فرد مناسب برای آشنایی را توصیف کن",
        description: "ویژگی‌ها، علاقه‌ها و انتظارها را محترمانه بیان کن.",
        focus: "آشنایی",
        word: "kennenlernen",
        meaning: "آشنا شدن",
        phrase: "Ich moechte jemanden kennenlernen, der ehrlich ist.",
        phraseMeaning: "می‌خواهم با کسی آشنا شوم که صادق است",
        blankSentence: "Ich moechte jemanden kennenlernen, der ___ ist.",
        blankAnswer: "ehrlich",
        blankChoices: ["ehrlich", "eilig", "einzeln"],
        orderedWords: ["Ich", "moechte", "jemanden", "kennenlernen"],
        grammarPoint: "بعد از moechte، فعل اصلی به صورت مصدر در پایان عبارت می‌آید.",
        situation: "درباره ویژگی‌های فردی که دوست دارید بشناسید حرف می‌زنید.",
        miniText: "Ali moechte neue Leute kennenlernen. Wichtig sind fuer ihn Humor und Ehrlichkeit.",
        miniAnswer: "برای علی صداقت مهم است."
      },
      {
        slug: "a2-choose-a-gift",
        title: "هدیه انتخاب کن",
        description: "درباره مناسبت، سلیقه و دلیل انتخاب هدیه حرف بزن.",
        focus: "هدیه",
        word: "das Geschenk",
        meaning: "هدیه",
        phrase: "Ich schenke ihr ein Buch zum Geburtstag.",
        phraseMeaning: "برای تولدش به او یک کتاب هدیه می‌دهم",
        blankSentence: "Ich schenke ihr ein Buch zum ___.",
        blankAnswer: "Geburtstag",
        blankChoices: ["Geburtstag", "Gepaeck", "Geldautomat"],
        orderedWords: ["Ich", "schenke", "ihr", "ein", "Buch"],
        grammarPoint: "در جمله Ich schenke ihr... ضمیر ihr داتیو است.",
        situation: "برای یک دوست هدیه مناسب انتخاب می‌کنید.",
        miniText: "Mina liest gern Romane. Deshalb schenkt Sara ihr ein Buch.",
        miniAnswer: "سارا یک کتاب هدیه می‌دهد."
      }
    ]
  },
  {
    slug: "a2-money-banking-and-messages",
    title: "پول، بانک و پیام‌ها",
    summary: "درباره ارزش پول، بانک، حساب، پرداخت و پیام‌های روزمره صحبت کنید.",
    resourceFocus: "پول، بانک و پیام",
    skills: [
      {
        slug: "a2-talk-about-money-values",
        title: "درباره پول و ارزش‌ها حرف بزن",
        description: "اولویت‌های مالی و غیرمالی را با مقایسه ساده بیان کن.",
        focus: "ارزش پول",
        word: "sparen",
        meaning: "پس‌انداز کردن",
        phrase: "Ich spare Geld fuer eine Reise.",
        phraseMeaning: "برای یک سفر پول پس‌انداز می‌کنم",
        blankSentence: "Ich spare Geld fuer eine ___.",
        blankAnswer: "Reise",
        blankChoices: ["Reise", "Rede", "Rechnung"],
        orderedWords: ["Ich", "spare", "Geld", "fuer", "eine", "Reise"],
        grammarPoint: "بعد از fuer از آکوزاتیو استفاده می‌شود: eine Reise.",
        situation: "درباره هدف مالی یا چیزی که برایتان مهم است حرف می‌زنید.",
        miniText: "Reza kauft weniger Kaffee. Er spart Geld fuer eine Reise.",
        miniAnswer: "رضا برای سفر پس‌انداز می‌کند."
      },
      {
        slug: "a2-understand-a-bank-service",
        title: "خدمات بانکی را بفهم",
        description: "اطلاعات پایه درباره بانک، کارت و حساب را دنبال کن.",
        focus: "بانک",
        word: "das Konto",
        meaning: "حساب بانکی",
        phrase: "Ich moechte ein Konto eroeffnen.",
        phraseMeaning: "می‌خواهم یک حساب باز کنم",
        blankSentence: "Ich moechte ein Konto ___.",
        blankAnswer: "eroeffnen",
        blankChoices: ["eroeffnen", "erzaehlen", "erinnern"],
        orderedWords: ["Ich", "moechte", "ein", "Konto", "eroeffnen"],
        grammarPoint: "بعد از moechte، فعل اصلی به صورت مصدر در پایان جمله می‌آید.",
        situation: "در بانک می‌گویید چه خدمتی می‌خواهید.",
        miniText: "Mina geht zur Bank. Sie moechte ein Konto eroeffnen und eine Karte bekommen.",
        miniAnswer: "مینا می‌خواهد حساب باز کند."
      },
      {
        slug: "a2-discuss-shared-expenses",
        title: "درباره هزینه مشترک حرف بزن",
        description: "پرداخت، سهم و حساب مشترک را توضیح بده.",
        focus: "هزینه مشترک",
        word: "die Ausgabe",
        meaning: "هزینه",
        phrase: "Wir teilen die Ausgabe durch drei.",
        phraseMeaning: "هزینه را بین سه نفر تقسیم می‌کنیم",
        blankSentence: "Wir teilen die Ausgabe durch ___.",
        blankAnswer: "drei",
        blankChoices: ["drei", "frei", "breit"],
        orderedWords: ["Wir", "teilen", "die", "Ausgabe", "durch", "drei"],
        grammarPoint: "برای تقسیم هزینه می‌توان از teilen durch استفاده کرد.",
        situation: "بعد از یک خرید گروهی درباره سهم هر نفر حرف می‌زنید.",
        miniText: "Drei Freunde kaufen ein Geschenk. Sie teilen die Ausgabe durch drei.",
        miniAnswer: "سه دوست هزینه را تقسیم می‌کنند."
      },
      {
        slug: "a2-write-a-clear-message",
        title: "پیام روشن بنویس",
        description: "در پیام کوتاه درخواست، خبر و جزئیات لازم را بیان کن.",
        focus: "پیام",
        word: "die Ueberweisung",
        meaning: "حواله / انتقال بانکی",
        phrase: "Ich schicke dir morgen die Ueberweisung.",
        phraseMeaning: "فردا حواله بانکی را برایت می‌فرستم",
        blankSentence: "Ich schicke dir morgen die ___.",
        blankAnswer: "Ueberweisung",
        blankChoices: ["Ueberweisung", "Unterkunft", "Uebung"],
        orderedWords: ["Ich", "schicke", "dir", "morgen", "die", "Ueberweisung"],
        grammarPoint: "در جمله Ich schicke dir... ضمیر dir داتیو است.",
        situation: "در پیام کوتاه درباره پرداخت به دوستتان خبر می‌دهید.",
        miniText: "Ali bezahlt heute nicht bar. Er schickt morgen die Ueberweisung.",
        miniAnswer: "علی فردا انتقال بانکی می‌فرستد."
      }
    ]
  },
  {
    slug: "a2-travel-directions-and-holiday-experiences",
    title: "سفر، مسیر و تجربه‌های تعطیلات",
    summary: "سفر کوتاه، مسیر هتل، همسفر و تجربه‌های تعطیلات را توصیف کنید.",
    resourceFocus: "سفر، مسیر، هتل و تجربه",
    skills: [
      {
        slug: "a2-plan-a-short-trip",
        title: "سفر کوتاه برنامه‌ریزی کن",
        description: "مقصد، زمان، وسیله سفر و فعالیت‌ها را هماهنگ کن.",
        focus: "سفر کوتاه",
        word: "der Ausflug",
        meaning: "سفر کوتاه / گردش",
        phrase: "Wir machen am Sonntag einen Ausflug.",
        phraseMeaning: "یکشنبه یک گردش می‌رویم",
        blankSentence: "Wir machen am Sonntag einen ___.",
        blankAnswer: "Ausflug",
        blankChoices: ["Ausflug", "Ausweis", "Ausgang"],
        orderedWords: ["Wir", "machen", "am", "Sonntag", "einen", "Ausflug"],
        grammarPoint: "برای فعالیت در یک روز مشخص از am + روز هفته استفاده می‌شود.",
        situation: "برای یک سفر کوتاه آخر هفته برنامه می‌ریزید.",
        miniText: "Die Klasse macht am Sonntag einen Ausflug nach Potsdam.",
        miniAnswer: "کلاس یکشنبه به پوتسدام می‌رود."
      },
      {
        slug: "a2-ask-for-hotel-directions",
        title: "مسیر هتل را بپرس",
        description: "آدرس، مسیر و نشانه‌های شهری را دنبال کن.",
        focus: "مسیر",
        word: "die Wegbeschreibung",
        meaning: "توضیح مسیر",
        phrase: "Koennen Sie mir den Weg zum Hotel beschreiben?",
        phraseMeaning: "می‌توانید مسیر هتل را برایم توضیح دهید؟",
        blankSentence: "Koennen Sie mir den Weg zum Hotel ___?",
        blankAnswer: "beschreiben",
        blankChoices: ["beschreiben", "bestellen", "bezahlen"],
        orderedWords: ["Koennen", "Sie", "mir", "den", "Weg", "beschreiben"],
        grammarPoint: "در درخواست مودبانه با Koennen Sie، فعل اصلی در پایان جمله می‌آید.",
        situation: "در شهر جدید مسیر هتل را می‌پرسید.",
        miniText: "Am Bahnhof fragt Amir nach dem Weg zum Hotel. Eine Frau beschreibt den Weg.",
        miniAnswer: "امیر مسیر هتل را می‌پرسد."
      },
      {
        slug: "a2-find-a-travel-partner",
        title: "همسفر پیدا کن",
        description: "علاقه‌ها، برنامه و انتظار از همسفر را بیان کن.",
        focus: "همسفر",
        word: "der Reisepartner",
        meaning: "همسفر",
        phrase: "Ich suche einen Reisepartner fuer die Ferien.",
        phraseMeaning: "برای تعطیلات دنبال یک همسفر هستم",
        blankSentence: "Ich suche einen Reisepartner fuer die ___.",
        blankAnswer: "Ferien",
        blankChoices: ["Ferien", "Feier", "Farbe"],
        orderedWords: ["Ich", "suche", "einen", "Reisepartner"],
        grammarPoint: "بعد از suchen مفعول مستقیم با آکوزاتیو می‌آید: einen Reisepartner.",
        situation: "در یک پیام کوتاه درباره همسفر مناسب می‌نویسید.",
        miniText: "Sara reist nicht gern allein. Sie sucht einen Reisepartner fuer die Ferien.",
        miniAnswer: "سارا دنبال همسفر است."
      },
      {
        slug: "a2-describe-holiday-photos",
        title: "عکس‌های سفر را توصیف کن",
        description: "مکان، آدم‌ها و حس یک عکس سفر را توضیح بده.",
        focus: "عکس سفر",
        word: "das Urlaubsfoto",
        meaning: "عکس تعطیلات",
        phrase: "Auf dem Urlaubsfoto sieht man das Meer.",
        phraseMeaning: "در عکس تعطیلات دریا دیده می‌شود",
        blankSentence: "Auf dem Urlaubsfoto sieht man das ___.",
        blankAnswer: "Meer",
        blankChoices: ["Meer", "Mehr", "Messer"],
        orderedWords: ["Auf", "dem", "Urlaubsfoto", "sieht", "man", "das", "Meer"],
        grammarPoint: "برای گفتن چیزی که در عکس دیده می‌شود، ساختار Auf dem Foto sieht man... کاربردی است.",
        situation: "برای دوستتان یک عکس سفر را توضیح می‌دهید.",
        miniText: "Auf dem Foto sieht man das Meer und zwei Freunde. Das Wetter war warm.",
        miniAnswer: "در عکس دریا و دو دوست دیده می‌شود."
      }
    ]
  }
];

const a2DraftUnits: Array<Omit<UnitSpec, "skills"> & { skills: Array<Pick<SkillSpec, "slug" | "title" | "description" | "focus">> }> = [
  {
    slug: "a2-appearance-and-recommendations",
    title: "ظاهر، لباس و پیشنهاد دادن",
    summary: "لباس و ظاهر را توصیف کنید، در خرید نظر بدهید و پیشنهاد یا توصیه مودبانه بسازید.",
    resourceFocus: "لباس، ظاهر، خرید و پیشنهاد",
    skills: [
      { slug: "a2-describe-clothes-and-style", title: "لباس و استایل را توصیف کن", description: "رنگ، جنس و ظاهر لباس‌ها را با جمله‌های دقیق‌تر بیان کن.", focus: "لباس و ظاهر" },
      { slug: "a2-shop-for-clothes", title: "در خرید لباس گفتگو کن", description: "سایز، قیمت، پسندیدن و عوض کردن گزینه‌ها را تمرین کن.", focus: "خرید لباس" },
      { slug: "a2-talk-about-public-figures", title: "درباره چهره‌های معروف حرف بزن", description: "ظاهر و تاثیر یک شخص شناخته‌شده را کوتاه توصیف کن.", focus: "توصیف افراد" },
      { slug: "a2-make-a-recommendation", title: "پیشنهاد مودبانه بده", description: "با ساختارهای ساده پیشنهاد بده و دلیل کوتاه بیاور.", focus: "پیشنهاد دادن" }
    ]
  },
  {
    slug: "a2-family-relationships-and-friends",
    title: "خانواده، رابطه‌ها و دوستان",
    summary: "درباره خانواده، رابطه‌ها، زوج‌ها، دوستی و تغییرات زندگی شخصی صحبت کنید.",
    resourceFocus: "خانواده، رابطه‌ها و دوستی",
    skills: [
      { slug: "a2-describe-family-relationships", title: "رابطه‌های خانوادگی را توصیف کن", description: "نسبت‌ها، نقش‌ها و وضعیت خانوادگی را روشن بیان کن.", focus: "خانواده" },
      { slug: "a2-talk-about-couples-and-plans", title: "درباره زوج‌ها و برنامه‌ها حرف بزن", description: "برنامه‌های مشترک، ازدواج یا زندگی مشترک را ساده توضیح بده.", focus: "رابطه‌ها" },
      { slug: "a2-describe-friendships", title: "دوستی‌ها را توصیف کن", description: "درباره آشنایی، اعتماد و فعالیت‌های مشترک حرف بزن.", focus: "دوستی" },
      { slug: "a2-family-and-friends-check-in", title: "خبر خانواده و دوستان را بپرس", description: "حال و خبر افراد نزدیک را در گفتگوی طبیعی دنبال کن.", focus: "خبر گرفتن" }
    ]
  },
  {
    slug: "a2-housing-stays-and-email",
    title: "خانه، اقامت و ایمیل",
    summary: "اقامت، خانه، آشپزخانه، درخواست‌های خانگی و ایمیل‌های کاربردی را تمرین کنید.",
    resourceFocus: "خانه، اقامت، وسایل و ایمیل",
    skills: [
      { slug: "a2-arrange-a-home-stay", title: "اقامت را هماهنگ کن", description: "درباره خانه، اتاق، زمان ورود و نیازها سوال بپرس.", focus: "اقامت" },
      { slug: "a2-write-a-practical-email", title: "ایمیل کاربردی بنویس", description: "درخواست، توضیح کوتاه و پایان مودبانه را در ایمیل تمرین کن.", focus: "ایمیل" },
      { slug: "a2-describe-kitchen-and-home-items", title: "وسایل خانه را توصیف کن", description: "وسایل آشپزخانه و محل آن‌ها را با جمله‌های دقیق‌تر بگو.", focus: "وسایل خانه" },
      { slug: "a2-ask-someone-to-place-items", title: "از کسی بخواه چیزی را جابه‌جا کند", description: "درخواست‌های خانگی و ضمیرهای مفعولی را تمرین کن.", focus: "درخواست خانگی" }
    ]
  },
  {
    slug: "a2-food-parties-and-restaurants",
    title: "غذا، مهمانی و رستوران",
    summary: "درباره خرید، مهمانی، غذا خوردن بیرون و تجربه رستوران صحبت کنید.",
    resourceFocus: "غذا، مهمانی، رستوران و خرید",
    skills: [
      { slug: "a2-discuss-shopping-and-packaging", title: "درباره خرید و بسته‌بندی حرف بزن", description: "انتخاب‌های روزمره و نظر درباره مصرف را بیان کن.", focus: "خرید و بسته‌بندی" },
      { slug: "a2-plan-a-childrens-party", title: "یک مهمانی را برنامه‌ریزی کن", description: "خوراکی‌ها، زمان و کارهای لازم برای مهمانی را هماهنگ کن.", focus: "مهمانی" },
      { slug: "a2-order-and-react-in-a-restaurant", title: "در رستوران سفارش بده و واکنش نشان بده", description: "سفارش، نظر درباره غذا و درخواست مودبانه را تمرین کن.", focus: "رستوران" },
      { slug: "a2-describe-a-meal-experience", title: "تجربه یک غذا را توصیف کن", description: "درباره یک وعده غذا، مکان و حس کلی آن حرف بزن.", focus: "تجربه غذا" }
    ]
  },
  {
    slug: "a2-urban-culture-and-events",
    title: "فرهنگ شهری و رویدادها",
    summary: "هنر شهری، سفر کم‌هزینه، سینمای روباز و اجرای کوتاه را در شهر دنبال کنید.",
    resourceFocus: "فرهنگ شهری، سفر و رویداد",
    skills: [
      { slug: "a2-talk-about-street-art", title: "درباره هنر شهری حرف بزن", description: "اثر هنری، مکان و نظر شخصی را کوتاه توصیف کن.", focus: "هنر شهری" },
      { slug: "a2-plan-a-backpack-trip", title: "سفر کوله‌گردی را برنامه‌ریزی کن", description: "بودجه، مسیر و وسایل ضروری را توضیح بده.", focus: "سفر کم‌هزینه" },
      { slug: "a2-discuss-open-air-events", title: "درباره رویداد روباز حرف بزن", description: "زمان، مکان، بلیت و علاقه به یک برنامه فرهنگی را بیان کن.", focus: "رویداد شهری" },
      { slug: "a2-share-a-short-performance", title: "یک اجرای کوتاه را معرفی کن", description: "موضوع، حس و واکنش مخاطب را ساده توضیح بده.", focus: "اجرا" }
    ]
  },
  {
    slug: "a2-school-work-and-dream-jobs",
    title: "مدرسه، کار و شغل رویایی",
    summary: "برنامه آموزشی، مدرسه، شغل‌ها و مسیر شغلی دلخواه را توصیف کنید.",
    resourceFocus: "مدرسه، کار و شغل",
    skills: [
      { slug: "a2-describe-a-plan", title: "یک برنامه را توضیح بده", description: "مراحل، زمان و هدف یک برنامه آموزشی یا کاری را بیان کن.", focus: "برنامه" },
      { slug: "a2-talk-about-school-experience", title: "درباره تجربه مدرسه حرف بزن", description: "درس‌ها، معلم‌ها و مسیر آموزشی را توضیح بده.", focus: "مدرسه" },
      { slug: "a2-compare-jobs", title: "شغل‌ها را مقایسه کن", description: "وظیفه‌ها، محیط کار و علاقه شخصی را مقایسه کن.", focus: "شغل‌ها" },
      { slug: "a2-describe-your-dream-job", title: "شغل رویایی‌ات را توضیح بده", description: "دلیل انتخاب شغل و توانایی‌های لازم را بیان کن.", focus: "شغل رویایی" }
    ]
  },
  {
    slug: "a2-health-happiness-and-satisfaction",
    title: "سلامت، خوشبختی و رضایت",
    summary: "درباره سلامت، توصیه پزشکی، رضایت و چیزهایی که خوشحال‌تان می‌کند حرف بزنید.",
    resourceFocus: "سلامت، خوشبختی و رضایت",
    skills: [
      { slug: "a2-explain-symptoms-to-a-doctor", title: "علائم را برای پزشک توضیح بده", description: "درد، مدت و شدت مشکل را روشن بیان کن.", focus: "پزشک" },
      { slug: "a2-talk-about-happiness", title: "درباره خوشبختی حرف بزن", description: "چیزهایی را که برایت مهم و خوشحال‌کننده‌اند بیان کن.", focus: "خوشبختی" },
      { slug: "a2-describe-a-satisfied-person", title: "یک فرد راضی را توصیف کن", description: "سبک زندگی و دلیل رضایت یک نفر را توضیح بده.", focus: "رضایت" },
      { slug: "a2-give-health-advice", title: "توصیه سلامتی بده", description: "با باید و بهتر است توصیه ساده و محترمانه بساز.", focus: "توصیه" }
    ]
  },
  {
    slug: "a2-media-apps-and-free-time",
    title: "رسانه، اپلیکیشن و وقت آزاد",
    summary: "برنامه تلویزیونی، اپلیکیشن محبوب، روز مورد علاقه و فعالیت‌های آزاد را بیان کنید.",
    resourceFocus: "رسانه، اپلیکیشن و وقت آزاد",
    skills: [
      { slug: "a2-discuss-tv-programs", title: "درباره برنامه تلویزیونی حرف بزن", description: "نوع برنامه، زمان پخش و نظر شخصی را بیان کن.", focus: "تلویزیون" },
      { slug: "a2-present-a-favorite-app", title: "اپلیکیشن محبوبت را معرفی کن", description: "کاربرد، مزیت و دلیل علاقه به یک اپ را توضیح بده.", focus: "اپلیکیشن" },
      { slug: "a2-describe-a-favorite-day", title: "روز مورد علاقه‌ات را توصیف کن", description: "برنامه روز، فعالیت‌ها و حس شخصی را توضیح بده.", focus: "روز محبوب" },
      { slug: "a2-plan-free-time", title: "وقت آزاد را برنامه‌ریزی کن", description: "پیشنهاد، زمان و ترجیح برای فعالیت آزاد را بیان کن.", focus: "وقت آزاد" }
    ]
  },
  {
    slug: "a2-social-behavior-compliments-and-gifts",
    title: "رفتار اجتماعی، تعریف و هدیه",
    summary: "رفتار مودبانه، تعریف کردن، آشنایی و هدیه دادن را در موقعیت‌های اجتماعی تمرین کنید.",
    resourceFocus: "رفتار اجتماعی، تعریف و هدیه",
    skills: [
      { slug: "a2-sound-friendly-and-polite", title: "دوستانه و مودبانه حرف بزن", description: "لحن مناسب، خواهش و پاسخ محترمانه را تمرین کن.", focus: "ادب اجتماعی" },
      { slug: "a2-make-and-respond-to-compliments", title: "تعریف کن و پاسخ بده", description: "تعریف کوتاه، تشکر و واکنش طبیعی را بساز.", focus: "تعریف" },
      { slug: "a2-describe-a-person-you-want-to-meet", title: "فرد مناسب برای آشنایی را توصیف کن", description: "ویژگی‌ها، علاقه‌ها و انتظارها را محترمانه بیان کن.", focus: "آشنایی" },
      { slug: "a2-choose-a-gift", title: "هدیه انتخاب کن", description: "درباره مناسبت، سلیقه و دلیل انتخاب هدیه حرف بزن.", focus: "هدیه" }
    ]
  },
  {
    slug: "a2-money-banking-and-messages",
    title: "پول، بانک و پیام‌ها",
    summary: "درباره ارزش پول، بانک، حساب، پرداخت و پیام‌های روزمره صحبت کنید.",
    resourceFocus: "پول، بانک و پیام",
    skills: [
      { slug: "a2-talk-about-money-values", title: "درباره پول و ارزش‌ها حرف بزن", description: "اولویت‌های مالی و غیرمالی را با مقایسه ساده بیان کن.", focus: "ارزش پول" },
      { slug: "a2-understand-a-bank-service", title: "خدمات بانکی را بفهم", description: "اطلاعات پایه درباره بانک، کارت و حساب را دنبال کن.", focus: "بانک" },
      { slug: "a2-discuss-shared-expenses", title: "درباره هزینه مشترک حرف بزن", description: "پرداخت، سهم و حساب مشترک را توضیح بده.", focus: "هزینه مشترک" },
      { slug: "a2-write-a-clear-message", title: "پیام روشن بنویس", description: "در پیام کوتاه درخواست، خبر و جزئیات لازم را بیان کن.", focus: "پیام" }
    ]
  },
  {
    slug: "a2-travel-directions-and-holiday-experiences",
    title: "سفر، مسیر و تجربه‌های تعطیلات",
    summary: "سفر کوتاه، مسیر هتل، همسفر و تجربه‌های تعطیلات را توصیف کنید.",
    resourceFocus: "سفر، مسیر، هتل و تجربه",
    skills: [
      { slug: "a2-plan-a-short-trip", title: "سفر کوتاه برنامه‌ریزی کن", description: "مقصد، زمان، وسیله سفر و فعالیت‌ها را هماهنگ کن.", focus: "سفر کوتاه" },
      { slug: "a2-ask-for-hotel-directions", title: "مسیر هتل را بپرس", description: "آدرس، مسیر و نشانه‌های شهری را دنبال کن.", focus: "مسیر" },
      { slug: "a2-find-a-travel-partner", title: "همسفر پیدا کن", description: "علاقه‌ها، برنامه و انتظار از همسفر را بیان کن.", focus: "همسفر" },
      { slug: "a2-describe-holiday-photos", title: "عکس‌های سفر را توصیف کن", description: "مکان، آدم‌ها و حس یک عکس سفر را توضیح بده.", focus: "عکس سفر" }
    ]
  }
];

function makeDraftSkill(spec: Pick<SkillSpec, "slug" | "title" | "description" | "focus">): SampleSkill {
  return {
    id: spec.slug,
    slug: spec.slug,
    title: spec.title,
    description: spec.description,
    kind: "REGULAR",
    xp: 80,
    requeueIncorrect: true,
    publicationStatus: "DRAFT",
    questions: []
  };
}

function makeFinalTestForLevel(levelLabel: "A2" | "B1" | "B2", units: SampleUnit[]): SampleSkill {
  const slug = `${levelLabel.toLowerCase()}-final-test`;
  const publishedRegularQuestions = units
    .flatMap((unit) => unit.skills)
    .filter((skill) => skill.kind === "REGULAR" && skill.publicationStatus === "PUBLISHED")
    .flatMap((skill) => skill.questions);
  const questionsByType = {
    multipleChoice: publishedRegularQuestions.filter((question) => question.type === "MULTIPLE_CHOICE"),
    fillInBlank: publishedRegularQuestions.filter((question) => question.type === "FILL_IN_BLANK"),
    wordOrdering: publishedRegularQuestions.filter((question) => question.type === "WORD_ORDERING")
  };
  const questions = [
    ...questionsByType.multipleChoice.filter((_, index) => index % 5 === 0).slice(0, 10),
    ...questionsByType.fillInBlank.filter((_, index) => index % 4 === 0).slice(0, 10),
    ...questionsByType.wordOrdering.filter((_, index) => index % 3 === 0).slice(0, 10)
  ].map((question, index) => cloneQuestion(question, slug, index + 1));

  return {
    id: slug,
    slug,
    title: `آزمون نهایی ${levelLabel}`,
    description: `آمادگی خودت را در کل مسیر ${levelLabel} با سوال‌های ترکیبی و تجمعی بسنج.`,
    kind: "FINAL_TEST",
    xp: 300,
    passingScore: 75,
    requeueIncorrect: false,
    publicationStatus: "PUBLISHED",
    questions
  };
}

function makeA2FinalTest(units: SampleUnit[]): SampleSkill {
  return makeFinalTestForLevel("A2", units);
}

function buildA2Units(): SampleUnit[] {
  const publishedUnits = a2PublishedUnitSpecs.map((unit) => {
    const skills = unit.skills.map((skill) =>
      makeSkill(skill, "PUBLISHED", makeA2SkillQuestions)
    );

    return {
      slug: unit.slug,
      title: unit.title,
      summary: unit.summary,
      skills: [...skills, makeA2Checkpoint(unit, skills)]
    };
  });
  const units: SampleUnit[] = [
    ...publishedUnits,
    ...a2DraftUnits.slice(11).map((unit) => {
      const skills = unit.skills.map((skill) => makeDraftSkill(skill));

      return {
        slug: unit.slug,
        title: unit.title,
        summary: unit.summary,
        skills: [
          ...skills,
          makeA2Checkpoint({ ...unit, skills: [] }, skills, "DRAFT")
        ]
      };
    })
  ];

  units[units.length - 1].skills.push(makeA2FinalTest(units));

  return units;
}

const b1UnitOneSpec: UnitSpec = {
  slug: "b1-travel-plans-and-holiday-stories",
  title: "برنامه سفر و داستان تعطیلات",
  summary: "سفر را برنامه‌ریزی کنید، ترجیح‌ها و دلیل‌ها را توضیح دهید، تجربه تعطیلات را روایت کنید و اطلاعیه‌های سفر را بفهمید.",
  resourceFocus: "برنامه سفر، ترجیح‌ها، روایت تعطیلات و اطلاعیه‌های سفر",
  skills: [
    {
      slug: "b1-plan-a-trip-and-explain-preferences",
      title: "سفر را برنامه‌ریزی کن و ترجیح بده",
      description: "درباره نوع سفر، علاقه یا بی‌علاقگی و دلیل انتخاب مقصد با جمله‌های دقیق‌تر صحبت کن.",
      focus: "برنامه سفر و ترجیح",
      word: "die Vorliebe",
      meaning: "ترجیح / علاقه شخصی",
      phrase: "Ich habe Lust, ans Meer zu fahren.",
      phraseMeaning: "دلم می‌خواهد به دریا بروم",
      blankSentence: "Ich habe Lust, ans Meer ___ fahren.",
      blankAnswer: "zu",
      blankChoices: ["zu", "weil", "obwohl"],
      orderedWords: ["Ich", "habe", "Lust", "ans", "Meer", "zu", "fahren"],
      grammarPoint: "بعد از Lust haben می‌توان از zu + مصدر استفاده کرد: Lust haben, etwas zu machen.",
      situation: "دوستتان مقصدهای مختلف پیشنهاد می‌دهد و شما ترجیح خودتان را توضیح می‌دهید.",
      miniText: "Neda moechte nicht in die Berge fahren. Sie hat Lust, ans Meer zu fahren, weil sie Ruhe braucht.",
      miniAnswer: "ندا سفر کنار دریا را ترجیح می‌دهد."
    },
    {
      slug: "b1-understand-and-discuss-travel-options",
      title: "گزینه‌های سفر را بفهم و مقایسه کن",
      description: "پیشنهادهای سفر، قیمت، مسیر و شرایط را بفهم و درباره مناسب بودن آن‌ها نظر بده.",
      focus: "پیشنهاد سفر و دلیل",
      word: "das Reiseangebot",
      meaning: "پیشنهاد سفر / بسته سفر",
      phrase: "Dieses Angebot passt zu meinem Budget.",
      phraseMeaning: "این پیشنهاد با بودجه من جور است",
      blankSentence: "Dieses Angebot passt zu meinem ___.",
      blankAnswer: "Budget",
      blankChoices: ["Budget", "Gepaeck", "Bahnhof"],
      orderedWords: ["Dieses", "Angebot", "passt", "zu", "meinem", "Budget"],
      grammarPoint: "فعل passen zu با داتیو می‌آید: zu meinem Budget.",
      situation: "دو پیشنهاد سفر را از نظر قیمت و زمان حرکت مقایسه می‌کنید.",
      miniText: "Das erste Angebot ist billig, aber der Zug faehrt sehr frueh. Das zweite Angebot passt besser zu Amirs Budget und Zeitplan.",
      miniAnswer: "پیشنهاد دوم برای امیر مناسب‌تر است."
    },
    {
      slug: "b1-tell-a-holiday-story-in-the-past",
      title: "داستان تعطیلات را در گذشته تعریف کن",
      description: "یک تجربه سفر را با زمان گذشته، ترتیب رویدادها و تضادهای ساده روایت کن.",
      focus: "روایت تعطیلات",
      word: "die Urlaubsgeschichte",
      meaning: "داستان تعطیلات",
      phrase: "Obwohl der Zug spaet war, sind wir ruhig geblieben.",
      phraseMeaning: "با اینکه قطار دیر بود، ما آرام ماندیم",
      blankSentence: "___ der Zug spaet war, sind wir ruhig geblieben.",
      blankAnswer: "Obwohl",
      blankChoices: ["Obwohl", "Deshalb", "Trotz"],
      orderedWords: ["Obwohl", "der", "Zug", "spaet", "war", "sind", "wir", "ruhig", "geblieben"],
      grammarPoint: "در جمله فرعی با obwohl فعل صرف‌شده به پایان بخش فرعی می‌رود.",
      situation: "در کلاس درباره یک سفر سخت اما موفق صحبت می‌کنید.",
      miniText: "Der Zug war spaet und das Hotelzimmer war klein. Trotzdem sagt Leila: Die Reise war schoen, weil wir viel gesehen haben.",
      miniAnswer: "لیلا با وجود مشکل‌ها از سفر راضی است."
    },
    {
      slug: "b1-understand-announcements-and-travel-updates",
      title: "اطلاعیه‌ها و تغییرات سفر را بفهم",
      description: "اطلاعیه‌های ایستگاه، تغییر مسیر، تاخیر و اطلاعات مهم سفر را دنبال کن.",
      focus: "درک اطلاعیه سفر",
      word: "die Durchsage",
      meaning: "اعلام / اطلاعیه بلندگو",
      phrase: "Die Durchsage informiert ueber eine Verspaetung.",
      phraseMeaning: "اعلام بلندگو درباره یک تاخیر اطلاع می‌دهد",
      blankSentence: "Die Durchsage informiert ueber eine ___.",
      blankAnswer: "Verspaetung",
      blankChoices: ["Verspaetung", "Vorliebe", "Bewerbung"],
      orderedWords: ["Die", "Durchsage", "informiert", "ueber", "eine", "Verspaetung"],
      grammarPoint: "بعد از ueber برای موضوع اطلاع‌رسانی، اسم با آکوزاتیو می‌آید: ueber eine Verspaetung.",
      situation: "در ایستگاه باید بفهمید قطار از کدام سکو و با چه تاخیری حرکت می‌کند.",
      miniText: "Die Durchsage sagt: Der Zug nach Hamburg faehrt heute von Gleis acht ab und hat zehn Minuten Verspaetung.",
      miniAnswer: "قطار از سکوی هشت با ده دقیقه تاخیر حرکت می‌کند."
    }
  ]
};

const b1DraftUnits: Array<Omit<UnitSpec, "skills"> & { skills: Array<Pick<SkillSpec, "slug" | "title" | "description" | "focus">> }> = [
  {
    slug: "b1-everyday-services-technology-and-opinions",
    title: "خدمات روزمره، تکنولوژی و نظر",
    summary: "درباره خدمات، دستگاه‌ها، تبلیغات، شکایت و نظر شخصی با دلیل و نتیجه صحبت کنید.",
    resourceFocus: "خدمات، تکنولوژی، تبلیغات و نظر",
    skills: [
      { slug: "b1-discuss-services-and-devices", title: "درباره خدمات و دستگاه‌ها حرف بزن", description: "نیاز، مشکل و کاربرد دستگاه‌ها یا خدمات روزمره را توضیح بده.", focus: "خدمات و دستگاه‌ها" },
      { slug: "b1-make-a-complaint-politely", title: "مودبانه شکایت کن", description: "مشکل را روشن بگو، نتیجه بخواه و لحن مودبانه را حفظ کن.", focus: "شکایت" },
      { slug: "b1-explain-consequences", title: "نتیجه و پیامد را بیان کن", description: "با deshalb، deswegen و sodass رابطه علت و نتیجه بساز.", focus: "پیامدها" },
      { slug: "b1-respond-to-advertising", title: "به تبلیغات واکنش نشان بده", description: "تبلیغ را بفهم، مقایسه کن و نظر خودت را با دلیل بیان کن.", focus: "تبلیغات" }
    ]
  },
  {
    slug: "b1-life-changes-memories-and-manners",
    title: "تغییرات زندگی، خاطره و رفتار مودبانه",
    summary: "درباره تغییرات زندگی، گذشته، خوشبختی، زمان رویدادها و رفتار مناسب صحبت کنید.",
    resourceFocus: "تغییرات، خاطره، خوشبختی و ادب",
    skills: [
      { slug: "b1-describe-life-changes", title: "تغییرات زندگی را توصیف کن", description: "رویدادهای مهم و تغییرات شخصی را با زمان گذشته بیان کن.", focus: "تغییرات زندگی" },
      { slug: "b1-narrate-past-events", title: "رویدادهای گذشته را روایت کن", description: "ترتیب زمان، دلیل و نتیجه را در یک روایت کوتاه نگه دار.", focus: "روایت گذشته" },
      { slug: "b1-talk-about-happiness-and-values", title: "درباره خوشبختی و ارزش‌ها حرف بزن", description: "تعریف شخصی از خوشبختی و چیزهای مهم زندگی را بیان کن.", focus: "خوشبختی" },
      { slug: "b1-speak-politely-in-sensitive-moments", title: "در موقعیت حساس مودبانه حرف بزن", description: "درخواست، عذرخواهی و اصلاح اشتباه را با لحن مناسب انجام بده.", focus: "ادب" }
    ]
  },
  {
    slug: "b1-work-applications-and-workplace-conversations",
    title: "کار، درخواست شغل و گفتگوی کاری",
    summary: "گفتگوهای کاری، آگهی شغلی، درخواست کار، عذرخواهی و تماس تلفنی حرفه‌ای را تمرین کنید.",
    resourceFocus: "کار، آگهی شغلی، درخواست و تماس کاری",
    skills: [
      { slug: "b1-understand-workplace-conversations", title: "گفتگوهای کاری را بفهم", description: "درخواست، مشکل و تصمیم را در محیط کار دنبال کن.", focus: "گفتگوی کاری" },
      { slug: "b1-read-job-ads-and-apply", title: "آگهی شغلی را بخوان و درخواست بده", description: "نیازهای آگهی را بفهم و اطلاعات مهم درخواست را آماده کن.", focus: "درخواست شغل" },
      { slug: "b1-apologize-and-respond-at-work", title: "در کار عذرخواهی و واکنش نشان بده", description: "اشتباه، تاخیر و راه‌حل را محترمانه بیان کن.", focus: "عذرخواهی کاری" },
      { slug: "b1-structure-a-formal-text", title: "متن رسمی را ساختار بده", description: "ایمیل یا پیام کاری را با شروع، بدنه و پایان روشن بنویس.", focus: "ساختار متن" }
    ]
  },
  {
    slug: "b1-environment-weather-and-public-action",
    title: "محیط زیست، آب‌وهوا و اقدام جمعی",
    summary: "درباره محیط زیست، آب‌وهوا، مقایسه، هدف و ایده‌های عملی برای تغییر صحبت کنید.",
    resourceFocus: "محیط زیست، آب‌وهوا، هدف و اقدام",
    skills: [
      { slug: "b1-compare-environmental-choices", title: "انتخاب‌های محیط‌زیستی را مقایسه کن", description: "گزینه‌ها را از نظر اثر، هزینه و امکان اجرا مقایسه کن.", focus: "مقایسه" },
      { slug: "b1-explain-goals-with-damit", title: "هدف را با damit توضیح بده", description: "برای یک اقدام هدف روشن بساز و دلیلش را بگو.", focus: "هدف" },
      { slug: "b1-discuss-weather-and-plans", title: "درباره آب‌وهوا و برنامه‌ها حرف بزن", description: "پیش‌بینی هوا را بفهم و برنامه مناسب پیشنهاد بده.", focus: "آب‌وهوا" },
      { slug: "b1-present-a-public-action", title: "یک اقدام عمومی را معرفی کن", description: "ایده، هدف، زمان و نقش افراد را در یک کنش کوتاه توضیح بده.", focus: "اقدام جمعی" }
    ]
  },
  {
    slug: "b1-future-plans-expectations-and-advice",
    title: "برنامه آینده، انتظارها و توصیه",
    summary: "درباره برنامه‌ها، آینده، انتظارها، توصیه‌ها و متن‌های طولانی‌تر صحبت کنید.",
    resourceFocus: "آینده، انتظار، توصیه و متن طولانی",
    skills: [
      { slug: "b1-talk-about-future-plans", title: "درباره برنامه آینده حرف بزن", description: "قصد، پیش‌بینی و برنامه شخصی را با Futur I بیان کن.", focus: "آینده" },
      { slug: "b1-understand-longer-articles", title: "متن طولانی‌تر را بفهم", description: "ایده اصلی و جزئیات مهم یک متن خبری یا مجله‌ای را پیدا کن.", focus: "درک متن" },
      { slug: "b1-give-practical-advice", title: "توصیه کاربردی بده", description: "مشکل را بفهم و چند توصیه روشن و محترمانه پیشنهاد کن.", focus: "توصیه" },
      { slug: "b1-describe-expectations", title: "انتظارها را دقیق‌تر توصیف کن", description: "امید، نگرانی و انتظار از آینده را با جمله‌های وابسته بیان کن.", focus: "انتظارها" }
    ]
  },
  {
    slug: "b1-friendships-relationships-and-conflict",
    title: "دوستی، رابطه و حل اختلاف",
    summary: "دوستی‌ها، رابطه‌ها، ترتیب زمانی، اختلاف و گفتگوی حل مشکل را تمرین کنید.",
    resourceFocus: "دوستی، رابطه، اختلاف و زمان",
    skills: [
      { slug: "b1-tell-a-friendship-story", title: "داستان یک دوستی را تعریف کن", description: "شروع، تغییر و لحظه‌های مهم یک دوستی را روایت کن.", focus: "داستان دوستی" },
      { slug: "b1-order-events-in-time", title: "رویدادها را زمانی مرتب کن", description: "با nachdem، bevor، waehrend و seitdem ترتیب اتفاق‌ها را بساز.", focus: "ترتیب زمانی" },
      { slug: "b1-talk-through-conflict", title: "درباره اختلاف گفتگو کن", description: "مشکل را بگو، احساس را بیان کن و پیشنهاد آشتی بده.", focus: "اختلاف" },
      { slug: "b1-present-a-couple-or-friendship", title: "یک رابطه یا دوستی را معرفی کن", description: "ویژگی‌ها، تاریخچه و دلیل اهمیت یک رابطه را توضیح بده.", focus: "معرفی رابطه" }
    ]
  },
  {
    slug: "b1-health-habits-music-and-learning",
    title: "سلامت، عادت‌ها، موسیقی و یادگیری",
    summary: "کمک، هشدار، عادت‌ها، احساسات، یادگیری واژه و اطلاعات سلامت را دنبال کنید.",
    resourceFocus: "سلامت، عادت، موسیقی و یادگیری",
    skills: [
      { slug: "b1-offer-and-refuse-help", title: "کمک پیشنهاد بده یا رد کن", description: "کمک را بپذیر، رد کن یا جایگزین محترمانه پیشنهاد بده.", focus: "کمک" },
      { slug: "b1-warn-and-give-health-advice", title: "هشدار و توصیه سلامتی بده", description: "خطر، عادت و توصیه را با ساختارهای دقیق‌تر بیان کن.", focus: "سلامت" },
      { slug: "b1-discuss-music-and-feelings", title: "درباره موسیقی و احساس حرف بزن", description: "تاثیر موسیقی و احساس شخصی را روشن توضیح بده.", focus: "موسیقی" },
      { slug: "b1-share-learning-strategies", title: "راهبرد یادگیری را به اشتراک بگذار", description: "روش حفظ واژه، تمرین و پیشرفت را برای دیگران توضیح بده.", focus: "یادگیری" }
    ]
  },
  {
    slug: "b1-art-culture-and-description",
    title: "هنر، فرهنگ و توصیف دقیق",
    summary: "درباره هنر، موزه، تئاتر، آواز، توصیف دقیق و پرسیدن دوباره تمرین کنید.",
    resourceFocus: "هنر، فرهنگ، توصیف و پرسش",
    skills: [
      { slug: "b1-talk-about-art-and-images", title: "درباره هنر و تصویر حرف بزن", description: "یک اثر یا تصویر را توصیف کن و برداشتت را بگو.", focus: "هنر" },
      { slug: "b1-ask-follow-up-questions", title: "سوال پیگیری بپرس", description: "وقتی چیزی روشن نیست، دقیق‌تر و مودبانه‌تر بپرس.", focus: "پیگیری" },
      { slug: "b1-describe-people-and-things-precisely", title: "آدم‌ها و چیزها را دقیق توصیف کن", description: "جزئیات، ویژگی‌ها و مقایسه‌های کوتاه را در توصیف نگه دار.", focus: "توصیف دقیق" },
      { slug: "b1-understand-cultural-programs", title: "برنامه فرهنگی را بفهم", description: "زمان، مکان، موضوع و شرایط یک برنامه فرهنگی را دنبال کن.", focus: "برنامه فرهنگی" }
    ]
  },
  {
    slug: "b1-community-institutions-and-social-engagement",
    title: "جامعه، نهادها و مشارکت اجتماعی",
    summary: "درباره ارزش‌های اجتماعی، پروژه‌ها، نهادهای شهری، اروپا و ارائه کوتاه صحبت کنید.",
    resourceFocus: "جامعه، نهادها، پروژه و ارائه",
    skills: [
      { slug: "b1-discuss-social-engagement", title: "درباره مشارکت اجتماعی حرف بزن", description: "یک فعالیت اجتماعی و دلیل اهمیت آن را توضیح بده.", focus: "مشارکت اجتماعی" },
      { slug: "b1-describe-processes-with-passive", title: "فرایندها را با مجهول توصیف کن", description: "بگو چه کاری انجام می‌شود، بدون اینکه همیشه فاعل مهم باشد.", focus: "مجهول" },
      { slug: "b1-understand-institutions", title: "نهادهای شهری را بفهم", description: "وظیفه، خدمات و نقش یک نهاد شهری یا عمومی را دنبال کن.", focus: "نهادها" },
      { slug: "b1-give-a-short-presentation", title: "ارائه کوتاه بده", description: "موضوع، ساختار، مثال و پایان یک ارائه کوتاه را آماده کن.", focus: "ارائه" }
    ]
  },
  {
    slug: "b1-city-life-mobility-and-written-communication",
    title: "زندگی شهری، رفت‌وآمد و نوشتار",
    summary: "زندگی در شهر، حمل‌ونقل، شهرهای دوست‌داشتنی، ایمیل و برنامه بازدید را تمرین کنید.",
    resourceFocus: "شهر، رفت‌وآمد، ایمیل و برنامه بازدید",
    skills: [
      { slug: "b1-discuss-city-life", title: "درباره زندگی شهری بحث کن", description: "مزیت‌ها، مشکل‌ها و تجربه زندگی در شهر را بیان کن.", focus: "زندگی شهری" },
      { slug: "b1-understand-mobility-information", title: "اطلاعات رفت‌وآمد را بفهم", description: "مسیر، وسیله، تغییر و پیشنهاد حمل‌ونقل را دنبال کن.", focus: "رفت‌وآمد" },
      { slug: "b1-write-to-different-recipients", title: "برای مخاطب‌های مختلف بنویس", description: "لحن و جزئیات پیام را برای دوست، اداره یا میزبان تنظیم کن.", focus: "نوشتار" },
      { slug: "b1-plan-a-city-visit", title: "بازدید شهری را برنامه‌ریزی کن", description: "برنامه، زمان‌بندی و دلیل انتخاب مکان‌ها را آماده کن.", focus: "برنامه بازدید" }
    ]
  },
  {
    slug: "b1-money-banking-and-global-choices",
    title: "پول، بانک و انتخاب‌های جهانی",
    summary: "گفتگوهای بانکی، اطلاعات وب‌سایت، بحث درباره پول، جهانی‌شدن و موقعیت‌های دشوار را دنبال کنید.",
    resourceFocus: "پول، بانک، جهانی‌شدن و بحث",
    skills: [
      { slug: "b1-handle-bank-conversations", title: "گفتگوی بانکی را مدیریت کن", description: "نیاز، سوال و اطلاعات حساب یا کارت را در بانک بیان کن.", focus: "بانک" },
      { slug: "b1-understand-web-information", title: "اطلاعات وب‌سایت را بفهم", description: "جزئیات مهم، شرط‌ها و اقدام بعدی را از متن آنلاین بیرون بکش.", focus: "وب‌سایت" },
      { slug: "b1-express-arguments-about-money", title: "درباره پول استدلال کن", description: "نظر، دلیل مخالف و مثال را در بحث مالی بیان کن.", focus: "استدلال" },
      { slug: "b1-describe-difficult-situations", title: "موقعیت دشوار را توصیف کن", description: "مسئله، احساس، انتخاب‌ها و نتیجه احتمالی را توضیح بده.", focus: "موقعیت دشوار" }
    ]
  }
];

const b1UnitLanguage = [
  {
    word: "die Vorliebe",
    meaning: "ترجیح / علاقه شخصی",
    phrase: "Ich habe Lust, ans Meer zu fahren.",
    phraseMeaning: "دلم می‌خواهد به دریا بروم",
    blankSentence: "Ich habe Lust, ans Meer ___ fahren.",
    blankAnswer: "zu",
    orderedWords: ["Ich", "habe", "Lust", "ans", "Meer", "zu", "fahren"],
    grammarPoint: "بعد از Lust haben می‌توان از zu + مصدر استفاده کرد.",
    miniAnswer: "گوینده سفر کنار دریا را ترجیح می‌دهد."
  },
  {
    word: "die Reklamation",
    meaning: "شکایت از کالا یا خدمت",
    phrase: "Ich reklamiere das Geraet, weil es nicht funktioniert.",
    phraseMeaning: "از دستگاه شکایت می‌کنم چون کار نمی‌کند",
    blankSentence: "Ich reklamiere das Geraet, ___ es nicht funktioniert.",
    blankAnswer: "weil",
    orderedWords: ["Ich", "reklamiere", "das", "Geraet", "weil", "es", "nicht", "funktioniert"],
    grammarPoint: "در جمله فرعی با weil فعل صرف‌شده در پایان جمله می‌آید.",
    miniAnswer: "دستگاه کار نمی‌کند و باید پیگیری شود."
  },
  {
    word: "die Veraenderung",
    meaning: "تغییر",
    phrase: "Frueher wohnte ich klein, heute wohne ich zentral.",
    phraseMeaning: "قبلا در خانه کوچک زندگی می‌کردم، امروز مرکزی زندگی می‌کنم",
    blankSentence: "___ wohnte ich klein, heute wohne ich zentral.",
    blankAnswer: "Frueher",
    orderedWords: ["Frueher", "wohnte", "ich", "in", "einer", "kleinen", "Wohnung"],
    grammarPoint: "برای روایت گذشته در B1 از Präteritum فعل‌های رایج مثل wohnte استفاده می‌شود.",
    miniAnswer: "زندگی گوینده نسبت به گذشته تغییر کرده است."
  },
  {
    word: "die Bewerbung",
    meaning: "درخواست شغل",
    phrase: "Wenn ich mehr Erfahrung haette, wuerde ich mich bewerben.",
    phraseMeaning: "اگر تجربه بیشتری داشتم، درخواست می‌دادم",
    blankSentence: "Wenn ich mehr Erfahrung haette, ___ ich mich bewerben.",
    blankAnswer: "wuerde",
    orderedWords: ["Ich", "wuerde", "mich", "gern", "bei", "Ihnen", "bewerben"],
    grammarPoint: "Konjunktiv II با würde برای موقعیت‌های فرضی و مودبانه کاربرد دارد.",
    miniAnswer: "گوینده درباره درخواست شغل به شکل مودبانه صحبت می‌کند."
  },
  {
    word: "der Umweltschutz",
    meaning: "حفاظت از محیط زیست",
    phrase: "Wir sparen Strom, damit die Umwelt geschuetzt wird.",
    phraseMeaning: "برق صرفه‌جویی می‌کنیم تا محیط زیست حفظ شود",
    blankSentence: "Wir sparen Strom, ___ die Umwelt geschuetzt wird.",
    blankAnswer: "damit",
    orderedWords: ["Wir", "sparen", "Strom", "damit", "die", "Umwelt", "geschuetzt", "wird"],
    grammarPoint: "با damit هدف یک عمل را بیان می‌کنیم و فعل در پایان جمله فرعی می‌آید.",
    miniAnswer: "هدف عمل، حفاظت از محیط زیست است."
  },
  {
    word: "die Zukunftsprognose",
    meaning: "پیش‌بینی آینده",
    phrase: "In Zukunft werden viele Menschen flexibler arbeiten.",
    phraseMeaning: "در آینده افراد زیادی انعطاف‌پذیرتر کار خواهند کرد",
    blankSentence: "In Zukunft ___ viele Menschen flexibler arbeiten.",
    blankAnswer: "werden",
    orderedWords: ["In", "Zukunft", "werden", "viele", "Menschen", "flexibler", "arbeiten"],
    grammarPoint: "Futur I با werden + مصدر برای پیش‌بینی یا برنامه آینده استفاده می‌شود.",
    miniAnswer: "متن درباره یک تغییر احتمالی در آینده صحبت می‌کند."
  },
  {
    word: "die Freundschaft",
    meaning: "دوستی",
    phrase: "Nachdem wir gestritten hatten, haben wir ruhig gesprochen.",
    phraseMeaning: "بعد از اینکه بحث کرده بودیم، آرام صحبت کردیم",
    blankSentence: "___ wir gestritten hatten, haben wir ruhig gesprochen.",
    blankAnswer: "Nachdem",
    orderedWords: ["Nachdem", "wir", "gestritten", "hatten", "haben", "wir", "ruhig", "gesprochen"],
    grammarPoint: "برای ترتیب دو رویداد گذشته می‌توان از nachdem و Plusquamperfekt استفاده کرد.",
    miniAnswer: "دو نفر بعد از اختلاف دوباره گفتگو کرده‌اند."
  },
  {
    word: "die Gewohnheit",
    meaning: "عادت",
    phrase: "Du brauchst nicht jeden Tag zwei Stunden zu lernen.",
    phraseMeaning: "لازم نیست هر روز دو ساعت درس بخوانی",
    blankSentence: "Du brauchst nicht jeden Tag zwei Stunden ___ lernen.",
    blankAnswer: "zu",
    orderedWords: ["Du", "brauchst", "nicht", "jeden", "Tag", "zu", "lernen"],
    grammarPoint: "ساختار nicht brauchen + zu + مصدر برای گفتن لازم نبودن کاری استفاده می‌شود.",
    miniAnswer: "گوینده فشار یادگیری را کمتر می‌کند."
  },
  {
    word: "die Beschreibung",
    meaning: "توصیف",
    phrase: "Das ist ein Bild, das mir sehr gut gefaellt.",
    phraseMeaning: "این تصویری است که خیلی دوستش دارم",
    blankSentence: "Das ist ein Bild, ___ mir sehr gut gefaellt.",
    blankAnswer: "das",
    orderedWords: ["Das", "ist", "ein", "Bild", "das", "mir", "gut", "gefaellt"],
    grammarPoint: "جمله موصولی با das اطلاعات دقیق‌تری درباره اسم خنثی می‌دهد.",
    miniAnswer: "گوینده یک تصویر را دقیق‌تر معرفی می‌کند."
  },
  {
    word: "das Engagement",
    meaning: "مشارکت اجتماعی",
    phrase: "In unserem Projekt wird alten Menschen geholfen.",
    phraseMeaning: "در پروژه ما به افراد مسن کمک می‌شود",
    blankSentence: "In unserem Projekt ___ alten Menschen geholfen.",
    blankAnswer: "wird",
    orderedWords: ["In", "unserem", "Projekt", "wird", "alten", "Menschen", "geholfen"],
    grammarPoint: "Passiv Präsens برای توصیف فرایند یا کار انجام‌شده استفاده می‌شود.",
    miniAnswer: "پروژه برای کمک اجتماعی طراحی شده است."
  },
  {
    word: "die Mobilitaet",
    meaning: "رفت‌وآمد / جابه‌جایی",
    phrase: "In der Stadt gibt es viele Wege, mit denen man schnell ankommt.",
    phraseMeaning: "در شهر راه‌های زیادی هست که با آن‌ها سریع می‌رسیم",
    blankSentence: "In der Stadt gibt es viele Wege, mit ___ man schnell ankommt.",
    blankAnswer: "denen",
    orderedWords: ["In", "der", "Stadt", "kommt", "man", "mit", "der", "Bahn", "schnell", "an"],
    grammarPoint: "در جمله موصولی بعد از mit از ضمیر موصولی داتیو جمع denen استفاده می‌شود.",
    miniAnswer: "متن درباره رفت‌وآمد در شهر صحبت می‌کند."
  },
  {
    word: "die Globalisierung",
    meaning: "جهانی‌شدن",
    phrase: "Je mehr wir vergleichen, desto bewusster entscheiden wir.",
    phraseMeaning: "هرچه بیشتر مقایسه کنیم، آگاهانه‌تر تصمیم می‌گیریم",
    blankSentence: "Je mehr wir vergleichen, ___ bewusster entscheiden wir.",
    blankAnswer: "desto",
    orderedWords: ["Je", "mehr", "wir", "vergleichen", "desto", "bewusster", "entscheiden", "wir"],
    grammarPoint: "ساختار je ... desto برای بیان رابطه دو تغییر استفاده می‌شود.",
    miniAnswer: "مقایسه بیشتر به تصمیم آگاهانه‌تر کمک می‌کند."
  }
] satisfies Array<Pick<SkillSpec, "word" | "meaning" | "phrase" | "phraseMeaning" | "blankSentence" | "blankAnswer" | "orderedWords" | "grammarPoint" | "miniAnswer">>;

function makeB1SkillSpec(
  unit: Omit<UnitSpec, "skills">,
  skill: Pick<SkillSpec, "slug" | "title" | "description" | "focus">,
  unitIndex: number
): SkillSpec {
  const language = b1UnitLanguage[unitIndex];

  return {
    ...skill,
    ...language,
    blankChoices: [language.blankAnswer, "weil", "obwohl"],
    situation: `در موضوع ${unit.resourceFocus} باید درباره «${skill.focus}» دقیق و روشن صحبت کنید.`,
    miniText: `Mina arbeitet an ${skill.focus}. ${language.phrase} Sie notiert die wichtigsten Informationen fuer den Kurs.`,
    miniAnswer: `${language.miniAnswer} این تمرین به «${skill.focus}» مربوط است.`
  };
}

function buildB1Units(): SampleUnit[] {
  const publishedUnitSpecs: UnitSpec[] = [
    b1UnitOneSpec,
    ...b1DraftUnits.map((unit, unitIndex) => ({
      slug: unit.slug,
      title: unit.title,
      summary: unit.summary,
      resourceFocus: unit.resourceFocus,
      skills: unit.skills.map((skill) =>
        makeB1SkillSpec(unit, skill, unitIndex + 1)
      )
    }))
  ];
  const units = publishedUnitSpecs.map((unit) => {
    const skills = unit.skills.map((skill) =>
    makeSkill(skill, "PUBLISHED", makeA2SkillQuestions)
    );

    return {
      slug: unit.slug,
      title: unit.title,
      summary: unit.summary,
      skills: [...skills, makeA2Checkpoint(unit, skills, "PUBLISHED", "B1")]
    };
  });

  units[units.length - 1].skills.push(makeFinalTestForLevel("B1", units));

  return units;
}

const b2UnitScaffolds: Array<Omit<UnitSpec, "skills"> & { skills: Array<Pick<SkillSpec, "slug" | "title" | "description" | "focus">> }> = [
  {
    slug: "b2-work-careers-and-professional-communication",
    title: "کار، مسیر شغلی و ارتباط حرفه‌ای",
    summary: "درباره مسیر شغلی، مسئولیت‌ها، همکاری، درخواست رسمی و بازخورد حرفه‌ای با دقت B2 صحبت کنید.",
    resourceFocus: "کار، مسیر شغلی، همکاری و نوشتار رسمی",
    skills: [
      { slug: "b2-discuss-career-paths", title: "مسیر شغلی را تحلیل کن", description: "تجربه، هدف، تغییر شغل و اولویت‌های کاری را با دلیل و مقایسه توضیح بده.", focus: "مسیر شغلی" },
      { slug: "b2-negotiate-workplace-responsibilities", title: "مسئولیت کاری را مذاکره کن", description: "وظیفه، زمان‌بندی، محدودیت و راه‌حل را در گفتگوی کاری روشن بیان کن.", focus: "مسئولیت کاری" },
      { slug: "b2-write-a-formal-request", title: "درخواست رسمی بنویس", description: "درخواست، زمینه، دلیل و انتظار پاسخ را در متن رسمی منسجم کن.", focus: "درخواست رسمی" },
      { slug: "b2-give-and-receive-feedback", title: "بازخورد حرفه‌ای بده و بگیر", description: "نقد سازنده، پیشنهاد بهبود و واکنش محترمانه را تمرین کن.", focus: "بازخورد" }
    ]
  },
  {
    slug: "b2-media-digital-life-and-public-opinion",
    title: "رسانه، زندگی دیجیتال و افکار عمومی",
    summary: "خبر، شبکه اجتماعی، حریم خصوصی، تبلیغات و اثر رسانه بر نظر عمومی را بررسی کنید.",
    resourceFocus: "رسانه، خبر، حریم خصوصی و افکار عمومی",
    skills: [
      { slug: "b2-evaluate-news-sources", title: "منبع خبری را ارزیابی کن", description: "اعتبار، زاویه دید و جزئیات مهم خبر را تشخیص بده.", focus: "منبع خبری" },
      { slug: "b2-discuss-social-media-habits", title: "عادت‌های شبکه اجتماعی را بحث کن", description: "فایده، خطر، عادت و مرزهای سالم استفاده دیجیتال را توضیح بده.", focus: "شبکه اجتماعی" },
      { slug: "b2-argue-about-data-privacy", title: "درباره حریم داده استدلال کن", description: "نگرانی، حق کاربر و مسئولیت شرکت‌ها را با ساختار استدلالی بیان کن.", focus: "حریم داده" },
      { slug: "b2-analyze-advertising-effects", title: "اثر تبلیغات را تحلیل کن", description: "پیام پنهان، گروه هدف و واکنش شخصی به تبلیغ را دقیق‌تر توضیح بده.", focus: "اثر تبلیغات" }
    ]
  },
  {
    slug: "b2-society-politics-and-civic-participation",
    title: "جامعه، سیاست و مشارکت شهروندی",
    summary: "درباره قانون، حقوق، مشارکت، بحث عمومی و تصمیم‌های اجتماعی موضع دقیق بگیرید.",
    resourceFocus: "جامعه، حقوق، سیاست و مشارکت",
    skills: [
      { slug: "b2-explain-civic-rights", title: "حقوق شهروندی را توضیح بده", description: "حق، مسئولیت و مثال اجتماعی را با زبان روشن B2 بیان کن.", focus: "حقوق شهروندی" },
      { slug: "b2-discuss-public-decisions", title: "تصمیم عمومی را بحث کن", description: "مزیت، عیب، ذی‌نفع و پیامد یک تصمیم عمومی را بررسی کن.", focus: "تصمیم عمومی" },
      { slug: "b2-present-a-social-initiative", title: "یک ابتکار اجتماعی را معرفی کن", description: "هدف، مشکل، گروه مخاطب و اثر احتمالی یک پروژه اجتماعی را ارائه بده.", focus: "ابتکار اجتماعی" },
      { slug: "b2-take-a-position-in-a-debate", title: "در بحث موضع بگیر", description: "نظر، دلیل، مثال و پاسخ به مخالفت را منظم بیان کن.", focus: "موضع‌گیری" }
    ]
  },
  {
    slug: "b2-environment-consumption-and-sustainability",
    title: "محیط زیست، مصرف و پایداری",
    summary: "مصرف، انرژی، آب‌وهوا، حمل‌ونقل و مسئولیت فردی یا جمعی را تحلیل کنید.",
    resourceFocus: "محیط زیست، مصرف، انرژی و پایداری",
    skills: [
      { slug: "b2-compare-sustainable-choices", title: "انتخاب‌های پایدار را مقایسه کن", description: "گزینه‌های مصرفی را از نظر اثر، هزینه و واقع‌بینی مقایسه کن.", focus: "انتخاب پایدار" },
      { slug: "b2-discuss-climate-responsibility", title: "مسئولیت اقلیمی را بحث کن", description: "نقش فرد، دولت و شرکت‌ها را در مسئله اقلیم توضیح بده.", focus: "مسئولیت اقلیمی" },
      { slug: "b2-explain-energy-saving-measures", title: "راهکار صرفه‌جویی انرژی را توضیح بده", description: "اقدام، دلیل، شرط و نتیجه صرفه‌جویی را به هم وصل کن.", focus: "صرفه‌جویی انرژی" },
      { slug: "b2-write-an-opinion-on-consumption", title: "نظر درباره مصرف بنویس", description: "متن کوتاه استدلالی درباره خرید، نیاز و عادت مصرفی آماده کن.", focus: "نظر درباره مصرف" }
    ]
  },
  {
    slug: "b2-health-psychology-and-wellbeing",
    title: "سلامت، روان‌شناسی و کیفیت زندگی",
    summary: "درباره سلامت جسم و روان، استرس، عادت‌ها، توصیه تخصصی و تعادل زندگی صحبت کنید.",
    resourceFocus: "سلامت، استرس، عادت و کیفیت زندگی",
    skills: [
      { slug: "b2-describe-stress-and-causes", title: "استرس و علت‌ها را توصیف کن", description: "نشانه، علت، پیامد و راه‌حل استرس را دقیق بیان کن.", focus: "استرس" },
      { slug: "b2-discuss-healthy-routines", title: "عادت سالم را بحث کن", description: "خواب، ورزش، تغذیه و مانع‌های تغییر عادت را توضیح بده.", focus: "عادت سالم" },
      { slug: "b2-understand-medical-advice", title: "توصیه پزشکی را بفهم", description: "توصیه، هشدار، شرط و اقدام بعدی در متن سلامت را دنبال کن.", focus: "توصیه پزشکی" },
      { slug: "b2-argue-for-work-life-balance", title: "برای تعادل زندگی استدلال کن", description: "نیاز، محدودیت، اولویت و پیشنهاد عملی برای تعادل کار و زندگی بساز.", focus: "تعادل زندگی" }
    ]
  },
  {
    slug: "b2-education-research-and-lifelong-learning",
    title: "آموزش، پژوهش و یادگیری مادام‌العمر",
    summary: "درباره آموزش، دانشگاه، پژوهش، روش یادگیری و ارزیابی منابع علمی صحبت کنید.",
    resourceFocus: "آموزش، پژوهش، دانشگاه و روش یادگیری",
    skills: [
      { slug: "b2-discuss-study-programs", title: "رشته و برنامه تحصیلی را بحث کن", description: "هدف، شرط پذیرش، مزیت و چالش یک مسیر تحصیلی را توضیح بده.", focus: "برنامه تحصیلی" },
      { slug: "b2-summarize-research-findings", title: "یافته پژوهشی را خلاصه کن", description: "موضوع، روش، نتیجه و محدودیت یک پژوهش ساده را بیان کن.", focus: "یافته پژوهشی" },
      { slug: "b2-evaluate-learning-strategies", title: "راهبرد یادگیری را ارزیابی کن", description: "روش‌ها را از نظر اثر، زمان و تناسب با هدف مقایسه کن.", focus: "راهبرد یادگیری" },
      { slug: "b2-participate-in-a-seminar", title: "در سمینار مشارکت کن", description: "سوال، موافقت، مخالفت و جمع‌بندی کوتاه در بحث آموزشی را تمرین کن.", focus: "مشارکت در سمینار" }
    ]
  },
  {
    slug: "b2-culture-literature-and-identity",
    title: "فرهنگ، ادبیات و هویت",
    summary: "اثر فرهنگی، داستان، هویت، مهاجرت و برداشت شخصی از متن یا هنر را تحلیل کنید.",
    resourceFocus: "فرهنگ، ادبیات، هویت و مهاجرت",
    skills: [
      { slug: "b2-interpret-a-literary-excerpt", title: "بخشی از متن ادبی را تفسیر کن", description: "فضا، شخصیت، پیام و برداشت خودت از یک متن کوتاه را بیان کن.", focus: "تفسیر ادبی" },
      { slug: "b2-discuss-cultural-identity", title: "هویت فرهنگی را بحث کن", description: "تجربه، زبان، تعلق و تغییر هویت را با مثال توضیح بده.", focus: "هویت فرهنگی" },
      { slug: "b2-describe-artistic-impressions", title: "برداشت هنری را توصیف کن", description: "اثر هنری، احساس، جزئیات و نظر شخصی را منظم بیان کن.", focus: "برداشت هنری" },
      { slug: "b2-present-a-book-or-film", title: "کتاب یا فیلمی را معرفی کن", description: "موضوع، ساختار، شخصیت‌ها و توصیه خودت را در ارائه کوتاه بیاور.", focus: "معرفی اثر" }
    ]
  },
  {
    slug: "b2-economy-money-and-consumer-rights",
    title: "اقتصاد، پول و حقوق مصرف‌کننده",
    summary: "بودجه، قرارداد، خرید، شکایت، خدمات مالی و تصمیم‌های اقتصادی را دقیق‌تر تمرین کنید.",
    resourceFocus: "اقتصاد، قرارداد، مصرف‌کننده و خدمات مالی",
    skills: [
      { slug: "b2-discuss-personal-budgeting", title: "بودجه شخصی را بحث کن", description: "درآمد، هزینه، اولویت و برنامه مالی را واقع‌بینانه توضیح بده.", focus: "بودجه شخصی" },
      { slug: "b2-understand-contract-conditions", title: "شرایط قرارداد را بفهم", description: "مدت، هزینه، حق فسخ و بندهای مهم قرارداد را تشخیص بده.", focus: "شرایط قرارداد" },
      { slug: "b2-make-a-consumer-complaint", title: "شکایت مصرف‌کننده بنویس", description: "مشکل، مدرک، انتظار و مهلت پاسخ را در متن رسمی بیان کن.", focus: "شکایت مصرف‌کننده" },
      { slug: "b2-compare-financial-services", title: "خدمات مالی را مقایسه کن", description: "کارمزد، خطر، فایده و نیاز شخصی را برای انتخاب مالی بسنج.", focus: "خدمات مالی" }
    ]
  },
  {
    slug: "b2-science-technology-and-innovation",
    title: "علم، فناوری و نوآوری",
    summary: "درباره نوآوری، هوش مصنوعی، پژوهش، اخلاق فناوری و تغییرهای آینده استدلال کنید.",
    resourceFocus: "علم، فناوری، نوآوری و اخلاق",
    skills: [
      { slug: "b2-explain-a-technical-process", title: "فرایند فنی را توضیح بده", description: "مراحل، هدف و نتیجه یک فرایند فنی را با ترتیب منطقی بیان کن.", focus: "فرایند فنی" },
      { slug: "b2-discuss-ai-and-society", title: "هوش مصنوعی و جامعه را بحث کن", description: "فرصت، خطر، مسئولیت و مثال روزمره فناوری هوشمند را بررسی کن.", focus: "هوش مصنوعی" },
      { slug: "b2-evaluate-an-innovation", title: "یک نوآوری را ارزیابی کن", description: "فایده، محدودیت، هزینه و اثر اجتماعی یک ایده نو را بسنج.", focus: "نوآوری" },
      { slug: "b2-write-about-digital-ethics", title: "درباره اخلاق دیجیتال بنویس", description: "حریم، عدالت، شفافیت و مسئولیت را در متن استدلالی کوتاه بیاور.", focus: "اخلاق دیجیتال" }
    ]
  },
  {
    slug: "b2-migration-housing-and-bureaucracy",
    title: "مهاجرت، مسکن و اداره‌ها",
    summary: "موقعیت‌های مهاجرت، قرارداد اجاره، نامه اداری، وقت گرفتن و حل مشکل رسمی را تمرین کنید.",
    resourceFocus: "مهاجرت، مسکن، اداره و نامه رسمی",
    skills: [
      { slug: "b2-describe-migration-experiences", title: "تجربه مهاجرت را توصیف کن", description: "دلیل، چالش، سازگاری و احساس شخصی را دقیق و محترمانه بیان کن.", focus: "تجربه مهاجرت" },
      { slug: "b2-understand-rental-ads", title: "آگهی اجاره را بفهم", description: "شرط‌ها، هزینه‌ها، موقعیت و نکته‌های مهم آگهی مسکن را تشخیص بده.", focus: "آگهی اجاره" },
      { slug: "b2-handle-an-office-appointment", title: "وقت اداری را مدیریت کن", description: "درخواست وقت، توضیح مشکل و پرسیدن مدارک لازم را تمرین کن.", focus: "وقت اداری" },
      { slug: "b2-write-an-official-email", title: "ایمیل اداری بنویس", description: "موضوع، شرح مسئله، درخواست و پیوست‌ها را در لحن رسمی مرتب کن.", focus: "ایمیل اداری" }
    ]
  },
  {
    slug: "b2-travel-globalization-and-intercultural-communication",
    title: "سفر، جهانی‌شدن و ارتباط بین‌فرهنگی",
    summary: "سفر پیچیده‌تر، فرهنگ کاری، سوءتفاهم، جهانی‌شدن و ارتباط بین‌فرهنگی را تحلیل کنید.",
    resourceFocus: "سفر، جهانی‌شدن، فرهنگ و ارتباط",
    skills: [
      { slug: "b2-plan-complex-travel", title: "سفر پیچیده را برنامه‌ریزی کن", description: "مسیر، محدودیت، جایگزین و اولویت‌های چند نفر را هماهنگ کن.", focus: "برنامه سفر پیچیده" },
      { slug: "b2-discuss-global-connections", title: "پیوندهای جهانی را بحث کن", description: "زنجیره تولید، ارتباط کشورها و اثر انتخاب‌های جهانی را توضیح بده.", focus: "پیوند جهانی" },
      { slug: "b2-manage-intercultural-misunderstandings", title: "سوءتفاهم بین‌فرهنگی را مدیریت کن", description: "برداشت متفاوت، توضیح محترمانه و راه‌حل ارتباطی بساز.", focus: "سوءتفاهم بین‌فرهنگی" },
      { slug: "b2-present-cultural-comparisons", title: "مقایسه فرهنگی ارائه بده", description: "شباهت، تفاوت، مثال و احتیاط در تعمیم را در ارائه کوتاه رعایت کن.", focus: "مقایسه فرهنگی" }
    ]
  },
  {
    slug: "b2-exam-strategies-argumentation-and-final-review",
    title: "راهبرد آزمون، استدلال و مرور نهایی",
    summary: "خلاصه‌نویسی، استدلال شفاهی و نوشتاری، مدیریت زمان و مرور تجمعی B2 را کامل کنید.",
    resourceFocus: "آزمون، استدلال، خلاصه و مرور نهایی",
    skills: [
      { slug: "b2-summarize-complex-texts", title: "متن پیچیده را خلاصه کن", description: "ایده اصلی، جزئیات ضروری و حذف اطلاعات فرعی را تمرین کن.", focus: "خلاصه متن" },
      { slug: "b2-structure-written-arguments", title: "استدلال نوشتاری را ساختار بده", description: "مقدمه، دلیل، مثال، ضدنظر و نتیجه را منسجم بنویس.", focus: "استدلال نوشتاری" },
      { slug: "b2-manage-speaking-exam-tasks", title: "وظیفه گفتاری آزمون را مدیریت کن", description: "زمان، ساختار پاسخ، تعامل و جمع‌بندی در گفتار آزمونی را تمرین کن.", focus: "گفتار آزمونی" },
      { slug: "b2-review-recurring-grammar-patterns", title: "الگوهای گرامری پرتکرار را مرور کن", description: "ساختارهای وابسته، مجهول، Konjunktiv و Nominalisierung را در کاربرد مرور کن.", focus: "مرور گرامر" }
    ]
  }
];

const b2UnitLanguage = [
  {
    word: "die Berufserfahrung",
    meaning: "تجربه شغلی",
    phrase: "Je mehr Berufserfahrung ich sammle, desto klarer werden meine Ziele.",
    phraseMeaning: "هرچه تجربه شغلی بیشتری جمع کنم، هدف‌هایم روشن‌تر می‌شوند",
    blankSentence: "Je mehr Berufserfahrung ich sammle, ___ klarer werden meine Ziele.",
    blankAnswer: "desto",
    orderedWords: ["Je", "mehr", "Berufserfahrung", "ich", "sammle", "desto", "klarer", "werden", "meine", "Ziele"],
    grammarPoint: "ساختار je ... desto برای بیان رابطه دو تغییر در استدلال B2 کاربرد دارد.",
    miniAnswer: "گوینده رابطه بین تجربه شغلی و هدف‌های روشن‌تر را توضیح می‌دهد."
  },
  {
    word: "die Glaubwuerdigkeit",
    meaning: "اعتبار / قابل اعتماد بودن",
    phrase: "Bevor ich einen Artikel teile, pruefe ich seine Glaubwuerdigkeit.",
    phraseMeaning: "قبل از اینکه مقاله‌ای را به اشتراک بگذارم، اعتبارش را بررسی می‌کنم",
    blankSentence: "Bevor ich einen Artikel teile, ___ ich seine Glaubwuerdigkeit.",
    blankAnswer: "pruefe",
    orderedWords: ["Bevor", "ich", "einen", "Artikel", "teile", "pruefe", "ich", "seine", "Glaubwuerdigkeit"],
    grammarPoint: "در جمله فرعی با bevor فعل صرف‌شده در پایان بخش فرعی می‌آید.",
    miniAnswer: "متن درباره ارزیابی منبع پیش از انتشار آن است."
  },
  {
    word: "die Beteiligung",
    meaning: "مشارکت",
    phrase: "Anstatt nur zu kritisieren, beteiligen sich viele Menschen an lokalen Projekten.",
    phraseMeaning: "به جای فقط انتقاد کردن، افراد زیادی در پروژه‌های محلی مشارکت می‌کنند",
    blankSentence: "Anstatt nur zu kritisieren, ___ sich viele Menschen an lokalen Projekten.",
    blankAnswer: "beteiligen",
    orderedWords: ["Anstatt", "nur", "zu", "kritisieren", "beteiligen", "sich", "viele", "Menschen"],
    grammarPoint: "Anstatt ... zu + Infinitiv برای بیان جایگزین یک رفتار به کار می‌رود.",
    miniAnswer: "تمرکز جمله روی مشارکت فعال به جای انتقاد صرف است."
  },
  {
    word: "die Nachhaltigkeit",
    meaning: "پایداری",
    phrase: "Indem wir weniger verschwenden, handeln wir nachhaltiger.",
    phraseMeaning: "با کمتر هدر دادن، پایدارتر عمل می‌کنیم",
    blankSentence: "___ wir weniger verschwenden, handeln wir nachhaltiger.",
    blankAnswer: "Indem",
    orderedWords: ["Indem", "wir", "weniger", "verschwenden", "handeln", "wir", "nachhaltiger"],
    grammarPoint: "Indem روش یا وسیله رسیدن به نتیجه را معرفی می‌کند.",
    miniAnswer: "جمله راه رسیدن به رفتار پایدارتر را نشان می‌دهد."
  },
  {
    word: "die Belastung",
    meaning: "فشار / بار روانی یا جسمی",
    phrase: "Wer dauerhaft unter Belastung steht, sollte rechtzeitig Unterstuetzung suchen.",
    phraseMeaning: "کسی که دائماً تحت فشار است، باید به‌موقع دنبال حمایت باشد",
    blankSentence: "Wer dauerhaft unter Belastung steht, ___ rechtzeitig Unterstuetzung suchen.",
    blankAnswer: "sollte",
    orderedWords: ["Wer", "dauerhaft", "unter", "Belastung", "steht", "sollte", "Unterstuetzung", "suchen"],
    grammarPoint: "جمله با wer می‌تواند نقش فاعل جمله اصلی را داشته باشد.",
    miniAnswer: "متن درباره فشار طولانی و نیاز به حمایت به‌موقع است."
  },
  {
    word: "die Erkenntnis",
    meaning: "یافته / بینش",
    phrase: "Die Studie zeigt, dass regelmaessige Wiederholung langfristig wirksam ist.",
    phraseMeaning: "پژوهش نشان می‌دهد که مرور منظم در بلندمدت موثر است",
    blankSentence: "Die Studie zeigt, ___ regelmaessige Wiederholung langfristig wirksam ist.",
    blankAnswer: "dass",
    orderedWords: ["Die", "Studie", "zeigt", "dass", "regelmaessige", "Wiederholung", "wirksam", "ist"],
    grammarPoint: "در گزارش یافته‌ها، dass جمله وابسته محتوای نتیجه را معرفی می‌کند.",
    miniAnswer: "متن یک یافته درباره اثر مرور منظم گزارش می‌کند."
  },
  {
    word: "die Zugehoerigkeit",
    meaning: "تعلق",
    phrase: "Obwohl ich zwischen zwei Kulturen lebe, empfinde ich Zugehoerigkeit.",
    phraseMeaning: "با اینکه بین دو فرهنگ زندگی می‌کنم، احساس تعلق دارم",
    blankSentence: "___ ich zwischen zwei Kulturen lebe, empfinde ich Zugehoerigkeit.",
    blankAnswer: "Obwohl",
    orderedWords: ["Obwohl", "ich", "zwischen", "zwei", "Kulturen", "lebe", "empfinde", "ich", "Zugehoerigkeit"],
    grammarPoint: "Obwohl تضاد بین انتظار و واقعیت را در جمله وابسته نشان می‌دهد.",
    miniAnswer: "گوینده با وجود زندگی بین دو فرهنگ احساس تعلق دارد."
  },
  {
    word: "die Vertragsbedingung",
    meaning: "شرط قرارداد",
    phrase: "Falls die Vertragsbedingungen unklar sind, frage ich schriftlich nach.",
    phraseMeaning: "اگر شرایط قرارداد نامشخص باشد، کتبی سوال می‌کنم",
    blankSentence: "Falls die Vertragsbedingungen unklar sind, ___ ich schriftlich nach.",
    blankAnswer: "frage",
    orderedWords: ["Falls", "die", "Vertragsbedingungen", "unklar", "sind", "frage", "ich", "schriftlich", "nach"],
    grammarPoint: "Falls شرط احتمالی را معرفی می‌کند و فعل بخش فرعی در پایان می‌آید.",
    miniAnswer: "گوینده در برابر ابهام قرارداد پیگیری کتبی انجام می‌دهد."
  },
  {
    word: "die Innovation",
    meaning: "نوآوری",
    phrase: "Die Innovation wird nur akzeptiert, wenn sie transparent erklaert wird.",
    phraseMeaning: "نوآوری فقط وقتی پذیرفته می‌شود که شفاف توضیح داده شود",
    blankSentence: "Die Innovation wird nur akzeptiert, wenn sie transparent ___ wird.",
    blankAnswer: "erklaert",
    orderedWords: ["Die", "Innovation", "wird", "akzeptiert", "wenn", "sie", "transparent", "erklaert", "wird"],
    grammarPoint: "Passiv با wird + Partizip II برای تمرکز روی عمل یا نتیجه استفاده می‌شود.",
    miniAnswer: "پذیرش نوآوری به توضیح شفاف آن وابسته است."
  },
  {
    word: "die Aufenthaltsgenehmigung",
    meaning: "مجوز اقامت",
    phrase: "Sobald die Unterlagen vollstaendig sind, beantrage ich die Aufenthaltsgenehmigung.",
    phraseMeaning: "به محض کامل شدن مدارک، مجوز اقامت را درخواست می‌دهم",
    blankSentence: "Sobald die Unterlagen vollstaendig sind, ___ ich die Aufenthaltsgenehmigung.",
    blankAnswer: "beantrage",
    orderedWords: ["Sobald", "die", "Unterlagen", "vollstaendig", "sind", "beantrage", "ich", "die", "Aufenthaltsgenehmigung"],
    grammarPoint: "Sobald زمان شروع عمل اصلی پس از کامل شدن شرط زمانی را نشان می‌دهد.",
    miniAnswer: "اقدام اداری پس از کامل شدن مدارک انجام می‌شود."
  },
  {
    word: "die interkulturelle Kommunikation",
    meaning: "ارتباط بین‌فرهنگی",
    phrase: "Missverstaendnisse lassen sich vermeiden, indem man Erwartungen offen anspricht.",
    phraseMeaning: "سوءتفاهم‌ها را می‌توان با بیان روشن انتظارها کاهش داد",
    blankSentence: "Missverstaendnisse lassen sich vermeiden, ___ man Erwartungen offen anspricht.",
    blankAnswer: "indem",
    orderedWords: ["Missverstaendnisse", "lassen", "sich", "vermeiden", "indem", "man", "Erwartungen", "offen", "anspricht"],
    grammarPoint: "Sich lassen + Infinitiv راهی برای بیان امکان انجام کاری است.",
    miniAnswer: "بیان روشن انتظارها به کاهش سوءتفاهم کمک می‌کند."
  },
  {
    word: "die Schlussfolgerung",
    meaning: "نتیجه‌گیری",
    phrase: "Nachdem ich beide Positionen verglichen habe, formuliere ich eine Schlussfolgerung.",
    phraseMeaning: "بعد از مقایسه هر دو موضع، یک نتیجه‌گیری بیان می‌کنم",
    blankSentence: "Nachdem ich beide Positionen verglichen habe, ___ ich eine Schlussfolgerung.",
    blankAnswer: "formuliere",
    orderedWords: ["Nachdem", "ich", "beide", "Positionen", "verglichen", "habe", "formuliere", "ich", "eine", "Schlussfolgerung"],
    grammarPoint: "Nachdem ترتیب زمانی دو مرحله در استدلال یا خلاصه‌نویسی را نشان می‌دهد.",
    miniAnswer: "نتیجه‌گیری پس از مقایسه دو موضع نوشته می‌شود."
  }
] satisfies Array<Pick<SkillSpec, "word" | "meaning" | "phrase" | "phraseMeaning" | "blankSentence" | "blankAnswer" | "orderedWords" | "grammarPoint" | "miniAnswer">>;

function makeB2SkillSpec(
  unit: Omit<UnitSpec, "skills">,
  skill: Pick<SkillSpec, "slug" | "title" | "description" | "focus">,
  unitIndex: number
): SkillSpec {
  const language = b2UnitLanguage[unitIndex];

  return {
    ...skill,
    ...language,
    blankChoices: [language.blankAnswer, "weil", "obwohl"],
    situation: `در موضوع ${unit.resourceFocus} باید درباره «${skill.focus}» با دقت، دلیل و ساختار B2 صحبت کنید.`,
    miniText: `Sara bereitet eine B2-Aufgabe zu ${skill.focus} vor. ${language.phrase} Danach sammelt sie Argumente und Beispiele.`,
    miniAnswer: `${language.miniAnswer} این تمرین به «${skill.focus}» مربوط است.`
  };
}

function buildB2UnitSpecs(): UnitSpec[] {
  return b2UnitScaffolds.map((unit, unitIndex) => ({
    slug: unit.slug,
    title: unit.title,
    summary: unit.summary,
    resourceFocus: unit.resourceFocus,
    skills: unit.skills.map((skill) =>
      makeB2SkillSpec(unit, skill, unitIndex)
    )
  }));
}

function buildB2Units(): SampleUnit[] {
  const units = buildB2UnitSpecs().map((unit) => {
    const skills = unit.skills.map((skill) =>
      makeSkill(skill, "PUBLISHED", makeA2SkillQuestions)
    );

    return {
      slug: unit.slug,
      title: unit.title,
      summary: unit.summary,
      skills: [...skills, makeA2Checkpoint(unit, skills, "PUBLISHED", "B2")]
    };
  });

  units[units.length - 1].skills.push(makeFinalTestForLevel("B2", units));

  return units;
}

export const devLearnerProfile = {
  id: "dev-learner",
  displayName: "Dev Learner",
  sourceLanguage: "Persian",
  targetLanguage: "German",
  interfaceLanguage: "fa",
  currentLevel: "A1",
  dailyGoalMinutes: 10
};

export const sampleCourse: SampleCourse = {
  slug: "persian-to-german",
  title: "آلمانی برای فارسی‌زبان‌ها",
  sourceLanguage: "Persian",
  targetLanguage: "German",
  interfaceLanguage: "fa",
  levels: [
    {
      label: "A1",
      title: "پایه‌های A1",
      units: buildUnits()
    },
    {
      label: "A2",
      title: "گسترش A2",
      units: buildA2Units()
    },
    {
      label: "B1",
      title: "استقلال B1",
      units: buildB1Units()
    },
    {
      label: "B2",
      title: "پیشرفته B2",
      units: buildB2Units()
    }
  ]
};

const b1GuideUnits = [b1UnitOneSpec, ...b1DraftUnits];
const b1AdditionalLearningGuides: SampleResource[] = b1GuideUnits.slice(1).map((unit, index) => ({
  slug: `${unit.slug}-persian-guide`,
  title: `راهنمای B1: ${unit.title}`,
  description: `پشتیبانی فارسی برای ${unit.resourceFocus}.`,
  type: "LEARNING_GUIDE",
  levelLabel: "B1",
  language: "fa/de",
  thumbnailIcon: "route",
  metadata: {
    length: "24 min",
    format: "Persian-first guide",
    focus: `B1 Unit ${index + 2}`
  },
  content:
    `این راهنما واحد ${index + 2} B1 را به موقعیت‌های اصلی «${unit.title}» وصل می‌کند. توضیح‌ها فارسی هستند و نمونه‌های تمرین آلمانی می‌مانند تا زبان‌آموز بتواند ${unit.resourceFocus} را با دقت B1 تمرین کند.`,
  publicationStatus: "PUBLISHED",
  unitSlug: unit.slug,
  skillSlug: unit.skills[0]?.slug
}));
const b2GuideUnits = buildB2UnitSpecs();
const b2LearningGuides: SampleResource[] = b2GuideUnits.map((unit, index) => ({
  slug: `${unit.slug}-persian-guide`,
  title: `راهنمای B2: ${unit.title}`,
  description: `پشتیبانی فارسی برای ${unit.resourceFocus}.`,
  type: "LEARNING_GUIDE",
  levelLabel: "B2",
  language: "fa/de",
  thumbnailIcon: "landmark",
  metadata: {
    length: "28 min",
    format: "Persian-first guide",
    focus: `B2 Unit ${index + 1}`
  },
  content:
    `این راهنما واحد ${index + 1} B2 را به موقعیت‌های اصلی «${unit.title}» وصل می‌کند. توضیح‌ها فارسی هستند و نمونه‌های آلمانی در سطح B2 باقی می‌مانند تا زبان‌آموز بتواند ${unit.resourceFocus} را با استدلال، دقت گرامری و واژگان پیشرفته‌تر تمرین کند.`,
  publicationStatus: "PUBLISHED",
  unitSlug: unit.slug,
  skillSlug: unit.skills[0]?.slug
}));

export const sampleResources: SampleResource[] = [
  {
    slug: "a1-survival-phrasebook",
    title: "دفترچه عبارت‌های ضروری A1",
    description: "عبارت‌های کوتاه برای سلام، معرفی، پرسیدن مسیر و خریدهای ساده.",
    type: "BOOK",
    levelLabel: "A1",
    language: "fa/de",
    thumbnailIcon: "book-open",
    metadata: {
      length: "42 pages",
      format: "PDF guide",
      focus: "Everyday phrases"
    },
    content:
      "این راهنما عبارت‌های آلمانی پرتکرار را با معنی فارسی، موقعیت استفاده، و مثال کوتاه مرتب می‌کند تا زبان‌آموز قبل از ورود به هر مهارت یک مرجع سریع داشته باشد.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-first-contacts",
    skillSlug: "greet-and-say-your-name"
  },
  {
    slug: "pronunciation-starter-a1",
    title: "ویدئوی شروع تلفظ آلمانی",
    description: "تمرین آواهای پایه، سلام‌ها و ریتم جمله‌های کوتاه آلمانی.",
    type: "VIDEO",
    levelLabel: "A1",
    language: "fa/de",
    thumbnailIcon: "video",
    metadata: {
      duration: "18 min",
      format: "Guided video",
      focus: "Pronunciation"
    },
    content:
      "این ویدئو روی صدای ch، h آغازین، تکیه واژه و خواندن جمله‌های کوتاه مثل Ich heiße Sara تمرکز دارد. توضیح‌ها فارسی هستند و نمونه‌ها آلمانی می‌مانند.",
    url: "https://www.dw.com/de/deutsch-lernen/s-2055",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-first-contacts",
    skillSlug: "ask-for-a-name"
  },
  {
    slug: "family-vocabulary-audio",
    title: "درس صوتی واژگان خانواده",
    description: "واژه‌های خانواده با تکرار شنیداری، مکث و مثال‌های ساده.",
    type: "AUDIO_LESSON",
    levelLabel: "A1",
    language: "fa/de",
    thumbnailIcon: "headphones",
    metadata: {
      duration: "12 min",
      format: "Audio drill",
      focus: "Family vocabulary"
    },
    content:
      "این درس صوتی برای مرور der Bruder، die Schwester، meine Familie و جمله‌های معرفی خانواده طراحی شده است. زبان‌آموز بعد از شنیدن هر جمله یک بار آن را تکرار می‌کند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-people-and-family",
    skillSlug: "introduce-family"
  },
  {
    slug: "verb-position-mini-grammar",
    title: "گرامر کوتاه: جایگاه فعل در جمله A1",
    description: "توضیح فارسی درباره جایگاه دوم فعل در جمله‌های خبری و پرسشی ساده.",
    type: "GRAMMAR_RESOURCE",
    levelLabel: "A1",
    language: "fa/de",
    thumbnailIcon: "notebook-tabs",
    metadata: {
      length: "8 min read",
      format: "Grammar note",
      focus: "Verb position"
    },
    content:
      "در آلمانی فعل صرف‌شده در جمله خبری معمولا جایگاه دوم را می‌گیرد: Heute lerne ich Deutsch. در پرسش بله/خیر، فعل اول می‌آید: Hast du Zeit?",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-free-time",
    skillSlug: "make-plans"
  },
  {
    slug: "simple-cafe-menu-reading",
    title: "خواندن ساده: منوی کافه",
    description: "یک متن کوتاه A1 برای غذا، نوشیدنی، قیمت و سفارش مودبانه.",
    type: "READING_MATERIAL",
    levelLabel: "A1",
    language: "de/fa",
    thumbnailIcon: "file-text",
    metadata: {
      length: "650 words",
      format: "Graded reading",
      focus: "Food and prices"
    },
    content:
      "متن آلمانی کوتاه درباره سفارش در کافه است و بعد از هر بخش، واژه‌های کلیدی و سؤال‌های فهم مطلب فارسی می‌آید. هدف، خواندن بدون ترجمه خط‌به‌خط است.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-food-and-drink",
    skillSlug: "shop-for-food"
  },
  {
    slug: "goethe-a1-exam-overview",
    title: "راهنمای بیرونی آزمون Goethe A1",
    description: "لینک مرجع برای آشنایی با ساختار کلی آزمون و انتظارات سطح A1.",
    type: "EXTERNAL_LINK",
    levelLabel: "A1",
    language: "de/en",
    thumbnailIcon: "external-link",
    metadata: {
      provider: "Goethe-Institut",
      format: "External reference",
      focus: "Exam orientation"
    },
    content:
      "این لینک فقط برای آشنایی با قالب عمومی آزمون و سطح انتظار استفاده می‌شود. محتوای تمرین Nyra مستقل و فارسی‌محور باقی می‌ماند.",
    url: "https://www.goethe.de/en/spr/kup/prf/prf/sd1.html",
    publicationStatus: "PUBLISHED"
  },
  {
    slug: "a1-weekly-study-plan",
    title: "راهنمای برنامه هفتگی A1",
    description: "یک برنامه سبک برای ترکیب مهارت‌ها، فلش‌کارت، خواندن و مرور.",
    type: "LEARNING_GUIDE",
    levelLabel: "A1",
    language: "fa",
    thumbnailIcon: "route",
    metadata: {
      length: "1 week",
      format: "Study plan",
      focus: "Learning routine"
    },
    content:
      "هر روز یک مهارت کوتاه، ده دقیقه فلش‌کارت، و یک مرور شنیداری یا خواندنی انجام بده. اگر آزمونک واحد کمتر از حد قبولی شد، مسیر قفل نمی‌شود اما همان واحد را برای مرور علامت بزن.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-my-life",
    skillSlug: "describe-a-daily-routine"
  },
  {
    slug: "city-directions-map-practice",
    title: "تمرین مسیرها با نقشه ساده شهر",
    description: "واژگان Bahnhof، links، rechts و پرسیدن آدرس در یک سناریوی خواندنی.",
    type: "READING_MATERIAL",
    levelLabel: "A1",
    language: "de/fa",
    thumbnailIcon: "map",
    metadata: {
      length: "15 min",
      format: "Scenario practice",
      focus: "Directions"
    },
    content:
      "زبان‌آموز یک نقشه ساده را می‌بیند، چند جمله آلمانی درباره مسیر می‌خواند و با پشتیبانی فارسی تشخیص می‌دهد کدام مسیر درست است.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a1-getting-around",
    skillSlug: "ask-for-directions"
  },
  {
    slug: "a2-global-life-persian-guide",
    title: "راهنمای A2: آلمانی در زندگی جهانی",
    description: "پشتیبانی فارسی برای ارتباط دوباره، داتیو، Perfekt، seit و دلیل آوردن با weil.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "globe-2",
    metadata: {
      length: "18 min",
      format: "Persian-first guide",
      focus: "A2 Unit 1"
    },
    content:
      "این راهنما چهار موقعیت اصلی واحد اول A2 را به هم وصل می‌کند: دیدن دوباره افراد، حرف زدن درباره زندگی در کشور دیگر، تعریف تجربه‌های اخیر با Perfekt، و توضیح دلیل یادگیری آلمانی با weil. توضیح‌ها فارسی هستند و نمونه‌های تمرین آلمانی می‌مانند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-german-in-global-life",
    skillSlug: "a2-reconnect-and-ask-how-someone-is"
  },
  {
    slug: "a2-appearance-recommendations-persian-guide",
    title: "راهنمای A2: ظاهر، لباس و پیشنهاد دادن",
    description: "پشتیبانی فارسی برای توصیف لباس، خرید، آکوزاتیو و پیشنهاد دادن با داتیو.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "shirt",
    metadata: {
      length: "20 min",
      format: "Persian-first guide",
      focus: "A2 Unit 2"
    },
    content:
      "این راهنما نشان می‌دهد چطور درباره ظاهر و لباس دقیق‌تر حرف بزنید، در خرید لباس سایز و نظر خود را بیان کنید، و با جمله‌هایی مثل Ich empfehle dir... پیشنهاد مودبانه بدهید. توضیح‌ها فارسی هستند و مثال‌های اصلی آلمانی می‌مانند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-appearance-and-recommendations",
    skillSlug: "a2-describe-clothes-and-style"
  },
  {
    slug: "a2-family-relationships-persian-guide",
    title: "راهنمای A2: خانواده، رابطه‌ها و دوستان",
    description: "پشتیبانی فارسی برای نسبت‌های خانوادگی، seit، داتیو با vertrauen و خبر گرفتن.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "users-round",
    metadata: {
      length: "20 min",
      format: "Persian-first guide",
      focus: "A2 Unit 3"
    },
    content:
      "این راهنما واژه‌های رابطه‌های خانوادگی و دوستی را با موقعیت‌های واقعی ترکیب می‌کند: توصیف خویشاوندان، حرف زدن درباره زوج‌ها، توضیح اعتماد در دوستی، و درخواست خبر دادن. تمرکز گرامری روی seit، داتیو و درخواست دوستانه است.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-family-relationships-and-friends",
    skillSlug: "a2-describe-family-relationships"
  },
  {
    slug: "a2-housing-email-persian-guide",
    title: "راهنمای A2: خانه، اقامت و ایمیل",
    description: "پشتیبانی فارسی برای هماهنگی اقامت، ایمیل رسمی، وسایل خانه و درخواست‌های خانگی.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "home",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 4"
    },
    content:
      "این راهنما زبان لازم برای اقامت کوتاه و خانه را جمع می‌کند: پرسیدن درباره خانه، نوشتن ایمیل کوتاه و مودبانه، گفتن جای وسایل آشپزخانه، و درخواست جابه‌جایی اشیا. مثال‌ها آلمانی هستند و نکته‌های کاربردی به فارسی توضیح داده می‌شوند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-housing-stays-and-email",
    skillSlug: "a2-arrange-a-home-stay"
  },
  {
    slug: "a2-food-parties-persian-guide",
    title: "راهنمای A2: غذا، مهمانی و رستوران",
    description: "پشتیبانی فارسی برای خرید، بسته‌بندی، آماده کردن مهمانی، سفارش مودبانه و توصیف تجربه غذا.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "utensils",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 5"
    },
    content:
      "این راهنما زبان واحد پنجم A2 را در چهار موقعیت واقعی جمع می‌کند: انتخاب بسته‌بندی بهتر در خرید، آماده کردن جشن تولد، درخواست مودبانه در رستوران، و گفتن تجربه یک غذا. نکته‌های گرامری مثل lieber، فعل‌های جداشدنی و haetten gern به فارسی توضیح داده می‌شوند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-food-parties-and-restaurants",
    skillSlug: "a2-discuss-shopping-and-packaging"
  },
  {
    slug: "a2-urban-culture-persian-guide",
    title: "راهنمای A2: فرهنگ شهری و رویدادها",
    description: "پشتیبانی فارسی برای هنر شهری، سفر کوله‌گردی، زمان رویدادها و معرفی اجرای کوتاه.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "palette",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 6"
    },
    content:
      "این راهنما کمک می‌کند درباره شهر زنده‌تر حرف بزنید: Streetart را توصیف کنید، سفر سبک با Rucksack را توضیح دهید، زمان یک Open-Air-Kino را بفهمید و یک Poetry Slam را معرفی کنید. تمرکز روی داتیو با mit، زمان با um و فعل جداشدنی vorlesen است.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-urban-culture-and-events",
    skillSlug: "a2-talk-about-street-art"
  },
  {
    slug: "a2-school-work-persian-guide",
    title: "راهنمای A2: مدرسه، کار و شغل رویایی",
    description: "پشتیبانی فارسی برای برنامه آینده، آموزش حرفه‌ای، مقایسه شغل‌ها و توضیح شغل رویایی.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "graduation-cap",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 7"
    },
    content:
      "این راهنما مسیر مدرسه و کار را به زبان A2 تبدیل می‌کند: گفتن یک برنامه روشن، توضیح Ausbildung، مقایسه Arbeitszeit با als، و توصیف Traumjob. توضیح‌ها فارسی هستند و جمله‌های نمونه برای تمرین گفتاری و نوشتاری آلمانی باقی می‌مانند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-school-work-and-dream-jobs",
    skillSlug: "a2-describe-a-plan"
  },
  {
    slug: "a2-health-happiness-persian-guide",
    title: "راهنمای A2: سلامت، خوشبختی و رضایت",
    description: "پشتیبانی فارسی برای توضیح علائم، رضایت از زندگی روزمره، معنی خوشبختی و توصیه سلامتی.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "heart-pulse",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 8"
    },
    content:
      "این راهنما زبان سلامت و رضایت را تمرین می‌کند: گفتن Schmerzen به پزشک، استفاده از zufrieden mit همراه داتیو، توضیح معنی Glueck برای یک شخص، و توصیه دادن با solltest + مصدر. پشتیبانی فارسی کمک می‌کند تفاوت معنی‌ها و ساختارها روشن بماند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-health-happiness-and-satisfaction",
    skillSlug: "a2-explain-symptoms-to-a-doctor"
  },
  {
    slug: "a2-media-apps-persian-guide",
    title: "راهنمای A2: رسانه، اپلیکیشن و وقت آزاد",
    description: "پشتیبانی فارسی برای برنامه تلویزیونی، اپلیکیشن‌ها، روز مورد علاقه و برنامه‌ریزی وقت آزاد.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "smartphone",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 9"
    },
    content:
      "این راهنما کمک می‌کند درباره رسانه و وقت آزاد طبیعی‌تر حرف بزنید: معرفی Sendung، توضیح فایده یک App، دلیل آوردن با weil برای Lieblingstag، و برنامه‌ریزی آخر هفته با ins Kino. نکته‌ها فارسی هستند و جمله‌های نمونه آلمانی می‌مانند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-media-apps-and-free-time",
    skillSlug: "a2-discuss-tv-programs"
  },
  {
    slug: "a2-social-gifts-persian-guide",
    title: "راهنمای A2: رفتار اجتماعی، تعریف و هدیه",
    description: "پشتیبانی فارسی برای درخواست مودبانه، پاسخ به تعریف، آشنایی و انتخاب هدیه.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "gift",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 10"
    },
    content:
      "این راهنما زبان رفتار اجتماعی را تمرین می‌کند: Koennten Sie برای درخواست مودبانه، تشکر از Kompliment، گفتن ویژگی‌های فرد مناسب برای آشنایی، و توضیح هدیه با schenken + داتیو. پشتیبانی فارسی کمک می‌کند لحن و نقش‌های گرامری روشن بماند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-social-behavior-compliments-and-gifts",
    skillSlug: "a2-sound-friendly-and-polite"
  },
  {
    slug: "a2-money-banking-persian-guide",
    title: "راهنمای A2: پول، بانک و پیام‌ها",
    description: "پشتیبانی فارسی برای پس‌انداز، حساب بانکی، هزینه مشترک و پیام پرداخت.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "landmark",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 11"
    },
    content:
      "این راهنما موقعیت‌های مالی روزمره را به زبان A2 تبدیل می‌کند: sparen fuer eine Reise، Konto eroeffnen، teilen durch برای هزینه مشترک، و نوشتن پیام روشن درباره Ueberweisung. توضیح‌های فارسی روی آکوزاتیو با fuer و داتیو با dir تمرکز دارند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-money-banking-and-messages",
    skillSlug: "a2-talk-about-money-values"
  },
  {
    slug: "a2-travel-directions-persian-guide",
    title: "راهنمای A2: سفر، مسیر و تجربه‌های تعطیلات",
    description: "پشتیبانی فارسی برای برنامه سفر کوتاه، پرسیدن مسیر هتل، پیدا کردن همسفر و توصیف عکس سفر.",
    type: "LEARNING_GUIDE",
    levelLabel: "A2",
    language: "fa/de",
    thumbnailIcon: "map",
    metadata: {
      length: "22 min",
      format: "Persian-first guide",
      focus: "A2 Unit 12"
    },
    content:
      "این راهنما پایان مسیر A2 را با سفر جمع‌بندی می‌کند: برنامه‌ریزی Ausflug با am Sonntag، پرسیدن Wegbeschreibung، نوشتن درباره Reisepartner، و توصیف Urlaubsfoto با Auf dem Foto sieht man.... توضیح‌ها فارسی هستند و مثال‌ها برای گفتار و نوشتار آلمانی آماده‌اند.",
    publicationStatus: "PUBLISHED",
    unitSlug: "a2-travel-directions-and-holiday-experiences",
    skillSlug: "a2-plan-a-short-trip"
  },
  {
    slug: "b1-travel-plans-persian-guide",
    title: "راهنمای B1: برنامه سفر و داستان تعطیلات",
    description: "پشتیبانی فارسی برای برنامه‌ریزی سفر، ترجیح‌ها، zu + مصدر، weil/da، obwohl و فهم اطلاعیه‌های سفر.",
    type: "LEARNING_GUIDE",
    levelLabel: "B1",
    language: "fa/de",
    thumbnailIcon: "plane",
    metadata: {
      length: "24 min",
      format: "Persian-first guide",
      focus: "B1 Unit 1"
    },
    content:
      "این راهنما واحد اول B1 را به چهار موقعیت سفر وصل می‌کند: گفتن Vorliebe و دلیل انتخاب مقصد، مقایسه Reiseangebot، تعریف Urlaubsgeschichte با گذشته و obwohl، و فهم Durchsage در ایستگاه یا فرودگاه. توضیح‌ها فارسی هستند و مثال‌های اصلی آلمانی می‌مانند تا زبان‌آموز از A2 به تولید دقیق‌تر B1 برسد.",
    publicationStatus: "PUBLISHED",
    unitSlug: "b1-travel-plans-and-holiday-stories",
    skillSlug: "b1-plan-a-trip-and-explain-preferences"
  },
  ...b1AdditionalLearningGuides,
  ...b2LearningGuides
];

export function getPublishedSkills() {
  return sampleCourse.levels.flatMap((level) =>
    level.units.flatMap((unit) =>
      unit.skills
        .filter((skill) => skill.publicationStatus === "PUBLISHED")
        .map((skill) => ({
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

export function getLevelContentSummary(levelLabel = "A1") {
  const units = sampleCourse.levels.find((level) => level.label === levelLabel)?.units ?? [];
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

export function getA1ContentSummary() {
  return getLevelContentSummary("A1");
}
