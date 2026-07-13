import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { getLearningPathDisplayCopy } from "@/lib/learning/sample-content";

type DisplayUnit = {
  slug: string;
  title: string;
} | null;

type DisplaySkill = {
  slug: string;
  title: string;
} | null;

type DisplayResource = {
  slug: string;
  title: string;
  description: string;
  content: string;
  levelLabel: string;
  language: string;
  metadata: unknown;
  unit?: DisplayUnit;
  skill?: DisplaySkill;
};

const persianTextPattern = /[\u0600-\u06FF]/;

function humanizeSlug(value: string) {
  return value
    .replace(/^(a\d|b\d|c\d)-/, "")
    .replace(/-persian-guide$/, "")
    .replace(/-guide$/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function nonPersianOrFallback(value: string, fallback: string) {
  return persianTextPattern.test(value) ? fallback : value;
}

function resourceTitle(resource: DisplayResource, language: InterfaceLanguageCode) {
  if (!persianTextPattern.test(resource.title)) {
    return resource.title;
  }

  const unitTitle = resource.unit?.slug
    ? getLearningPathDisplayCopy(resource.levelLabel, language).units[resource.unit.slug]?.title
    : undefined;

  if (language === "de") {
    return unitTitle
      ? `${resource.levelLabel}: ${unitTitle}`
      : `${resource.levelLabel}: ${humanizeSlug(resource.slug)}`;
  }

  return unitTitle
    ? `${resource.levelLabel}: ${unitTitle}`
    : `${resource.levelLabel}: ${humanizeSlug(resource.slug)}`;
}

function resourceDescription(resource: DisplayResource, title: string, language: InterfaceLanguageCode) {
  if (!persianTextPattern.test(resource.description)) {
    return resource.description;
  }

  if (language === "de") {
    return `Lernmaterial fuer ${title}.`;
  }

  return `Learning resource for ${title}.`;
}

function resourceContent(resource: DisplayResource, title: string, language: InterfaceLanguageCode) {
  if (!persianTextPattern.test(resource.content)) {
    return resource.content;
  }

  if (language === "de") {
    return `Dieses Material unterstuetzt ${title}. Die deutschen Beispiele bleiben sichtbar; die persische Erklaerung wird in diesem Sprachmodus ausgeblendet.`;
  }

  return `This resource supports ${title}. German examples remain visible; Persian explanations are hidden in this interface mode.`;
}

function localizedUnit(unit: DisplayUnit, levelLabel: string, language: InterfaceLanguageCode) {
  if (!unit) {
    return unit;
  }

  const displayUnit = getLearningPathDisplayCopy(levelLabel, language).units[unit.slug];

  return {
    ...unit,
    title: displayUnit?.title ?? nonPersianOrFallback(unit.title, humanizeSlug(unit.slug))
  };
}

function localizedSkill(skill: DisplaySkill, unit: DisplayUnit, levelLabel: string, language: InterfaceLanguageCode) {
  if (!skill) {
    return skill;
  }

  const displayUnit = unit?.slug
    ? getLearningPathDisplayCopy(levelLabel, language).units[unit.slug]
    : undefined;
  const displaySkill = displayUnit?.skills[skill.slug];

  return {
    ...skill,
    title: displaySkill?.title ?? nonPersianOrFallback(skill.title, humanizeSlug(skill.slug))
  };
}

function localizedMetadata(metadata: unknown, language: InterfaceLanguageCode) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return metadata;
  }

  return Object.fromEntries(
    Object.entries(metadata as Record<string, unknown>).map(([key, value]) => [
      key,
      typeof value === "string" && persianTextPattern.test(value)
        ? language === "de"
          ? "In diesem Sprachmodus ausgeblendet"
          : "Hidden in this interface mode"
        : value
    ])
  );
}

export function localizeResourceForInterface<TResource extends DisplayResource>(
  resource: TResource,
  language: InterfaceLanguageCode
): TResource {
  if (language === "fa") {
    return resource;
  }

  const title = resourceTitle(resource, language);
  const unit = localizedUnit(resource.unit ?? null, resource.levelLabel, language);

  return {
    ...resource,
    title,
    description: resourceDescription(resource, title, language),
    content: resourceContent(resource, title, language),
    metadata: localizedMetadata(resource.metadata, language),
    unit,
    skill: localizedSkill(resource.skill ?? null, unit, resource.levelLabel, language)
  };
}

