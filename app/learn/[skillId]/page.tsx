import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { BackendSkillSession } from "@/components/backend-skill-session";
import { getPublishedSkill, getPublishedSkills } from "@/lib/learning/sample-content";
import { getFlatA1Skills, getNextSkillSlug } from "@/lib/learning/path-progress";

export function generateStaticParams() {
  return getPublishedSkills().map((skill) => ({
    skillId: skill.slug
  }));
}

export default async function SkillPage({
  params
}: {
  params: Promise<{
    skillId: string;
  }>;
}) {
  const { skillId } = await params;
  const skill = getPublishedSkill(skillId);
  const flatSkill = getFlatA1Skills().find((candidate) => candidate.slug === skillId);

  if (!skill || !flatSkill) {
    notFound();
  }

  const pageLabel =
    skill.kind === "FINAL_TEST"
      ? "Final A1 Test"
      : skill.kind === "UNIT_CHECKPOINT"
        ? "A1 Unit Checkpoint"
        : "A1 Skill";

  return (
    <main className="site-shell learner-rtl" dir="rtl">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero compact">
          <span className="section-label">{pageLabel}</span>
          <h1>{skill.title}</h1>
          <p>{skill.description}</p>
          <Link className="ghost-button" href={`/learn?unit=${flatSkill.unitSlug}`}>
            برگشت به واحد
          </Link>
        </div>

        <BackendSkillSession
          skillSlug={skill.slug}
          nextSkillSlug={getNextSkillSlug(skill.slug)}
          unitSlug={flatSkill.unitSlug}
        />
      </section>
    </main>
  );
}
