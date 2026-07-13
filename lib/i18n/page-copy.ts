import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";

type Text = Record<InterfaceLanguageCode, string>;

export function text(copy: Text, language: InterfaceLanguageCode) {
  return copy[language];
}

export const commonCopy = {
  backToAdmin: {
    fa: "بازگشت به ادمین",
    en: "Back to Admin",
    de: "Zurueck zum Admin"
  },
  level: {
    fa: "سطح",
    en: "Level",
    de: "Niveau"
  },
  type: {
    fa: "نوع",
    en: "Type",
    de: "Typ"
  },
  language: {
    fa: "زبان",
    en: "Language",
    de: "Sprache"
  },
  status: {
    fa: "وضعیت",
    en: "Status",
    de: "Status"
  },
  skill: {
    fa: "مهارت",
    en: "Skill",
    de: "Skill"
  },
  notLinked: {
    fa: "وصل نشده",
    en: "Not linked",
    de: "Nicht verknuepft"
  }
} satisfies Record<string, Text>;

export const publicationStatusCopy = {
  DRAFT: {
    fa: "پیش‌نویس",
    en: "Draft",
    de: "Entwurf"
  },
  IN_REVIEW: {
    fa: "در بازبینی",
    en: "In Review",
    de: "In Pruefung"
  },
  PUBLISHED: {
    fa: "منتشر شده",
    en: "Published",
    de: "Veroeffentlicht"
  },
  ARCHIVED: {
    fa: "آرشیو شده",
    en: "Archived",
    de: "Archiviert"
  }
} satisfies Record<string, Text>;

export const resourceTypeCopy = {
  BOOK: {
    fa: "کتاب",
    en: "Book",
    de: "Buch"
  },
  VIDEO: {
    fa: "ویدئو",
    en: "Video",
    de: "Video"
  },
  AUDIO_LESSON: {
    fa: "درس صوتی",
    en: "Audio lesson",
    de: "Audiolektion"
  },
  EXTERNAL_LINK: {
    fa: "لینک بیرونی",
    en: "External link",
    de: "Externer Link"
  },
  GRAMMAR_RESOURCE: {
    fa: "منبع گرامر",
    en: "Grammar resource",
    de: "Grammatikressource"
  },
  READING_MATERIAL: {
    fa: "متن خواندنی",
    en: "Reading material",
    de: "Lesematerial"
  },
  LEARNING_GUIDE: {
    fa: "راهنمای یادگیری",
    en: "Learning guide",
    de: "Lernleitfaden"
  }
} satisfies Record<string, Text>;

export const skillKindCopy = {
  REGULAR: {
    fa: "مهارت",
    en: "Skill",
    de: "Skill"
  },
  UNIT_CHECKPOINT: {
    fa: "آزمونک واحد",
    en: "Unit Checkpoint",
    de: "Unit-Check"
  },
  FINAL_TEST: {
    fa: "آزمون نهایی",
    en: "Final Test",
    de: "Abschlusstest"
  }
} satisfies Record<string, Text>;

export const pricingCopy = {
  label: {
    fa: "قیمت‌گذاری",
    en: "Pricing",
    de: "Preise"
  },
  title: {
    fa: "فعلا رایگان، تا زمانی که حلقه یادگیری کامل‌تر شود.",
    en: "Free while the learning loop matures.",
    de: "Kostenlos, waehrend der Lernkreislauf reift."
  },
  body: {
    fa: "پرداخت، وب‌هوک، سطح پریمیوم و انتخاب ارائه‌دهنده بعد از روشن شدن نیازهای یادگیری و محدودیت‌های پرداخت منطقه‌ای اضافه می‌شود.",
    en: "Payments, checkout, webhooks, premium gating, and provider choice are deferred until the learning loop and regional payment constraints are clear.",
    de: "Zahlungen, Checkout, Webhooks, Premium-Grenzen und Anbieterwahl folgen, wenn Lernkreislauf und regionale Zahlungsbedingungen klar sind."
  },
  freeNow: {
    fa: "فعلا رایگان",
    en: "Free now",
    de: "Jetzt kostenlos"
  },
  trustTitle: {
    fa: "اول اعتماد بسازیم، بعد پرداخت.",
    en: "Build trust before billing.",
    de: "Erst Vertrauen, dann Abrechnung."
  },
  trustBody: {
    fa: "نسخه اولیه باید ثابت کند Nyra خوب آموزش می‌دهد، قبل از اینکه اشتراک فعال شود.",
    en: "The MVP should prove that Nyra teaches well before subscriptions are wired.",
    de: "Das MVP soll zeigen, dass Nyra gut unterrichtet, bevor Abos angeschlossen werden."
  },
  premium: {
    fa: "پریمیوم آینده",
    en: "Future Premium",
    de: "Spaeter Premium"
  }
} satisfies Record<string, Text>;

export const resourceCopy = {
  label: {
    fa: "کتابخانه منابع",
    en: "Resource Library",
    de: "Ressourcenbibliothek"
  },
  title: {
    fa: "منابع واقعی برای مطالعه کنار مسیر A1.",
    en: "Real study material around the A1 path.",
    de: "Echte Lernmaterialien rund um den A1-Pfad."
  },
  body: {
    fa: "کتاب، ویدئو، درس صوتی، گرامر، خواندن و راهنماهایی که به مهارت‌ها و سطح‌های CEFR وصل می‌شوند.",
    en: "Books, videos, audio lessons, grammar, reading, and guides linked to CEFR levels and Skills.",
    de: "Buecher, Videos, Audiolektionen, Grammatik, Lesematerial und Guides mit CEFR-Niveau und Skill-Bezug."
  },
  featuredTitle: {
    fa: "منابع پیشنهادی برای حلقه A1",
    en: "Popular supported material for the A1 loop",
    de: "Beliebte Materialien fuer den A1-Kreislauf"
  },
  featuredBody: {
    fa: "چند منبع منتخب برای شروع سریع؛ بقیه کتابخانه با فیلتر نوع، سطح و زبان قابل مرور است.",
    en: "A few curated starting points; the full library can be filtered by type, level, and language.",
    de: "Einige kuratierte Startpunkte; die Bibliothek laesst sich nach Typ, Niveau und Sprache filtern."
  },
  searchPlaceholder: {
    fa: "جست‌وجوی منبع، گرامر، واژه یا مهارت...",
    en: "Search resources, grammar, vocabulary, or Skills...",
    de: "Ressourcen, Grammatik, Wortschatz oder Skills suchen..."
  },
  searchAction: {
    fa: "جست‌وجو",
    en: "Search",
    de: "Suchen"
  },
  searchClear: {
    fa: "پاک کردن جست‌وجو",
    en: "Clear search",
    de: "Suche loeschen"
  },
  searchResults: {
    fa: "نتیجه برای",
    en: "results for",
    de: "Ergebnisse fuer"
  },
  searchNoResultsTitle: {
    fa: "منبعی پیدا نشد.",
    en: "No resources matched.",
    de: "Keine passenden Ressourcen gefunden."
  },
  searchNoResultsBody: {
    fa: "نام مهارت، موضوع گرامر، سطح یا نوع منبع را امتحان کن.",
    en: "Try a Skill name, grammar topic, level, or Resource Type.",
    de: "Versuche einen Skill-Namen, ein Grammatikthema, ein Niveau oder einen Ressourcentyp."
  },
  preview: {
    fa: "پیش‌نمایش",
    en: "Preview",
    de: "Vorschau"
  },
  resourceBody: {
    fa: "متن منبع",
    en: "Resource body",
    de: "Ressourcentext"
  },
  relatedUnit: {
    fa: "واحد مرتبط",
    en: "Related Unit",
    de: "Verknuepfte Einheit"
  },
  back: {
    fa: "بازگشت به کتابخانه منابع",
    en: "Back to Resource Library",
    de: "Zurueck zur Ressourcenbibliothek"
  },
  practice: {
    fa: "تمرین",
    en: "Practice",
    de: "Ueben"
  }
} satisfies Record<string, Text>;

export const flashcardCopy = {
  label: {
    fa: "فلش‌کارت",
    en: "Flashcards",
    de: "Karten"
  },
  title: {
    fa: "واژگان A1 را با مرور فعال تمرین کن.",
    en: "Practice A1 vocabulary with active review.",
    de: "Uebe A1-Wortschatz mit aktiver Wiederholung."
  },
  body: {
    fa: "کارت‌ها بر اساس سطح CEFR و مهارت فیلتر می‌شوند، برمی‌گردند، نمونه دارند و وضعیت دانسته/ندانسته را ثبت می‌کنند.",
    en: "Cards filter by CEFR Level and Skill, flip, include examples, and track known or unknown review status.",
    de: "Karten filtern nach CEFR-Niveau und Skill, drehen sich, zeigen Beispiele und speichern bekannt/unbekannt."
  }
} satisfies Record<string, Text>;

export const profileCopy = {
  label: {
    fa: "پروفایل یادگیرنده",
    en: "Learner Profile",
    de: "Lernprofil"
  },
  title: {
    fa: "هویت یادگیری و تنظیمات حساب در یک جای روشن.",
    en: "Learning identity and account settings in one clear place.",
    de: "Lernidentitaet und Kontoeinstellungen an einem klaren Ort."
  },
  body: {
    fa: "پروفایل یادگیرنده هدف‌ها، زبان‌ها و ترجیحات مطالعه را نگه می‌دارد؛ تنظیمات حساب برای اتصال احراز هویت آماده شده‌اند.",
    en: "The Learner Profile owns goals, languages, and study preferences; account settings are prepared for auth integration.",
    de: "Das Lernprofil enthaelt Ziele, Sprachen und Lernpraeferenzen; Kontoeinstellungen sind fuer Auth vorbereitet."
  }
} satisfies Record<string, Text>;

export const adminCopy = {
  label: {
    fa: "کنسول مدیریت",
    en: "Admin Console",
    de: "Admin-Konsole"
  },
  title: {
    fa: "اتاق کنترل محتوای Nyra.",
    en: "Nyra content control room.",
    de: "Nyra-Kontrollraum fuer Inhalte."
  },
  body: {
    fa: "مهارت‌ها، سؤال‌ها و منابع واقعی مدیریت می‌شوند؛ ماژول‌های فلش‌کارت، پروفایل، سطح‌ها و بومی‌سازی برای توسعه بعدی آماده‌اند.",
    en: "Skills, Questions, and Resources are managed today; Flashcards, Profiles, Levels, and Localization are prepared modules.",
    de: "Skills, Fragen und Ressourcen werden heute verwaltet; Karten, Profile, Niveaus und Lokalisierung sind vorbereitete Module."
  }
} satisfies Record<string, Text>;
