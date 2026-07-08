"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";

export function AdminQuestionMoveButton({
  questionId,
  direction,
  disabled
}: {
  questionId: string;
  direction: "up" | "down";
  disabled: boolean;
}) {
  const router = useRouter();
  const [moving, setMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const Icon = direction === "up" ? ArrowUp : ArrowDown;

  async function moveQuestion() {
    setMoving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/questions/${questionId}/move`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ direction })
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Unable to move Question.");
      }

      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to move Question.");
    } finally {
      setMoving(false);
    }
  }

  return (
    <span className="inline-action">
      <button
        aria-label={`Move question ${direction}`}
        className="icon-button compact-icon"
        disabled={disabled || moving}
        title={`Move ${direction}`}
        type="button"
        onClick={moveQuestion}
      >
        <Icon size={16} />
      </button>
      {error ? <small>{error}</small> : null}
    </span>
  );
}
