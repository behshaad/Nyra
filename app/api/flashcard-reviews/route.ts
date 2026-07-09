import { NextResponse } from "next/server";
import {
  FlashcardReviewResult,
  reviewFlashcard
} from "@/lib/flashcards/flashcard-review-repository";

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const flashcardId = clean(body.flashcardId);
  const result = clean(body.result);

  if (!flashcardId) {
    return NextResponse.json(
      { error: "flashcardId is required." },
      { status: 400 }
    );
  }

  if (!Object.values(FlashcardReviewResult).includes(result as FlashcardReviewResult)) {
    return NextResponse.json(
      { error: "Review result is invalid." },
      { status: 400 }
    );
  }

  try {
    const state = await reviewFlashcard({
      flashcardId,
      result: result as FlashcardReviewResult
    });

    return NextResponse.json({
      ...state,
      dueAt: state.dueAt.toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unable to review Flashcard."
      },
      { status: 400 }
    );
  }
}
