"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowRight, ArrowUp, Save, Trash2 } from "lucide-react";

type QuestionInitialValues = {
  type: string;
  prompt: string;
  helper: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  required: boolean;
  publicationStatus: string;
  suggestedFlashcardIds: string[];
};

type SuggestedFlashcardOption = {
  id: string;
  label: string;
  detail: string;
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
  initialValues,
  suggestedFlashcardOptions
}: {
  mode?: "create" | "edit";
  questionId?: string;
  skillSlug: string;
  initialValues: QuestionInitialValues;
  suggestedFlashcardOptions: SuggestedFlashcardOption[];
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
  const [suggestedFlashcardIds, setSuggestedFlashcardIds] = useState(
    initialValues.suggestedFlashcardIds
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
            publicationStatus,
            suggestedFlashcardIds
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

  function addSuggestedFlashcard(flashcardId: string) {
    if (!flashcardId) {
      return;
    }

    setSuggestedFlashcardIds((current) =>
      current.includes(flashcardId) ? current : [...current, flashcardId]
    );
  }

  function removeSuggestedFlashcard(flashcardId: string) {
    setSuggestedFlashcardIds((current) =>
      current.filter((candidate) => candidate !== flashcardId)
    );
  }

  function moveSuggestedFlashcard(flashcardId: string, direction: -1 | 1) {
    setSuggestedFlashcardIds((current) => {
      const index = current.indexOf(flashcardId);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];

      return next;
    });
  }

  const availableSuggestedFlashcards = suggestedFlashcardOptions.filter(
    (option) => !suggestedFlashcardIds.includes(option.id)
  );
  const selectedSuggestedFlashcards = suggestedFlashcardIds
    .map((id) => suggestedFlashcardOptions.find((option) => option.id === id))
    .filter((option): option is SuggestedFlashcardOption => Boolean(option));

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

        <label className="form-grid-wide">
          <span>Suggested Flashcards</span>
          <select
            value=""
            onChange={(event) => addSuggestedFlashcard(event.target.value)}
          >
            <option value="">Add a Published admin Flashcard</option>
            {availableSuggestedFlashcards.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedSuggestedFlashcards.length > 0 ? (
        <div className="admin-list compact-preview">
          {selectedSuggestedFlashcards.map((option, index) => (
            <div className="admin-list-row" key={option.id}>
              <div>
                <strong>
                  {index + 1}. {option.label}
                </strong>
                <span>{option.detail}</span>
              </div>
              <div className="route-actions compact-actions">
                <button
                  className="icon-button"
                  disabled={index === 0}
                  type="button"
                  onClick={() => moveSuggestedFlashcard(option.id, -1)}
                  aria-label="Move suggested Flashcard up"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  className="icon-button"
                  disabled={index === selectedSuggestedFlashcards.length - 1}
                  type="button"
                  onClick={() => moveSuggestedFlashcard(option.id, 1)}
                  aria-label="Move suggested Flashcard down"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  className="icon-button"
                  type="button"
                  onClick={() => removeSuggestedFlashcard(option.id)}
                  aria-label="Remove suggested Flashcard"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

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
