import { FlashcardDeckOwnerType } from "@/lib/generated/prisma/enums";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { getLearningPathDisplayCopy } from "@/lib/learning/sample-content";

type DisplayCard = {
  front: string;
  back: string;
  exampleMeaning: string;
};

type DisplayDeck = {
  title: string;
  description: string;
  levelLabel: string;
  category: string;
  ownerType: FlashcardDeckOwnerType;
  unit?: {
    slug: string;
  } | null;
  flashcards: DisplayCard[];
};

const persianTextPattern = /[\u0600-\u06FF]/;

function humanizeSlug(value: string) {
  return value
    .replace(/^(a\d|b\d|c\d)-/, "")
    .replace(/-core-vocabulary$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function unitNumberFromCategory(category: string) {
  return category.match(/\d+/)?.[0] ?? "";
}

function deckTitle(input: {
  levelLabel: string;
  unitNumber: string;
  fallback: string;
  language: InterfaceLanguageCode;
}) {
  if (!persianTextPattern.test(input.fallback)) {
    return input.fallback;
  }

  if (input.language === "de") {
    return input.unitNumber
      ? `${input.levelLabel} Einheit ${input.unitNumber}: Kernwortschatz`
      : `${input.levelLabel} Kernwortschatz`;
  }

  return input.unitNumber
    ? `${input.levelLabel} Unit ${input.unitNumber} Core Vocabulary`
    : `${input.levelLabel} Core Vocabulary`;
}

function deckDescription(input: {
  levelLabel: string;
  unitTitle: string;
  fallback: string;
  language: InterfaceLanguageCode;
}) {
  if (!persianTextPattern.test(input.fallback)) {
    return input.fallback;
  }

  if (input.language === "de") {
    return `Karteikarten fuer ${input.unitTitle}.`;
  }

  return `Flashcards for ${input.unitTitle}.`;
}

function cardBack(front: string, fallback: string, language: InterfaceLanguageCode) {
  if (!persianTextPattern.test(fallback)) {
    return fallback;
  }

  return language === "de" ? `Bedeutung von ${front}` : `Meaning of ${front}`;
}

function exampleMeaning(fallback: string, language: InterfaceLanguageCode) {
  if (!persianTextPattern.test(fallback)) {
    return fallback;
  }

  return language === "de" ? "Beispielbedeutung" : "Example meaning";
}

export function localizeFlashcardDeckForInterface<TDeck extends DisplayDeck>(
  deck: TDeck,
  language: InterfaceLanguageCode
): TDeck {
  if (language === "fa" || deck.ownerType !== FlashcardDeckOwnerType.ADMIN) {
    return deck;
  }

  const displayCopy = getLearningPathDisplayCopy(deck.levelLabel, language);
  const displayUnit = deck.unit?.slug ? displayCopy.units[deck.unit.slug] : undefined;
  const unitNumber = unitNumberFromCategory(deck.category);
  const unitTitle =
    displayUnit?.title ??
    (deck.unit?.slug ? humanizeSlug(deck.unit.slug) : `${deck.levelLabel} Unit ${unitNumber}`);

  return {
    ...deck,
    title: deckTitle({
      levelLabel: deck.levelLabel,
      unitNumber,
      fallback: deck.title,
      language
    }),
    description: deckDescription({
      levelLabel: deck.levelLabel,
      unitTitle,
      fallback: deck.description,
      language
    }),
    flashcards: deck.flashcards.map((card) => ({
      ...card,
      back: cardBack(card.front, card.back, language),
      exampleMeaning: exampleMeaning(card.exampleMeaning, language)
    }))
  };
}

