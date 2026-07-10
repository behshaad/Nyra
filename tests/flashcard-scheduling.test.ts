import { describe, expect, it } from "vitest";
import { FlashcardReviewResult } from "@/lib/generated/prisma/enums";
import { getNextReviewSchedule } from "@/lib/flashcards/flashcard-review-repository";

describe("flashcard review scheduling", () => {
  it("advances known cards to the next interval", () => {
    const reviewedAt = new Date("2026-07-10T12:00:00.000Z");
    const schedule = getNextReviewSchedule({
      result: FlashcardReviewResult.KNOWN,
      currentStep: 1,
      reviewedAt
    });

    expect(schedule.intervalStep).toBe(2);
    expect(schedule.dueAt.toISOString()).toBe("2026-07-13T12:00:00.000Z");
  });

  it("resets unknown cards and keeps them due immediately", () => {
    const reviewedAt = new Date("2026-07-10T12:00:00.000Z");
    const schedule = getNextReviewSchedule({
      result: FlashcardReviewResult.UNKNOWN,
      currentStep: 4,
      reviewedAt
    });

    expect(schedule.intervalStep).toBe(0);
    expect(schedule.dueAt).toBe(reviewedAt);
  });
});
