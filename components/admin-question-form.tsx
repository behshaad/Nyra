"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";

type QuestionInitialValues = {
  type: string;
  prompt: string;
  helper: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  required: boolean;
  publicationStatus: string;
};

const questionTypes = [
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice" },
  { value: "FILL_IN_BLANK", label: "Fill in Blank" },
  { value: "WORD_ORDERING", label: "Word Ordering" }
];

const publicationStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" }
];

export function AdminQuestionForm({
  mode = "edit",
  questionId,
  skillSlug,
  initialValues
}: {
  mode?: "create" | "edit";
  questionId?: string;
  skillSlug: string;
  initialValues: QuestionInitialValues;
}) {
  const router = useRouter();
  const [type, setType] = useState(initialValues.type);
  const [prompt, setPrompt] = useState(initialValues.prompt);
  const [helper, setHelper] = useState(initialValues.helper);
  const [choices, setChoices] = useState(initialValues.choices.join("\n"));
  const [correctAnswer, setCorrectAnswer] = useState(initialValues.correctAnswer);
  const [explanation, setExplanation] = useState(initialValues.explanation);
  const [required, setRequired] = useState(initialValues.required);
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
      const response = await fetch(
        mode === "create"
          ? `/api/admin/skills/${skillSlug}/questions`
          : `/api/admin/questions/${questionId}`,
        {
          method: mode === "create" ? "POST" : "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            type,
            prompt,
            helper,
            choices,
            correctAnswer,
            explanation,
            required,
            publicationStatus
          })
        }
      );
      const data = (await response.json()) as {
        skillSlug?: string;
        error?: string;
      };

      if (!response.ok || !data.skillSlug) {
        throw new Error(
          data.error ??
            (mode === "create" ? "Unable to create Question." : "Unable to update Question.")
        );
      }

      router.push(`/admin/skills/${data.skillSlug}/questions`);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : mode === "create"
            ? "Unable to create Question."
            : "Unable to update Question."
      );
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
          <span>Question Type</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {questionTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

        <label className="checkbox-row">
          <input
            checked={required}
            type="checkbox"
            onChange={(event) => setRequired(event.target.checked)}
          />
          <span>Required in learner sessions</span>
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
          {submitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Question"
              : "Save Question"}
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
