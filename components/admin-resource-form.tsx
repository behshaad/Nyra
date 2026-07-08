"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";

type SkillOption = {
  id: string;
  slug: string;
  title: string;
};

type UnitOption = {
  id: string;
  slug: string;
  title: string;
  skills: SkillOption[];
};

const resourceTypes = [
  { value: "GRAMMAR_NOTE", label: "Grammar note" },
  { value: "PRONUNCIATION", label: "Pronunciation" },
  { value: "WORKSHEET", label: "Worksheet" },
  { value: "EXTERNAL_LINK", label: "External link" }
];

const publicationStatuses = [
  { value: "DRAFT", label: "Draft" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminResourceForm({ units }: { units: UnitOption[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("GRAMMAR_NOTE");
  const [levelLabel, setLevelLabel] = useState("A1");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [unitId, setUnitId] = useState(units[0]?.id ?? "");
  const [skillId, setSkillId] = useState("");
  const [publicationStatus, setPublicationStatus] = useState("PUBLISHED");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedUnit = useMemo(
    () => units.find((unit) => unit.id === unitId),
    [unitId, units]
  );

  function updateTitle(value: string) {
    setTitle(value);

    if (!slug) {
      setSlug(slugify(value));
    }
  }

  async function submitResource(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          slug,
          type,
          levelLabel,
          description,
          content,
          unitId,
          skillId,
          publicationStatus
        })
      });
      const data = (await response.json()) as {
        slug?: string;
        error?: string;
      };

      if (!response.ok || !data.slug) {
        throw new Error(data.error ?? "Unable to create Resource.");
      }

      router.push(`/resources/${data.slug}`);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create Resource.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={submitResource}>
      <div className="form-grid">
        <label>
          <span>Title</span>
          <input
            required
            value={title}
            onChange={(event) => updateTitle(event.target.value)}
            placeholder="Family grammar practice"
          />
        </label>

        <label>
          <span>Slug</span>
          <input
            required
            value={slug}
            onChange={(event) => setSlug(slugify(event.target.value))}
            placeholder="family-grammar-practice"
          />
        </label>

        <label>
          <span>Resource Type</span>
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {resourceTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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

        <label>
          <span>Level</span>
          <input
            required
            value={levelLabel}
            onChange={(event) => setLevelLabel(event.target.value)}
          />
        </label>

        <label>
          <span>Related Unit</span>
          <select
            value={unitId}
            onChange={(event) => {
              setUnitId(event.target.value);
              setSkillId("");
            }}
          >
            <option value="">No Unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.title}
              </option>
            ))}
          </select>
        </label>

        <label className="form-grid-wide">
          <span>Related Skill</span>
          <select value={skillId} onChange={(event) => setSkillId(event.target.value)}>
            <option value="">No Skill</option>
            {selectedUnit?.skills.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.title}
              </option>
            ))}
          </select>
        </label>

        <label className="form-grid-wide">
          <span>Description</span>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Short learner-facing summary."
          />
        </label>

        <label className="form-grid-wide">
          <span>Content</span>
          <textarea
            required
            rows={8}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Full Resource body shown on the detail page."
          />
        </label>
      </div>

      {error ? <div className="feedback wrong">{error}</div> : null}

      <div className="route-actions">
        <button className="primary-button" type="submit" disabled={submitting}>
          <Save size={18} />
          {submitting ? "Creating..." : "Create Resource"}
        </button>
        <button
          className="secondary-button"
          type="button"
          onClick={() => router.push("/resources")}
        >
          View Library
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
