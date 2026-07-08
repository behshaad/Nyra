"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";

type QuestionInitialValues = {
  prompt: string;
  helper: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  publicationStatus: string;
};

const publicationStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" }
];

export function AdminQuestionForm({
  questionId,
  skillSlug,
  initialValues
}: {
  questionId: string;
  skillSlug: string;
  initialValues: QuestionInitialValues;
}) {
  const router = useRouter();
  const [prompt, setPrompt] = useState(initialValues.prompt);
  const [helper, setHelper] = useState(initialValues.helper);
  const [choices, setChoices] = useState(initialValues.choices.join("\n"));
  const [correctAnswer, setCorrectAnswer] = useState(initialValues.correctAnswer);
  const [explanation, setExplanation] = useState(initialValues.explanation);
  const [publicationStatus, setPublicationStatus] = useState(
    initialValues.publicationStatus
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitQuestion(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/questions/${questionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          helper,
          choices,
          correctAnswer,
          explanation,
          publicationStatus
        })
      });
      const data = (await response.json()) as {
        skillSlug?: string;
        error?: string;
      };

      if (!response.ok || !data.skillSlug) {
        throw new Error(data.error ?? "Unable to update Question.");
      }

      router.push(`/admin/skills/${data.skillSlug}/questions`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update Question.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submitQuestion}>
      <div className="form-grid">
        <label className="form-grid-wide">
          <span>Prompt</span>
          <textarea
            required
            rows={4}
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>

        <label>
          <span>Helper</span>
          <input value={helper} onChange={(event) => setHelper(event.target.value)} />
        </label>

        <label>
          <span>Publication Status</span>
          <select
            value={publicationStatus}
            onChange={(event) => setPublicationStatus(event.target.value)}
          >
            {publicationStatuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="form-grid-wide">
          <span>Choices, one per line</span>
          <textarea
            required
            rows={6}
            value={choices}
            onChange={(event) => setChoices(event.target.value)}
          />
        </label>

        <label className="form-grid-wide">
          <span>Correct Answer</span>
          <input
            required
            value={correctAnswer}
            onChange={(event) => setCorrectAnswer(event.target.value)}
          />
        </label>

        <label className="form-grid-wide">
          <span>Explanation</span>
          <textarea
            required
            rows={5}
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
          />
        </label>
      </div>

      {error ? <div className="feedback wrong">{error}</div> : null}

      <div className="route-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          <Save size={18} />
          {submitting ? "Saving..." : "Save Question"}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => router.push(`/admin/skills/${skillSlug}/questions`)}
        >
          Back to Questions
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
