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
  },
  {
    slug: "a2-unit-5-core-vocabulary",
    title: "واژگان اصلی A2 واحد 5",
    description: "فلش‌کارت‌های واحد پنجم A2 برای غذا، مهمانی، خرید و رستوران.",
    category: "Unit 5",
    unitSlug: "a2-food-parties-and-restaurants",
    cards: [
      ["die Plastiktuete", "کیسه پلاستیکی", "Ich nehme keine Plastiktuete.", "من کیسه پلاستیکی برنمی‌دارم.", "MEDIUM"],
      ["die Stofftasche", "کیسه پارچه‌ای", "Ich nehme lieber eine Stofftasche.", "ترجیح می‌دهم یک کیسه پارچه‌ای بردارم.", "MEDIUM"],
      ["lieber", "ترجیحاً / بیشتر دوست دارم", "Ich trinke lieber Wasser.", "ترجیح می‌دهم آب بنوشم.", "EASY"],
      ["die Verpackung", "بسته‌بندی", "Die Verpackung ist aus Papier.", "بسته‌بندی از کاغذ است.", "MEDIUM"],
      ["einkaufen", "خرید کردن", "Wir kaufen heute Obst ein.", "امروز میوه می‌خریم.", "MEDIUM"],
      ["der Kindergeburtstag", "جشن تولد کودک", "Wir bereiten den Kindergeburtstag vor.", "ما جشن تولد کودک را آماده می‌کنیم.", "HARD"],
      ["vorbereiten", "آماده کردن", "Die Eltern bereiten Kuchen vor.", "والدین کیک آماده می‌کنند.", "HARD"],
      ["der Kuchen", "کیک", "Der Kuchen ist sehr lecker.", "کیک خیلی خوشمزه است.", "EASY"],
      ["die Spiele", "بازی‌ها", "Wir planen Spiele fuer die Kinder.", "ما برای کودکان بازی برنامه‌ریزی می‌کنیم.", "EASY"],
      ["die Einladung", "دعوت‌نامه", "Die Einladung kommt per Nachricht.", "دعوت‌نامه با پیام می‌آید.", "MEDIUM"],
      ["die Speisekarte", "منوی غذا", "Koennen wir bitte die Speisekarte haben?", "می‌توانیم لطفاً منو را داشته باشیم؟", "MEDIUM"],
      ["bestellen", "سفارش دادن", "Ich bestelle eine Suppe.", "یک سوپ سفارش می‌دهم.", "EASY"],
      ["haetten gern", "مایلیم / می‌خواستیم", "Wir haetten gern die Speisekarte.", "ما منو را می‌خواستیم.", "HARD"],
      ["die Suppe", "سوپ", "Die Suppe ist warm.", "سوپ گرم است.", "EASY"],
      ["die Spezialitaet", "غذای ویژه", "Die Spezialitaet des Hauses ist lecker.", "غذای ویژه رستوران خوشمزه است.", "HARD"],
      ["das Haus", "خانه / رستوران در عبارت خاص", "Die Spezialitaet des Hauses war teuer.", "غذای ویژه رستوران گران بود.", "MEDIUM"],
      ["lecker", "خوشمزه", "Das Essen ist lecker.", "غذا خوشمزه است.", "EASY"],
      ["teuer", "گران", "Das Restaurant ist teuer.", "رستوران گران است.", "EASY"],
      ["billig", "ارزان", "Das Mittagessen ist billig.", "ناهار ارزان است.", "EASY"],
      ["der Kellner", "پیشخدمت مرد", "Der Kellner bringt die Rechnung.", "پیشخدمت صورت‌حساب را می‌آورد.", "MEDIUM"],
      ["die Rechnung", "صورت‌حساب", "Die Rechnung bitte.", "صورت‌حساب لطفاً.", "EASY"],
      ["bezahlen", "پرداخت کردن", "Wir bezahlen zusammen.", "ما با هم پرداخت می‌کنیم.", "MEDIUM"],
      ["reservieren", "رزرو کردن", "Ich reserviere einen Tisch.", "یک میز رزرو می‌کنم.", "MEDIUM"],
      ["der Tisch", "میز", "Der Tisch ist frei.", "میز آزاد است.", "EASY"],
      ["satt", "سیر", "Ich bin satt.", "من سیر هستم.", "EASY"]
    ]
  },
  {
    slug: "a2-unit-6-core-vocabulary",
    title: "واژگان اصلی A2 واحد 6",
    description: "فلش‌کارت‌های واحد ششم A2 برای فرهنگ شهری، سفر کوله‌گردی و رویدادها.",
    category: "Unit 6",
    unitSlug: "a2-urban-culture-and-events",
    cards: [
      ["die Streetart", "هنر خیابانی", "Die Streetart macht die Strasse bunter.", "هنر خیابانی خیابان را رنگارنگ‌تر می‌کند.", "HARD"],
      ["die Strasse", "خیابان", "Die Strasse ist bunt.", "خیابان رنگارنگ است.", "EASY"],
      ["bunt", "رنگارنگ", "Das Bild ist sehr bunt.", "تصویر خیلی رنگارنگ است.", "EASY"],
      ["bunter", "رنگارنگ‌تر", "Die Wand ist jetzt bunter.", "دیوار حالا رنگارنگ‌تر است.", "MEDIUM"],
      ["die Wand", "دیوار", "An der Wand ist ein Bild.", "روی دیوار یک تصویر است.", "EASY"],
      ["fotografieren", "عکس گرفتن", "Viele Leute fotografieren das Bild.", "افراد زیادی از تصویر عکس می‌گیرند.", "MEDIUM"],
      ["der Rucksack", "کوله‌پشتی", "Ich reise nur mit einem Rucksack.", "فقط با یک کوله‌پشتی سفر می‌کنم.", "EASY"],
      ["reisen", "سفر کردن", "Wir reisen im Sommer.", "ما تابستان سفر می‌کنیم.", "EASY"],
      ["mitnehmen", "همراه بردن", "Ich nehme wenige Sachen mit.", "وسایل کمی همراه می‌برم.", "HARD"],
      ["wenige", "کم / تعداد کم", "Ich habe nur wenige Sachen.", "من فقط وسایل کمی دارم.", "MEDIUM"],
      ["die Sache", "چیز / وسیله", "Diese Sachen sind wichtig.", "این وسایل مهم هستند.", "EASY"],
      ["das Open-Air-Kino", "سینمای روباز", "Das Open-Air-Kino beginnt um neun Uhr.", "سینمای روباز ساعت نه شروع می‌شود.", "HARD"],
      ["der Park", "پارک", "Das Kino ist im Park.", "سینما در پارک است.", "EASY"],
      ["beginnen", "شروع شدن", "Der Film beginnt um neun Uhr.", "فیلم ساعت نه شروع می‌شود.", "MEDIUM"],
      ["der Film", "فیلم", "Der Film ist spannend.", "فیلم هیجان‌انگیز است.", "EASY"],
      ["die Karte", "بلیت / کارت", "Die Karte kostet acht Euro.", "بلیت هشت یورو قیمت دارد.", "EASY"],
      ["das Publikum", "تماشاگران", "Das Publikum lacht.", "تماشاگران می‌خندند.", "MEDIUM"],
      ["der Poetry Slam", "اجرای شعر", "Beim Poetry Slam lesen Menschen Texte vor.", "در اجرای شعر مردم متن می‌خوانند.", "HARD"],
      ["vorlesen", "بلند خواندن", "Lara liest einen Text vor.", "لارا یک متن را بلند می‌خواند.", "HARD"],
      ["der Text", "متن", "Der Text ist kurz.", "متن کوتاه است.", "EASY"],
      ["lachen", "خندیدن", "Das Publikum lacht.", "تماشاگران می‌خندند.", "EASY"],
      ["das Ereignis", "رویداد", "Das Ereignis ist im Zentrum.", "رویداد در مرکز شهر است.", "MEDIUM"],
      ["die Kultur", "فرهنگ", "Die Kultur in der Stadt ist lebendig.", "فرهنگ در شهر زنده است.", "MEDIUM"],
      ["kostenlos", "رایگان", "Das Konzert ist kostenlos.", "کنسرت رایگان است.", "MEDIUM"],
      ["draussen", "بیرون", "Wir sitzen draussen.", "ما بیرون می‌نشینیم.", "EASY"]
    ]
  },
  {
    slug: "a2-unit-7-core-vocabulary",
    title: "واژگان اصلی A2 واحد 7",
    description: "فلش‌کارت‌های واحد هفتم A2 برای مدرسه، کار، برنامه و شغل رویایی.",
    category: "Unit 7",
    unitSlug: "a2-school-work-and-dream-jobs",
    cards: [
      ["der Plan", "برنامه", "Mein Plan fuer naechstes Jahr ist klar.", "برنامه من برای سال آینده روشن است.", "EASY"],
      ["klar", "روشن / واضح", "Der Plan ist klar.", "برنامه روشن است.", "EASY"],
      ["naechstes Jahr", "سال آینده", "Naechstes Jahr mache ich einen Kurs.", "سال آینده یک دوره می‌گذرانم.", "MEDIUM"],
      ["der Kurs", "دوره / کلاس", "Reza macht zuerst einen Kurs.", "رضا اول یک دوره می‌گذراند.", "EASY"],
      ["zuerst", "اول / نخست", "Zuerst lerne ich Deutsch.", "اول آلمانی یاد می‌گیرم.", "EASY"],
      ["dann", "بعد / سپس", "Dann suche ich Arbeit.", "بعد دنبال کار می‌گردم.", "EASY"],
      ["die Arbeit", "کار", "Ich suche Arbeit.", "دنبال کار می‌گردم.", "EASY"],
      ["die Ausbildung", "آموزش حرفه‌ای", "Ich mache eine Ausbildung im Krankenhaus.", "در بیمارستان آموزش حرفه‌ای می‌گذرانم.", "HARD"],
      ["der Betrieb", "محل کار / شرکت آموزشی", "Sie lernt im Betrieb.", "او در محل کار آموزش می‌بیند.", "MEDIUM"],
      ["das Krankenhaus", "بیمارستان", "Ich arbeite im Krankenhaus.", "من در بیمارستان کار می‌کنم.", "MEDIUM"],
      ["lernen", "یاد گرفتن", "Sie lernt drei Tage pro Woche.", "او سه روز در هفته یاد می‌گیرد.", "EASY"],
      ["pro Woche", "در هفته", "Ich arbeite vier Tage pro Woche.", "چهار روز در هفته کار می‌کنم.", "MEDIUM"],
      ["die Arbeitszeit", "ساعت کاری", "Die Arbeitszeit ist flexibel.", "ساعت کاری انعطاف‌پذیر است.", "MEDIUM"],
      ["flexibel", "انعطاف‌پذیر", "Die Arbeitszeit ist flexibel.", "ساعت کاری انعطاف‌پذیر است.", "MEDIUM"],
      ["flexibler", "انعطاف‌پذیرتر", "Job A ist flexibler als Job B.", "شغل A از شغل B انعطاف‌پذیرتر است.", "HARD"],
      ["vergleichen", "مقایسه کردن", "Wir vergleichen zwei Jobs.", "ما دو شغل را مقایسه می‌کنیم.", "HARD"],
      ["die Aufgabe", "وظیفه", "Meine Aufgabe ist interessant.", "وظیفه من جالب است.", "MEDIUM"],
      ["der Arbeitsplatz", "محل کار", "Der Arbeitsplatz ist ruhig.", "محل کار آرام است.", "MEDIUM"],
      ["der Traumjob", "شغل رویایی", "Mein Traumjob verbindet Sprache und Menschen.", "شغل رویایی من زبان و انسان‌ها را وصل می‌کند.", "HARD"],
      ["verbinden", "وصل کردن / پیوند دادن", "Der Job verbindet Sprache und Menschen.", "شغل زبان و انسان‌ها را پیوند می‌دهد.", "HARD"],
      ["die Sprache", "زبان", "Sprache ist wichtig fuer den Job.", "زبان برای کار مهم است.", "EASY"],
      ["die Lehrerin", "معلم زن", "Sara moechte Lehrerin werden.", "سارا می‌خواهد معلم شود.", "MEDIUM"],
      ["werden", "شدن", "Ich moechte Lehrerin werden.", "می‌خواهم معلم شوم.", "MEDIUM"],
      ["die Faehigkeit", "توانایی", "Welche Faehigkeit brauchst du?", "چه توانایی‌ای نیاز داری؟", "HARD"],
      ["das Ziel", "هدف", "Mein Ziel ist eine gute Arbeit.", "هدف من یک کار خوب است.", "EASY"]
    ]
  },
  {
    slug: "a2-unit-8-core-vocabulary",
    title: "واژگان اصلی A2 واحد 8",
    description: "فلش‌کارت‌های واحد هشتم A2 برای سلامت، خوشبختی، رضایت و توصیه.",
    category: "Unit 8",
    unitSlug: "a2-health-happiness-and-satisfaction",
    cards: [
      ["die Schmerzen", "دردها", "Ich habe seit gestern starke Schmerzen.", "از دیروز درد شدید دارم.", "MEDIUM"],
      ["stark", "شدید / قوی", "Ich habe starke Schmerzen.", "درد شدید دارم.", "EASY"],
      ["seit gestern", "از دیروز", "Seit gestern bin ich muede.", "از دیروز خسته‌ام.", "MEDIUM"],
      ["der Arzt", "پزشک مرد", "Ich gehe heute zum Arzt.", "امروز پیش پزشک می‌روم.", "EASY"],
      ["die Aerztin", "پزشک زن", "Die Aerztin fragt nach den Schmerzen.", "پزشک زن درباره درد می‌پرسد.", "MEDIUM"],
      ["die Praxis", "مطب", "Die Praxis ist im Zentrum.", "مطب در مرکز شهر است.", "MEDIUM"],
      ["das Symptom", "علامت بیماری", "Welche Symptome haben Sie?", "چه علائمی دارید؟", "HARD"],
      ["der Kopf", "سر", "Mein Kopf tut weh.", "سرم درد می‌کند.", "EASY"],
      ["Kopfschmerzen", "سردرد", "Nina hat Kopfschmerzen.", "نینا سردرد دارد.", "MEDIUM"],
      ["sich ausruhen", "استراحت کردن", "Du solltest dich heute ausruhen.", "امروز باید استراحت کنی.", "HARD"],
      ["solltest", "باید / بهتر است", "Du solltest Wasser trinken.", "باید آب بنوشی.", "MEDIUM"],
      ["trinken", "نوشیدن", "Trink bitte genug Wasser.", "لطفاً آب کافی بنوش.", "EASY"],
      ["gesund", "سالم", "Gesundes Essen ist wichtig.", "غذای سالم مهم است.", "EASY"],
      ["zufrieden", "راضی", "Ich bin mit meinem Alltag zufrieden.", "از زندگی روزمره‌ام راضی هستم.", "MEDIUM"],
      ["der Alltag", "زندگی روزمره", "Mein Alltag ist ruhig.", "زندگی روزمره من آرام است.", "MEDIUM"],
      ["deshalb", "بنابراین", "Ich habe Zeit. Deshalb bin ich zufrieden.", "وقت دارم. بنابراین راضی هستم.", "MEDIUM"],
      ["das Glueck", "خوشبختی / خوش‌شانسی", "Glueck bedeutet Zeit mit der Familie.", "خوشبختی یعنی وقت با خانواده.", "MEDIUM"],
      ["bedeuten", "معنی دادن", "Was bedeutet Glueck fuer dich?", "خوشبختی برای تو چه معنی دارد؟", "HARD"],
      ["die Familie", "خانواده", "Zeit mit der Familie ist wichtig.", "وقت با خانواده مهم است.", "EASY"],
      ["das Geld", "پول", "Glueck bedeutet nicht nur Geld.", "خوشبختی فقط پول نیست.", "EASY"],
      ["die Ruhe", "آرامش", "Ruhe hilft mir.", "آرامش به من کمک می‌کند.", "MEDIUM"],
      ["helfen", "کمک کردن", "Schlaf hilft gegen Schmerzen.", "خواب به درد کمک می‌کند.", "MEDIUM"],
      ["der Schlaf", "خواب", "Guter Schlaf ist wichtig.", "خواب خوب مهم است.", "EASY"],
      ["die Empfehlung", "توصیه", "Die Empfehlung der Aerztin ist klar.", "توصیه پزشک زن روشن است.", "HARD"],
      ["besser", "بهتر", "Heute geht es mir besser.", "امروز حالم بهتر است.", "EASY"]
    ]
  },
  {
    slug: "a2-unit-9-core-vocabulary",
    title: "واژگان اصلی A2 واحد 9",
    description: "فلش‌کارت‌های واحد نهم A2 برای رسانه، اپلیکیشن و وقت آزاد.",
    category: "Unit 9",
    unitSlug: "a2-media-apps-and-free-time",
    cards: [
      ["die Sendung", "برنامه تلویزیونی", "Die Sendung laeuft jeden Freitag.", "برنامه هر جمعه پخش می‌شود.", "MEDIUM"],
      ["laufen", "پخش شدن / جریان داشتن", "Die Sendung laeuft um acht Uhr.", "برنامه ساعت هشت پخش می‌شود.", "MEDIUM"],
      ["jeden Freitag", "هر جمعه", "Ich sehe die Sendung jeden Freitag.", "من هر جمعه برنامه را می‌بینم.", "MEDIUM"],
      ["die Reisesendung", "برنامه سفر", "Omid sieht gern eine Reisesendung.", "امید برنامه سفر را دوست دارد.", "HARD"],
      ["ansehen", "تماشا کردن", "Wir sehen den Film am Abend an.", "ما عصر فیلم را تماشا می‌کنیم.", "HARD"],
      ["die App", "اپلیکیشن", "Diese App hilft mir beim Deutschlernen.", "این اپلیکیشن در یادگیری آلمانی کمکم می‌کند.", "EASY"],
      ["die Lernapp", "اپلیکیشن آموزشی", "Mina benutzt eine Lernapp.", "مینا از یک اپلیکیشن آموزشی استفاده می‌کند.", "MEDIUM"],
      ["benutzen", "استفاده کردن", "Ich benutze die App jeden Tag.", "من هر روز از اپ استفاده می‌کنم.", "MEDIUM"],
      ["erinnern", "یادآوری کردن", "Die App erinnert mich an neue Woerter.", "اپ واژه‌های جدید را یادآوری می‌کند.", "HARD"],
      ["beim Deutschlernen", "هنگام یادگیری آلمانی", "Die App hilft beim Deutschlernen.", "اپ در یادگیری آلمانی کمک می‌کند.", "HARD"],
      ["der Lieblingstag", "روز مورد علاقه", "Mein Lieblingstag ist Samstag.", "روز مورد علاقه من شنبه است.", "MEDIUM"],
      ["frei haben", "آزاد بودن / وقت آزاد داشتن", "Ich habe am Samstag frei.", "شنبه آزاد هستم.", "MEDIUM"],
      ["lange schlafen", "تا دیر وقت خوابیدن", "Sara schlaeft am Samstag lange.", "سارا شنبه تا دیر وقت می‌خوابد.", "MEDIUM"],
      ["Freunde treffen", "دوستان را دیدن", "Ich treffe am Abend Freunde.", "عصر دوستانم را می‌بینم.", "MEDIUM"],
      ["weil", "چون", "Ich bleibe zu Hause, weil ich muede bin.", "خانه می‌مانم چون خسته‌ام.", "EASY"],
      ["die Freizeit", "وقت آزاد", "In meiner Freizeit lese ich gern.", "در وقت آزادم دوست دارم بخوانم.", "EASY"],
      ["das Kino", "سینما", "Wir gehen ins Kino.", "ما به سینما می‌رویم.", "EASY"],
      ["ins Kino", "به سینما", "Wollen wir ins Kino gehen?", "می‌خواهیم به سینما برویم؟", "MEDIUM"],
      ["das Wochenende", "آخر هفته", "Am Wochenende habe ich Zeit.", "آخر هفته وقت دارم.", "EASY"],
      ["planen", "برنامه‌ریزی کردن", "Wir planen unsere Freizeit.", "ما وقت آزادمان را برنامه‌ریزی می‌کنیم.", "MEDIUM"],
      ["vorschlagen", "پیشنهاد دادن", "Ich schlage einen Film vor.", "من یک فیلم پیشنهاد می‌دهم.", "HARD"],
      ["die Serie", "سریال", "Die Serie ist spannend.", "سریال هیجان‌انگیز است.", "EASY"],
      ["spannend", "هیجان‌انگیز", "Der Film ist spannend.", "فیلم هیجان‌انگیز است.", "EASY"],
      ["langweilig", "خسته‌کننده", "Die Sendung ist langweilig.", "برنامه خسته‌کننده است.", "EASY"],
      ["online", "آنلاین", "Ich sehe die Serie online.", "سریال را آنلاین می‌بینم.", "EASY"]
    ]
  },
  {
    slug: "a2-unit-10-core-vocabulary",
    title: "واژگان اصلی A2 واحد 10",
    description: "فلش‌کارت‌های واحد دهم A2 برای رفتار اجتماعی، تعریف و هدیه.",
    category: "Unit 10",
    unitSlug: "a2-social-behavior-compliments-and-gifts",
    cards: [
      ["hoeflich", "مودب", "Sara fragt hoeflich nach Hilfe.", "سارا مودبانه درخواست کمک می‌کند.", "MEDIUM"],
      ["freundlich", "دوستانه", "Der Mitarbeiter ist freundlich.", "کارمند دوستانه برخورد می‌کند.", "EASY"],
      ["Koennten Sie", "می‌توانید؟ / شکل مودبانه", "Koennten Sie mir bitte helfen?", "می‌توانید لطفاً به من کمک کنید؟", "HARD"],
      ["kurz", "کوتاه / مختصر", "Koennten Sie mir kurz helfen?", "می‌توانید کوتاه کمکم کنید؟", "EASY"],
      ["das Formular", "فرم", "Ich verstehe das Formular nicht.", "فرم را نمی‌فهمم.", "MEDIUM"],
      ["das Kompliment", "تعریف / تمجید", "Danke fuer das nette Kompliment.", "ممنون برای این تعریف خوب.", "MEDIUM"],
      ["nett", "خوب / مهربان", "Das ist ein nettes Kompliment.", "این یک تعریف خوب است.", "EASY"],
      ["sich bedanken", "تشکر کردن", "Reza bedankt sich fuer das Kompliment.", "رضا بابت تعریف تشکر می‌کند.", "HARD"],
      ["der Vortrag", "ارائه / سخنرانی", "Dein Vortrag war sehr gut.", "ارائه‌ات خیلی خوب بود.", "MEDIUM"],
      ["antworten", "پاسخ دادن", "Sie antwortet freundlich.", "او دوستانه پاسخ می‌دهد.", "EASY"],
      ["kennenlernen", "آشنا شدن", "Ich moechte neue Leute kennenlernen.", "می‌خواهم با آدم‌های جدید آشنا شوم.", "HARD"],
      ["jemanden", "کسی را", "Ich moechte jemanden kennenlernen.", "می‌خواهم با کسی آشنا شوم.", "MEDIUM"],
      ["ehrlich", "صادق", "Ehrliche Freunde sind wichtig.", "دوستان صادق مهم‌اند.", "MEDIUM"],
      ["der Humor", "شوخ‌طبعی", "Humor ist fuer Ali wichtig.", "شوخ‌طبعی برای علی مهم است.", "MEDIUM"],
      ["die Ehrlichkeit", "صداقت", "Ehrlichkeit ist wichtig.", "صداقت مهم است.", "HARD"],
      ["das Geschenk", "هدیه", "Ich suche ein Geschenk.", "دنبال یک هدیه هستم.", "EASY"],
      ["schenken", "هدیه دادن", "Ich schenke ihr ein Buch.", "به او یک کتاب هدیه می‌دهم.", "MEDIUM"],
      ["der Geburtstag", "تولد", "Ich schenke ihr ein Buch zum Geburtstag.", "برای تولدش به او یک کتاب هدیه می‌دهم.", "EASY"],
      ["der Roman", "رمان", "Mina liest gern Romane.", "مینا دوست دارد رمان بخواند.", "MEDIUM"],
      ["passen zu", "مناسب بودن برای", "Das Geschenk passt zu ihr.", "هدیه مناسب اوست.", "HARD"],
      ["die Aufmerksamkeit", "توجه / لطف کوچک", "Danke fuer die Aufmerksamkeit.", "ممنون بابت توجه.", "HARD"],
      ["die Einladung", "دعوت", "Danke fuer die Einladung.", "ممنون بابت دعوت.", "MEDIUM"],
      ["gratulieren", "تبریک گفتن", "Ich gratuliere dir zum Geburtstag.", "تولدت را تبریک می‌گویم.", "HARD"],
      ["wuenschen", "آرزو کردن", "Ich wuensche dir alles Gute.", "برای تو بهترین‌ها را آرزو می‌کنم.", "MEDIUM"],
      ["alles Gute", "بهترین‌ها", "Alles Gute zum Geburtstag!", "تولدت مبارک!", "EASY"]
    ]
  },
  {
    slug: "a2-unit-11-core-vocabulary",
    title: "واژگان اصلی A2 واحد 11",
    description: "فلش‌کارت‌های واحد یازدهم A2 برای پول، بانک و پیام‌ها.",
    category: "Unit 11",
    unitSlug: "a2-money-banking-and-messages",
    cards: [
      ["sparen", "پس‌انداز کردن", "Ich spare Geld fuer eine Reise.", "برای یک سفر پول پس‌انداز می‌کنم.", "MEDIUM"],
      ["das Geld", "پول", "Geld ist nicht alles.", "پول همه چیز نیست.", "EASY"],
      ["weniger", "کمتر", "Reza kauft weniger Kaffee.", "رضا قهوه کمتری می‌خرد.", "MEDIUM"],
      ["die Reise", "سفر", "Ich spare fuer eine Reise.", "برای سفر پس‌انداز می‌کنم.", "EASY"],
      ["der Wert", "ارزش", "Zeit hat fuer mich einen grossen Wert.", "زمان برای من ارزش زیادی دارد.", "MEDIUM"],
      ["das Konto", "حساب بانکی", "Ich moechte ein Konto eroeffnen.", "می‌خواهم یک حساب باز کنم.", "MEDIUM"],
      ["eroeffnen", "باز کردن", "Mina moechte ein Konto eroeffnen.", "مینا می‌خواهد حساب باز کند.", "HARD"],
      ["die Bank", "بانک", "Mina geht zur Bank.", "مینا به بانک می‌رود.", "EASY"],
      ["die Karte", "کارت", "Ich bekomme eine neue Karte.", "یک کارت جدید می‌گیرم.", "EASY"],
      ["bekommen", "گرفتن / دریافت کردن", "Sie bekommt eine Karte.", "او یک کارت دریافت می‌کند.", "MEDIUM"],
      ["die Ausgabe", "هزینه", "Wir teilen die Ausgabe durch drei.", "هزینه را بین سه نفر تقسیم می‌کنیم.", "MEDIUM"],
      ["teilen", "تقسیم کردن", "Wir teilen die Rechnung.", "صورت‌حساب را تقسیم می‌کنیم.", "EASY"],
      ["durch drei", "تقسیم بر سه", "Wir teilen die Ausgabe durch drei.", "هزینه را بین سه نفر تقسیم می‌کنیم.", "MEDIUM"],
      ["der Anteil", "سهم", "Mein Anteil ist zehn Euro.", "سهم من ده یورو است.", "MEDIUM"],
      ["gemeinsam", "مشترک / با هم", "Wir bezahlen gemeinsam.", "با هم پرداخت می‌کنیم.", "MEDIUM"],
      ["die Ueberweisung", "حواله / انتقال بانکی", "Ich schicke dir die Ueberweisung.", "حواله بانکی را برایت می‌فرستم.", "HARD"],
      ["ueberweisen", "انتقال بانکی دادن", "Ich ueberweise das Geld morgen.", "فردا پول را انتقال می‌دهم.", "HARD"],
      ["bar", "نقدی", "Ali bezahlt nicht bar.", "علی نقدی پرداخت نمی‌کند.", "EASY"],
      ["bezahlen", "پرداخت کردن", "Ich bezahle mit Karte.", "با کارت پرداخت می‌کنم.", "MEDIUM"],
      ["die Rechnung", "صورت‌حساب", "Die Rechnung ist bezahlt.", "صورت‌حساب پرداخت شده است.", "EASY"],
      ["die Nachricht", "پیام", "Ich schreibe dir eine Nachricht.", "برای تو پیام می‌نویسم.", "EASY"],
      ["klar", "روشن / واضح", "Die Nachricht ist klar.", "پیام روشن است.", "EASY"],
      ["morgen", "فردا", "Ich schicke es dir morgen.", "فردا برایت می‌فرستم.", "EASY"],
      ["der Geldautomat", "خودپرداز", "Der Geldautomat ist neben der Bank.", "خودپرداز کنار بانک است.", "MEDIUM"],
      ["abheben", "برداشت کردن", "Ich hebe Geld ab.", "پول برداشت می‌کنم.", "HARD"]
    ]
  },
  {
    slug: "a2-unit-12-core-vocabulary",
    title: "واژگان اصلی A2 واحد 12",
    description: "فلش‌کارت‌های واحد دوازدهم A2 برای سفر، مسیر و تجربه‌های تعطیلات.",
    category: "Unit 12",
    unitSlug: "a2-travel-directions-and-holiday-experiences",
    cards: [
      ["der Ausflug", "سفر کوتاه / گردش", "Wir machen am Sonntag einen Ausflug.", "یکشنبه یک گردش می‌رویم.", "MEDIUM"],
      ["am Sonntag", "روز یکشنبه", "Die Klasse faehrt am Sonntag.", "کلاس یکشنبه می‌رود.", "EASY"],
      ["die Klasse", "کلاس", "Die Klasse macht einen Ausflug.", "کلاس یک گردش می‌رود.", "EASY"],
      ["das Ziel", "مقصد / هدف", "Unser Ziel ist Potsdam.", "مقصد ما پوتسدام است.", "EASY"],
      ["der Zug", "قطار", "Wir fahren mit dem Zug.", "با قطار می‌رویم.", "EASY"],
      ["die Wegbeschreibung", "توضیح مسیر", "Ich brauche eine Wegbeschreibung.", "به توضیح مسیر نیاز دارم.", "HARD"],
      ["beschreiben", "توضیح دادن / توصیف کردن", "Koennen Sie den Weg beschreiben?", "می‌توانید مسیر را توضیح دهید؟", "HARD"],
      ["der Weg", "راه / مسیر", "Der Weg zum Hotel ist kurz.", "مسیر هتل کوتاه است.", "EASY"],
      ["das Hotel", "هتل", "Das Hotel ist in der Naehe.", "هتل در نزدیکی است.", "EASY"],
      ["der Bahnhof", "ایستگاه قطار", "Am Bahnhof fragt Amir nach dem Weg.", "امیر در ایستگاه مسیر را می‌پرسد.", "EASY"],
      ["in der Naehe", "در نزدیکی", "Das Hotel ist in der Naehe.", "هتل نزدیک است.", "MEDIUM"],
      ["geradeaus", "مستقیم", "Gehen Sie geradeaus.", "مستقیم بروید.", "EASY"],
      ["links", "چپ", "Dann gehen Sie links.", "بعد به چپ بروید.", "EASY"],
      ["rechts", "راست", "Das Hotel ist rechts.", "هتل سمت راست است.", "EASY"],
      ["der Reisepartner", "همسفر", "Ich suche einen Reisepartner.", "دنبال یک همسفر هستم.", "MEDIUM"],
      ["allein", "تنها", "Sara reist nicht gern allein.", "سارا دوست ندارد تنها سفر کند.", "EASY"],
      ["die Ferien", "تعطیلات", "Ich suche einen Reisepartner fuer die Ferien.", "برای تعطیلات دنبال همسفر هستم.", "EASY"],
      ["die Erwartung", "انتظار", "Meine Erwartung ist klar.", "انتظار من روشن است.", "HARD"],
      ["zuverlaessig", "قابل اعتماد", "Ein Reisepartner soll zuverlaessig sein.", "همسفر باید قابل اعتماد باشد.", "MEDIUM"],
      ["das Urlaubsfoto", "عکس تعطیلات", "Auf dem Urlaubsfoto sieht man das Meer.", "در عکس تعطیلات دریا دیده می‌شود.", "HARD"],
      ["das Meer", "دریا", "Man sieht das Meer.", "دریا دیده می‌شود.", "EASY"],
      ["auf dem Foto", "در عکس", "Auf dem Foto sieht man zwei Freunde.", "در عکس دو دوست دیده می‌شوند.", "MEDIUM"],
      ["das Wetter", "هوا", "Das Wetter war warm.", "هوا گرم بود.", "EASY"],
      ["warm", "گرم", "Es war warm.", "هوا گرم بود.", "EASY"],
      ["die Erinnerung", "خاطره", "Das Foto ist eine schoene Erinnerung.", "عکس یک خاطره زیباست.", "MEDIUM"]
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
