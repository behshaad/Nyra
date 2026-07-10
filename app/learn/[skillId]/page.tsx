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
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getPublishedSkillBySlug } from "@/lib/admin/skill-repository";
import { getFlatPublishedSkills, getNextSkillSlug } from "@/lib/learning/path-progress";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const skills = await getFlatPublishedSkills();

  return skills.map((skill) => ({
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
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];
  const [skill, flatSkills] = await Promise.all([
    getPublishedSkillBySlug(skillId),
    getFlatPublishedSkills()
  ]);
  const flatSkill = flatSkills.find((candidate) => candidate.slug === skillId);
  const nextSkillSlug = flatSkill
    ? await getNextSkillSlug(skillId, flatSkill.levelLabel)
    : null;
  const nextSkill = nextSkillSlug
    ? flatSkills.find((candidate) => candidate.slug === nextSkillSlug) ?? null
    : null;

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
    <main
      className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`}
      dir={copy.dir}
    >
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
          nextSkill={nextSkill ? { slug: nextSkill.slug, title: nextSkill.title } : null}
          unitSlug={flatSkill.unitSlug}
          language={language}
        />
      </section>
    </main>
  );
}
