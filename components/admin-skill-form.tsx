"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";

type SkillInitialValues = {
  title: string;
  description: string;
  xp: number;
  publicationStatus: string;
};

const publicationStatuses = [
  { value: "DRAFT", label: "Draft" }
];

export function AdminSkillForm({
  skillSlug,
  initialValues
}: {
  skillSlug: string;
  initialValues: SkillInitialValues;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [xp, setXp] = useState(String(initialValues.xp));
  const [publicationStatus, setPublicationStatus] = useState(
    initialValues.publicationStatus
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submitSkill(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/skills/${skillSlug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description,
          xp,
          publicationStatus
        })
      });
      const data = (await response.json()) as {
        slug?: string;
        error?: string;
      };

      if (!response.ok || !data.slug) {
        throw new Error(data.error ?? "Unable to update Skill.");
      }

      router.push(`/learn/${data.slug}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update Skill.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submitSkill}>
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <label>
          <span>XP</span>
          <input
            min={0}
            max={1000}
            required
            type="number"
            value={xp}
            onChange={(event) => setXp(event.target.value)}
          />
        </label>

        <label className="form-grid-wide">
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
          <span>Description</span>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>

      {error ? <div className="feedback wrong">{error}</div> : null}

      <div className="route-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          <Save size={18} />
          {submitting ? "Saving..." : "Save Skill"}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => router.push(`/learn/${skillSlug}`)}
        >
          View Skill
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
