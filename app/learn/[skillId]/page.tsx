import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { BackendSkillSession } from "@/components/backend-skill-session";
import {
  interfaceCopy,
  resolveInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { getPublishedSkill, getPublishedSkills } from "@/lib/learning/sample-content";
import { getFlatA1Skills, getNextSkillSlug } from "@/lib/learning/path-progress";

export function generateStaticParams() {
  return getPublishedSkills().map((skill) => ({
    skillId: skill.slug
  }));
}

export default async function SkillPage({
  params,
  searchParams
}: {
  params: Promise<{
    skillId: string;
  }>;
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { skillId } = await params;
  const { ui } = await searchParams;
  const language = resolveInterfaceLanguage(ui);
  const copy = interfaceCopy[language];
  const skill = getPublishedSkill(skillId);
  const flatSkill = getFlatA1Skills().find((candidate) => candidate.slug === skillId);

  if (!skill || !flatSkill) {
    notFound();
  }

  const pageLabel =
    skill.kind === "FINAL_TEST"
      ? copy.skillPage.labels.finalTest
      : skill.kind === "UNIT_CHECKPOINT"
        ? copy.skillPage.labels.checkpoint
        : copy.skillPage.labels.regular;

  return (
    <main className="site-shell learner-rtl" dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath={`/learn/${skillId}`} />

      <section className="route-page">
        <div className="route-hero compact">
          <span className="section-label">{pageLabel}</span>
          <h1>{skill.title}</h1>
          <p>{skill.description}</p>
          <Link
            className="ghost-button"
            href={withInterfaceLanguage(`/learn?unit=${flatSkill.unitSlug}`, language)}
          >
            {copy.skillPage.backToUnit}
          </Link>
        </div>

        <BackendSkillSession
          skillSlug={skill.slug}
          nextSkillSlug={getNextSkillSlug(skill.slug)}
          unitSlug={flatSkill.unitSlug}
          language={language}
        />
      </section>
    </main>
  );
}
