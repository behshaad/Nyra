import { describe, expect, it } from "vitest";
import { FlashcardDeckOwnerType, PublicationStatus, FlashcardDifficulty } from "@/lib/generated/prisma/enums";
import { localizeFlashcardDeckForInterface } from "@/lib/flashcards/flashcard-display";

const persianTextPattern = /[\u0600-\u06FF]/;

describe("flashcard display localization", () => {
  it("removes Persian prepared deck text in German interface mode", () => {
    const deck = localizeFlashcardDeckForInterface(
      {
        id: "deck-1",
        slug: "a2-unit-1-core-vocabulary",
        title: "واژگان اصلی A2 واحد 1",
        description: "سی فلش‌کارت نویسنده‌شده برای واحد اول A2: آلمانی در زندگی جهانی.",
        levelLabel: "A2",
        category: "Unit 1",
        iconKey: "layers-3",
        colorKey: "teal",
        ownerType: FlashcardDeckOwnerType.ADMIN,
        publicationStatus: PublicationStatus.PUBLISHED,
        unit: {
          slug: "a2-german-in-global-life"
        },
        flashcards: [
          {
            id: "card-1",
            front: "der Alltag",
            back: "زندگی روزمره",
            article: "der",
            example: "Mein Alltag ist jetzt ruhiger.",
            exampleMeaning: "زندگی روزمره من حالا آرام‌تر است.",
            pronunciation: null,
            pronunciationAudioUrl: null,
            difficulty: FlashcardDifficulty.MEDIUM,
            publicationStatus: PublicationStatus.PUBLISHED,
            isDue: true,
            dueAt: null,
            intervalStep: null
          }
        ]
      },
      "de"
    );

    expect(deck.title).toBe("A2 Einheit 1: Kernwortschatz");
    expect(deck.description).not.toMatch(persianTextPattern);
    expect(deck.flashcards[0]?.back).toBe("Bedeutung von der Alltag");
    expect(deck.flashcards[0]?.exampleMeaning).not.toMatch(persianTextPattern);
  });
});

