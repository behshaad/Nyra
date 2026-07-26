import Image from "next/image";
import { Download, FileText } from "lucide-react";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { getAdaptiveLearningResearch } from "@/lib/research/adaptive-learning";
import { researchCopy } from "@/lib/research/copy";
import { ResearchLink, ResearchPageHeader, ResearchTable } from "../_components/research-ui";

export const dynamic = "force-dynamic";

const selectedTables = [
  "classification_results",
  "regression_results",
  "clustering_results",
  "statistical_tests",
  "archetype_distribution",
  "feature_importance",
  "weakness_distribution",
  "rule_based_adaptive_decisions"
];

export default async function ResearchResultsPage() {
  const [preferences, research] = await Promise.all([
    getLearnerPreferences(),
    getAdaptiveLearningResearch()
  ]);
  const language = preferences.interfaceLanguage;
  const t = researchCopy[language];

  return (
    <main className="research-page" dir={language === "fa" ? "rtl" : "ltr"}>
      <ResearchPageHeader
        eyebrow={t.latestRun}
        title={t.results}
        body={t.resultsBody}
        actions={<><ResearchLink href="/admin/research" secondary>{t.artifacts}</ResearchLink><a className="primary-link compact-link" href="/api/admin/research/report"><Download size={16} />{t.report}</a></>}
      />

      <section className="research-figure-grid">
        {research.figures.map((fileName) => (
          <figure className="research-panel" key={fileName}>
            <a href={`/api/admin/research/artifacts/figures/${fileName}`}>
              <Image
                alt={`${fileName.replace(".png", "").replaceAll("_", " ")} — ${t.results}`}
                height={800}
                src={`/api/admin/research/artifacts/figures/${fileName}`}
                unoptimized
                width={1200}
              />
            </a>
            <figcaption>{fileName.replace(".png", "").replaceAll("_", " ")}</figcaption>
          </figure>
        ))}
      </section>

      <div className="research-section-heading"><div><span className="section-label">{t.modelResults}</span><h2>{t.modelResults}</h2></div></div>
      <section className="research-table-grid">
        {selectedTables.map((tableName) => (
          <ResearchTable
            key={tableName}
            locale={language}
            rows={research.tables[tableName] ?? []}
            title={tableName.replaceAll("_", " ")}
          />
        ))}
      </section>

      <section className="research-report-preview research-panel">
        <h2><FileText aria-hidden="true" />{t.report}</h2>
        <pre>{research.reportMarkdown}</pre>
      </section>
    </main>
  );
}
