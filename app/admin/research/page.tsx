import Link from "next/link";
import { Brain, Database, FileText, LineChart, Table2 } from "lucide-react";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getAdaptiveLearningResearch } from "@/lib/research/adaptive-learning";
import { researchCopy } from "@/lib/research/copy";
import { ResearchPageHeader } from "./_components/research-ui";

export const dynamic = "force-dynamic";

const dataFiles = ["learners.csv", "learner_features.csv", "interactions.csv"];

export default async function ResearchIndexPage() {
  const [preferences, research] = await Promise.all([
    getLearnerPreferences(),
    getAdaptiveLearningResearch()
  ]);
  const language = preferences.interfaceLanguage;
  const t = researchCopy[language];
  const tableFiles = Object.keys(research.tables).sort();
  const artifactGroups = [
    { label: t.figures, icon: LineChart, group: "figures", files: research.figures },
    { label: t.tables, icon: Table2, group: "tables", files: tableFiles.map((name) => `${name}.csv`) },
    { label: t.datasets, icon: Database, group: "data", files: dataFiles }
  ];

  return (
    <main className="research-page" dir={language === "fa" ? "rtl" : "ltr"}>
      <ResearchPageHeader eyebrow={t.latestRun} title={t.indexTitle} body={t.indexBody} />

      <section className="research-metrics" aria-label={t.latestRun}>
        <article><Brain /><strong>{research.manifest.learners}</strong><span>{t.learners}</span></article>
        <article><Database /><strong>{research.manifest.interactions.toLocaleString(language)}</strong><span>{t.interactions}</span></article>
        <article><LineChart /><strong>{research.figures.length}</strong><span>{t.figures}</span></article>
        <article><Table2 /><strong>{tableFiles.length}</strong><span>{t.tables}</span></article>
        <article><FileText /><strong>{research.manifest.seed}</strong><span>{t.seed}</span></article>
      </section>

      <section className="research-destination-grid">
        <Link href="/admin/research/adaptive-learning">
          <LineChart aria-hidden="true" />
          <strong>{t.results}</strong>
          <span>{t.resultsBody}</span>
          <b>{t.open} →</b>
        </Link>
        <Link href="/admin/research/guidance">
          <Brain aria-hidden="true" />
          <strong>{t.guidance}</strong>
          <span>{t.guidanceBody}</span>
          <b>{t.open} →</b>
        </Link>
        <a href="/api/admin/research/report">
          <FileText aria-hidden="true" />
          <strong>{t.report}</strong>
          <span>Markdown · {research.reportMarkdown.length.toLocaleString(language)} characters</span>
          <b>{t.download} ↓</b>
        </a>
      </section>

      <section className="research-artifacts">
        <div className="research-section-heading"><div><span className="section-label">{t.artifacts}</span><h2>{t.artifacts}</h2></div></div>
        <div className="research-artifact-grid">
          {artifactGroups.map(({ label, icon: Icon, group, files }) => (
            <article className="research-panel" key={group}>
              <h2><Icon aria-hidden="true" />{label}<span>{files.length}</span></h2>
              <ul>
                {files.map((fileName) => (
                  <li key={fileName}>
                    <span>{fileName.replace(/\.[^.]+$/, "").replaceAll("_", " ")}</span>
                    <a href={`/api/admin/research/artifacts/${group}/${encodeURIComponent(fileName)}`}>{t.download}</a>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
