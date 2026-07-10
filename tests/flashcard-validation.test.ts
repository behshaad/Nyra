import { describe, expect, it } from "vitest";
import {
  FlashcardDifficulty,
  PublicationStatus
} from "@/lib/generated/prisma/enums";
import {
  optionalAudioUrl,
  parseFlashcardInput
} from "@/lib/flashcards/flashcard-validation";

const validFlashcard = {
  deckId: "deck-1",
  front: "der Alltag",
  back: "زندگی روزمره",
  example: "Mein Alltag ist ruhig.",
  exampleMeaning: "زندگی روزمره من آرام است.",
  difficulty: FlashcardDifficulty.MEDIUM
};

describe("flashcard validation", () => {
  it("accepts site paths and http URLs for pronunciation audio", () => {
    expect(optionalAudioUrl("/audio/flashcards/alltag.mp3")).toBe(
      "/audio/flashcards/alltag.mp3"
    );
    expect(optionalAudioUrl("https://cdn.example.com/alltag.mp3")).toBe(
      "https://cdn.example.com/alltag.mp3"
    );
    expect(optionalAudioUrl("http://localhost:3000/alltag.mp3")).toBe(
      "http://localhost:3000/alltag.mp3"
    );
  });

  it("rejects non-path pronunciation audio values", () => {
    expect(optionalAudioUrl("audio/flashcards/alltag.mp3")).toBeNull();
    expect(optionalAudioUrl("javascript:alert(1)")).toBeNull();
  });

  it("defaults card publication to Published", () => {
    const parsed = parseFlashcardInput(validFlashcard);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.input.publicationStatus).toBe(PublicationStatus.PUBLISHED);
    }
  });
});
