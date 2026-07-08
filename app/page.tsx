import Link from "next/link";
import { ArrowRight, BookOpen, ChartNoAxesCombined, Crown, Sparkles } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  interfaceCopy,
  resolveInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { getA1ContentSummary, sampleCourse } from "@/lib/learning/sample-content";

const foundationIcons = [BookOpen, Sparkles, ChartNoAxesCombined, Crown];

export default async function Home({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const language = resolveInterfaceLanguage(ui);
  const copy = interfaceCopy[language];
  const summary = getA1ContentSummary();
  const firstSkill = sampleCourse.levels[0]?.units[0]?.skills[0];

  return (
    <main className="site-shell learner-rtl" dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/" />

      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            {copy.home.eyebrow}
          </div>
          <h1>{copy.home.title}</h1>
          <p>{copy.home.body}</p>
          <div className="hero-actions">
            {firstSkill ? (
              <Link
                className="primary-button"
                href={withInterfaceLanguage(`/learn/${firstSkill.slug}`, language)}
              >
                {copy.home.startA1}
                <ArrowRight size={18} />
              </Link>
            ) : null}
            <Link className="secondary-button" href={withInterfaceLanguage("/learn", language)}>
              {copy.home.viewPath}
            </Link>
          </div>
        </div>

        <section className="app-panel" aria-label="Nyra foundation">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">{copy.home.panelKicker}</p>
              <h2>
                A1 · {summary.questionCount} {copy.home.questionCount}
              </h2>
            </div>
            <span className="status-pill">
              {summary.regularSkillCount} {copy.home.skillCount}
            </span>
          </div>
          <div className="foundation-grid">
            {copy.home.cards.map((card, index) => {
              const Icon = foundationIcons[index] ?? BookOpen;

              return (
              <article className="feature-card" key={card.title}>
                  <Icon size={22} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
