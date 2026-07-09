export type InterfaceLanguageCode = "fa" | "en" | "de";

export type InterfaceCopy = {
  dir: "rtl" | "ltr";
  brandSubtitle: string;
  nav: {
    learn: string;
    resources: string;
    flashcards: string;
    pricing: string;
    profile: string;
    admin: string;
  };
  header: {
    adminPreview: string;
    startLearning: string;
    languageLabel: string;
  };
  home: {
    eyebrow: string;
    title: string;
    body: string;
    startA1: string;
    viewPath: string;
    panelKicker: string;
    questionCount: string;
    skillCount: string;
    cards: Array<{
      title: string;
      description: string;
    }>;
  };
  learn: {
    label: string;
    title: string;
    body: (input: {
      regularSkillCount: number;
      checkpointCount: number;
      questionCount: number;
    }) => string;
    levelLabel: string;
    levelComingSoon: string;
    progress: string;
    completed: string;
    nextStep: string;
    continue: string;
    completeLabel: string;
    completeTitle: string;
    completeBody: string;
    reviewFromStart: string;
    unit: string;
    progressPercent: string;
    finalTest: string;
    checkpoint: string;
    assessment: string;
    skill: string;
    completedState: string;
    reviewState: string;
    currentState: string;
    upcomingState: string;
  };
  skillPage: {
    labels: {
      regular: string;
      checkpoint: string;
      finalTest: string;
    };
    backToUnit: string;
  };
  session: {
    loading: string;
    errorTitle: string;
    retry: string;
    finalTest: string;
    checkpoint: string;
    practice: string;
    passingScore: (score: number | null) => string;
    points: (xp: number) => string;
    complete: string;
    question: string;
    passed: string;
    reviewRecommended: string;
    skillComplete: string;
    assessmentBody: string;
    skillBody: string;
    attempts: string;
    score: string;
    xp: string;
    continueNext: string;
    continueTo: (title: string) => string;
    backToPath: string;
    backToUnit: string;
    practiceAgain: string;
    checking: string;
    correct: string;
    mistake: string;
    continue: string;
    hint: string;
  };
};

export const defaultInterfaceLanguage: InterfaceLanguageCode = "fa";

export function resolveInterfaceLanguage(value: unknown): InterfaceLanguageCode {
  if (value === "en" || value === "English") {
    return "en";
  }

  if (value === "de" || value === "Deutsch") {
    return "de";
  }

  return defaultInterfaceLanguage;
}

export function interfaceLanguagePreferenceHref(input: {
  language: InterfaceLanguageCode;
  returnTo: string;
}) {
  const params = new globalThis.URLSearchParams({
    ui: input.language,
    returnTo: input.returnTo
  });

  return `/api/learner-preferences/interface-language?${params.toString()}`;
}

export function levelPreferenceHref(input: {
  level: string;
  returnTo: string;
}) {
  const params = new globalThis.URLSearchParams({
    level: input.level,
    returnTo: input.returnTo
  });

  return `/api/learner-preferences/level?${params.toString()}`;
}

export function withInterfaceLanguage(
  href: string,
  language: InterfaceLanguageCode
) {
  if (language === defaultInterfaceLanguage) {
    return href;
  }

  const [pathname, query = ""] = href.split("?");
  const params = new globalThis.URLSearchParams(query);
  params.set("ui", language);
  const serialized = params.toString();

  return serialized ? `${pathname}?${serialized}` : pathname;
}

export const interfaceCopy: Record<InterfaceLanguageCode, InterfaceCopy> = {
  fa: {
    dir: "rtl",
    brandSubtitle: "آلمانی برای فارسی‌زبان‌ها",
    nav: {
      learn: "یادگیری",
      resources: "منابع",
      flashcards: "فلش‌کارت",
      pricing: "قیمت‌گذاری",
      profile: "پروفایل",
      admin: "ادمین"
    },
    header: {
      adminPreview: "نمای ادمین",
      startLearning: "ادامه یادگیری",
      languageLabel: "زبان رابط"
    },
    home: {
      eyebrow: "مسیر کامل A1",
      title: "Nyra برای تمرین A1 آماده است.",
      body: "۱۲ واحد A1 را با پشتیبانی فارسی، تمرین‌های آلمانی، آزمونک‌های واحد و آزمون نهایی A1 تمرین کن.",
      startA1: "شروع A1",
      viewPath: "دیدن مسیر یادگیری",
      panelKicker: "نسخه فعلی",
      questionCount: "سؤال",
      skillCount: "مهارت",
      cards: [
        {
          title: "مسیر یادگیری A1",
          description: "Nyra با یک مسیر کامل A1 برای فارسی‌زبان‌های در حال یادگیری آلمانی شروع می‌شود."
        },
        {
          title: "محتوای بازبینی‌شده",
          description: "محتوای learner-facing قطعی، نوشته‌شده و قابل اعتماد می‌ماند."
        },
        {
          title: "پیشرفت رویدادمحور",
          description: "تلاش‌ها و نشست‌های یادگیری ذخیره می‌شوند تا مسیر ادامه روشن باشد."
        },
        {
          title: "اشتراک بعدا",
          description: "قیمت‌گذاری دیده می‌شود، اما پرداخت واقعی بعد از کامل‌تر شدن حلقه یادگیری می‌آید."
        }
      ]
    },
    learn: {
      label: "مسیر یادگیری A1",
      title: "ادامه بده، بدون گم شدن بین درس‌ها.",
      body: ({ regularSkillCount, checkpointCount, questionCount }) =>
        `این نمای فشرده فقط واحد انتخاب‌شده، مهارت‌های همان واحد، و قدم بعدی را نشان می‌دهد. کل A1 شامل ${regularSkillCount} مهارت، ${checkpointCount} آزمونک واحد و ${questionCount} سؤال است.`,
      levelLabel: "سطح",
      levelComingSoon: "به‌زودی",
      progress: "پیشرفت A1",
      completed: "کامل شده",
      nextStep: "قدم بعدی",
      continue: "ادامه",
      completeLabel: "A1 کامل شد",
      completeTitle: "همه‌ی مسیر را تمام کرده‌ای.",
      completeBody: "برای مرور، یکی از واحدها را انتخاب کن و مهارت‌ها را دوباره بزن.",
      reviewFromStart: "مرور از ابتدا",
      unit: "واحد",
      progressPercent: "پیشرفت",
      finalTest: "آزمون نهایی A1",
      checkpoint: "آزمونک واحد",
      assessment: "سنجش",
      skill: "مهارت",
      completedState: "کامل",
      reviewState: "نیاز به مرور",
      currentState: "فعلی",
      upcomingState: "بعدی"
    },
    skillPage: {
      labels: {
        regular: "مهارت A1",
        checkpoint: "آزمونک واحد A1",
        finalTest: "آزمون نهایی A1"
      },
      backToUnit: "برگشت به واحد"
    },
    session: {
      loading: "در حال شروع تمرین...",
      errorTitle: "تمرین شروع نشد.",
      retry: "تلاش دوباره",
      finalTest: "آزمون نهایی A1",
      checkpoint: "آزمونک واحد",
      practice: "تمرین مهارت",
      passingScore: (score) => `حد قبولی ${score}%`,
      points: (xp) => `${xp} امتیاز`,
      complete: "تمرین کامل شد",
      question: "سؤال",
      passed: "قبول شدی",
      reviewRecommended: "مرور پیشنهاد می‌شود",
      skillComplete: "مهارت کامل شد",
      assessmentBody:
        "نمره ذخیره شد. اگر پایین‌تر از حد قبولی باشد، این بخش برای مرور علامت می‌خورد ولی مسیرت قفل نمی‌شود.",
      skillBody: "پیشرفتت ذخیره شد و می‌توانی مستقیم سراغ قدم بعدی بروی.",
      attempts: "تلاش‌ها",
      score: "نمره",
      xp: "امتیاز",
      continueNext: "ادامه به مهارت بعدی",
      continueTo: (title) => `ادامه: ${title}`,
      backToPath: "برگشت به مسیر A1",
      backToUnit: "برگشت به واحد",
      practiceAgain: "تمرین دوباره",
      checking: "در حال بررسی...",
      correct: "درست است.",
      mistake: "اشتباه خوبی برای یادگیری بود.",
      continue: "ادامه",
      hint:
        "پاسخ‌ها ذخیره و بررسی می‌شوند. در مهارت‌های تمرینی، سؤال‌های اشتباه دوباره برمی‌گردند."
    }
  },
  en: {
    dir: "ltr",
    brandSubtitle: "Persian-first German",
    nav: {
      learn: "Learn",
      resources: "Resources",
      flashcards: "Flashcards",
      pricing: "Pricing",
      profile: "Profile",
      admin: "Admin"
    },
    header: {
      adminPreview: "Admin Preview",
      startLearning: "Continue learning",
      languageLabel: "Interface language"
    },
    home: {
      eyebrow: "Complete A1 path",
      title: "Nyra is ready for A1 practice.",
      body: "Practice 12 A1 Units with Persian-first support, German-first questions, Unit Checkpoints, and a Final A1 Test.",
      startA1: "Start A1",
      viewPath: "View learning path",
      panelKicker: "Current slice",
      questionCount: "Questions",
      skillCount: "Skills",
      cards: [
        {
          title: "A1 learning path",
          description: "Nyra starts with one complete A1 path for Persian speakers learning German."
        },
        {
          title: "Reviewed content",
          description: "Learner-facing content stays deterministic, authored, and trustworthy."
        },
        {
          title: "Event-based progress",
          description: "Attempts and sessions are saved so the next step stays clear."
        },
        {
          title: "Premium later",
          description: "Pricing is visible now, but real subscriptions wait for the learning loop."
        }
      ]
    },
    learn: {
      label: "A1 Learning Path",
      title: "Continue without getting lost between lessons.",
      body: ({ regularSkillCount, checkpointCount, questionCount }) =>
        `This compact view shows the selected Unit, its Skills, and your next step. A1 includes ${regularSkillCount} Skills, ${checkpointCount} Unit Checkpoints, and ${questionCount} Questions.`,
      levelLabel: "Level",
      levelComingSoon: "Coming soon",
      progress: "A1 progress",
      completed: "completed",
      nextStep: "Next step",
      continue: "Continue",
      completeLabel: "A1 complete",
      completeTitle: "You finished the full path.",
      completeBody: "Pick a Unit to review and practice the Skills again.",
      reviewFromStart: "Review from start",
      unit: "Unit",
      progressPercent: "progress",
      finalTest: "Final A1 Test",
      checkpoint: "Unit Checkpoint",
      assessment: "Assessment",
      skill: "Skill",
      completedState: "Done",
      reviewState: "Review",
      currentState: "Current",
      upcomingState: "Next"
    },
    skillPage: {
      labels: {
        regular: "A1 Skill",
        checkpoint: "A1 Unit Checkpoint",
        finalTest: "Final A1 Test"
      },
      backToUnit: "Back to Unit"
    },
    session: {
      loading: "Starting practice...",
      errorTitle: "Practice could not start.",
      retry: "Try again",
      finalTest: "Final A1 Test",
      checkpoint: "Unit Checkpoint",
      practice: "Skill practice",
      passingScore: (score) => `Passing score ${score}%`,
      points: (xp) => `${xp} XP`,
      complete: "Session complete",
      question: "Question",
      passed: "Assessment passed",
      reviewRecommended: "Review recommended",
      skillComplete: "Skill complete",
      assessmentBody:
        "Your score was saved. Low scores mark this area for review without locking your path.",
      skillBody: "Your progress was saved and you can continue to the next step.",
      attempts: "Attempts",
      score: "Score",
      xp: "XP",
      continueNext: "Continue to next Skill",
      continueTo: (title) => `Continue: ${title}`,
      backToPath: "Back to A1 path",
      backToUnit: "Back to Unit",
      practiceAgain: "Practice again",
      checking: "Checking...",
      correct: "Correct.",
      mistake: "Good mistake to learn from.",
      continue: "Continue",
      hint:
        "Answers are saved and checked. In practice Skills, missed Questions come back again."
    }
  },
  de: {
    dir: "ltr",
    brandSubtitle: "Deutschlernen mit persischer Unterstuetzung",
    nav: {
      learn: "Lernen",
      resources: "Ressourcen",
      flashcards: "Karten",
      pricing: "Preise",
      profile: "Profil",
      admin: "Admin"
    },
    header: {
      adminPreview: "Admin",
      startLearning: "Weiterlernen",
      languageLabel: "Oberflaechensprache"
    },
    home: {
      eyebrow: "Kompletter A1-Pfad",
      title: "Nyra ist bereit fuer A1-Uebung.",
      body: "Uebe 12 A1-Einheiten mit persischer Unterstuetzung, deutschen Aufgaben, Unit-Checks und einem finalen A1-Test.",
      startA1: "A1 starten",
      viewPath: "Lernpfad ansehen",
      panelKicker: "Aktueller Stand",
      questionCount: "Fragen",
      skillCount: "Skills",
      cards: [
        {
          title: "A1-Lernpfad",
          description: "Nyra startet mit einem vollstaendigen A1-Pfad fuer persische Deutschlernende."
        },
        {
          title: "Gepruefte Inhalte",
          description: "Lerninhalte bleiben verfasst, vorhersehbar und vertrauenswuerdig."
        },
        {
          title: "Fortschritt als Ereignisse",
          description: "Versuche und Sessions werden gespeichert, damit der naechste Schritt klar bleibt."
        },
        {
          title: "Premium spaeter",
          description: "Preise sind sichtbar, echte Abos folgen nach dem stabilen Lernkreislauf."
        }
      ]
    },
    learn: {
      label: "A1-Lernpfad",
      title: "Weiterlernen, ohne zwischen Skills verloren zu gehen.",
      body: ({ regularSkillCount, checkpointCount, questionCount }) =>
        `Diese kompakte Ansicht zeigt die gewaehlte Einheit, ihre Skills und deinen naechsten Schritt. A1 enthaelt ${regularSkillCount} Skills, ${checkpointCount} Unit-Checks und ${questionCount} Fragen.`,
      levelLabel: "Niveau",
      levelComingSoon: "Demnaechst",
      progress: "A1-Fortschritt",
      completed: "abgeschlossen",
      nextStep: "Naechster Schritt",
      continue: "Weiter",
      completeLabel: "A1 abgeschlossen",
      completeTitle: "Du hast den ganzen Pfad beendet.",
      completeBody: "Waehle eine Einheit aus, um Skills erneut zu ueben.",
      reviewFromStart: "Von vorn wiederholen",
      unit: "Einheit",
      progressPercent: "Fortschritt",
      finalTest: "Finaler A1-Test",
      checkpoint: "Unit-Check",
      assessment: "Pruefung",
      skill: "Skill",
      completedState: "Fertig",
      reviewState: "Wiederholen",
      currentState: "Aktuell",
      upcomingState: "Weiter"
    },
    skillPage: {
      labels: {
        regular: "A1-Skill",
        checkpoint: "A1-Unit-Check",
        finalTest: "Finaler A1-Test"
      },
      backToUnit: "Zurueck zur Einheit"
    },
    session: {
      loading: "Uebung wird gestartet...",
      errorTitle: "Uebung konnte nicht starten.",
      retry: "Erneut versuchen",
      finalTest: "Finaler A1-Test",
      checkpoint: "Unit-Check",
      practice: "Skill-Uebung",
      passingScore: (score) => `Bestehensgrenze ${score}%`,
      points: (xp) => `${xp} XP`,
      complete: "Session abgeschlossen",
      question: "Frage",
      passed: "Pruefung bestanden",
      reviewRecommended: "Wiederholung empfohlen",
      skillComplete: "Skill abgeschlossen",
      assessmentBody:
        "Dein Ergebnis wurde gespeichert. Niedrige Werte markieren diesen Bereich zur Wiederholung, ohne den Pfad zu sperren.",
      skillBody: "Dein Fortschritt wurde gespeichert und du kannst direkt fortfahren.",
      attempts: "Versuche",
      score: "Ergebnis",
      xp: "XP",
      continueNext: "Zum naechsten Skill",
      continueTo: (title) => `Weiter: ${title}`,
      backToPath: "Zurueck zum A1-Pfad",
      backToUnit: "Zurueck zur Einheit",
      practiceAgain: "Noch einmal ueben",
      checking: "Pruefen...",
      correct: "Richtig.",
      mistake: "Ein guter Fehler zum Lernen.",
      continue: "Weiter",
      hint:
        "Antworten werden gespeichert und geprueft. In Uebungs-Skills kommen falsche Fragen erneut."
    }
  }
};
