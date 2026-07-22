"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";

type SkillOption = { id: string; slug: string; title: string };
type UnitOption = {
  id: string;
  slug: string;
  title: string;
  levelLabel: string;
  skills: SkillOption[];
};
type ResourceInitialValues = {
  title: string;
  slug: string;
  type: string;
  levelLabel: string;
  language: string;
  thumbnailIcon: string;
  metadata: string;
  description: string;
  content: string;
  url: string;
  unitId: string;
  skillId: string;
  publicationStatus: string;
};

const resourceTypes = [
  ["BOOK", "Book"], ["VIDEO", "Video"], ["AUDIO_LESSON", "Audio lesson"],
  ["EXTERNAL_LINK", "External link"], ["GRAMMAR_RESOURCE", "Grammar resource"],
  ["READING_MATERIAL", "Reading material"], ["LEARNING_GUIDE", "Learning guide"]
];
const resourceIcons = [
  ["book-open", "Book"], ["video", "Video"], ["headphones", "Audio"],
  ["external-link", "External link"], ["notebook-tabs", "Grammar"],
  ["file-text", "Reading"], ["route", "Guide"], ["map", "Map"]
];

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function AdminResourceForm({
  units,
  mode = "create",
  resourceSlug,
  initialValues,
  editable = true
}: {
  units: UnitOption[];
  mode?: "create" | "edit";
  resourceSlug?: string;
  initialValues?: ResourceInitialValues;
  editable?: boolean;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [type, setType] = useState(initialValues?.type ?? "GRAMMAR_RESOURCE");
  const [levelLabel, setLevelLabel] = useState(initialValues?.levelLabel ?? units[0]?.levelLabel ?? "A1");
  const [language, setLanguage] = useState(initialValues?.language ?? "fa");
  const [thumbnailIcon, setThumbnailIcon] = useState(initialValues?.thumbnailIcon ?? "book-open");
  const [metadata, setMetadata] = useState(initialValues?.metadata ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [url, setUrl] = useState(initialValues?.url ?? "");
  const [unitId, setUnitId] = useState(initialValues?.unitId ?? "");
  const [skillId, setSkillId] = useState(initialValues?.skillId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const levels = useMemo(() => [...new Set(units.map((unit) => unit.levelLabel))], [units]);
  const selectedUnit = units.find((unit) => unit.id === unitId);
  const needsDestination = ["EXTERNAL_LINK", "VIDEO", "AUDIO_LESSON"].includes(type);

  async function submitResource(event: FormEvent) {
    event.preventDefault();
    if (!editable) return;
    setSubmitting(true);
    setError(null);
    try {
      const endpoint = mode === "edit" && resourceSlug ? `/api/admin/resources/${resourceSlug}` : "/api/admin/resources";
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, type, levelLabel, language, thumbnailIcon, metadata, description, content, url, unitId, skillId, publicationStatus: "DRAFT" })
      });
      const data = (await response.json()) as { slug?: string; error?: string };
      if (!response.ok || !data.slug) throw new Error(data.error ?? "Unable to save Resource.");
      router.push("/admin/resources");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save Resource.");
    } finally {
      setSubmitting(false);
    }
  }

  function chooseUnit(nextUnitId: string) {
    setUnitId(nextUnitId);
    setSkillId("");
    const unit = units.find((candidate) => candidate.id === nextUnitId);
    if (unit) setLevelLabel(unit.levelLabel);
  }

  return (
    <form className="admin-form" onSubmit={submitResource}>
      <fieldset disabled={!editable || submitting}>
        <div className="form-grid">
          <label><span>Title</span><input required value={title} onChange={(event) => { setTitle(event.target.value); if (!slug) setSlug(slugify(event.target.value)); }} placeholder="Family grammar practice" /></label>
          <label><span>Slug</span><input required value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="family-grammar-practice" /></label>
          <label><span>Resource Type</span><select value={type} onChange={(event) => setType(event.target.value)}>{resourceTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Publication Status</span><input value={initialValues?.publicationStatus ?? "DRAFT"} readOnly /></label>
          <label><span>Level</span><select value={levelLabel} onChange={(event) => { setLevelLabel(event.target.value); setUnitId(""); setSkillId(""); }}>{levels.map((level) => <option key={level}>{level}</option>)}</select></label>
          <label><span>Language coverage</span><input value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="fa" /><small>Current records are single-locale until Resource Revisions add trilingual fields.</small></label>
          <label><span>Thumbnail Icon</span><select value={thumbnailIcon} onChange={(event) => setThumbnailIcon(event.target.value)}>{resourceIcons.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label><span>Related Unit</span><select value={unitId} onChange={(event) => chooseUnit(event.target.value)}><option value="">Level-wide</option>{units.filter((unit) => unit.levelLabel === levelLabel).map((unit) => <option key={unit.id} value={unit.id}>{unit.title}</option>)}</select></label>
          <label className="form-grid-wide"><span>Related Skill</span><select value={skillId} disabled={!editable || !selectedUnit} onChange={(event) => setSkillId(event.target.value)}><option value="">No Skill (Unit Resource)</option>{selectedUnit?.skills.map((skill) => <option key={skill.id} value={skill.id}>{skill.title}</option>)}</select></label>
          <label className="form-grid-wide"><span>{needsDestination ? "HTTPS destination (required before publication)" : "HTTPS destination (optional)"}</span><input type="url" pattern="https://.*" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…" /></label>
          <label className="form-grid-wide"><span>Metadata, one key: value per line</span><textarea rows={4} value={metadata} onChange={(event) => setMetadata(event.target.value)} /></label>
          <label className="form-grid-wide"><span>Description</span><textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Drafts may remain incomplete." /></label>
          <label className="form-grid-wide"><span>Content</span><textarea rows={8} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Drafts may remain incomplete." /></label>
        </div>
      </fieldset>
      {error ? <div className="feedback wrong" role="alert">{error}</div> : null}
      <div className="route-actions">
        {editable ? <button className="primary-button" type="submit" disabled={submitting}><Save size={18} />{submitting ? "Saving…" : mode === "edit" ? "Save Draft" : "Create Draft"}</button> : null}
        <button className="secondary-button" type="button" onClick={() => router.push("/admin/resources")}>Resource Studio <ArrowRight size={18} /></button>
      </div>
    </form>
  );
}
