import { Brain, ChartNoAxesCombined, FlaskConical, ShieldAlert } from "lucide-react";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { researchCopy } from "@/lib/research/copy";
import { ResearchLink, ResearchPageHeader } from "../_components/research-ui";

export default async function ResearchGuidancePage() {
  const preferences = await getLearnerPreferences();
  const language = preferences.interfaceLanguage;
  const t = researchCopy[language];
  const sections = [
    { icon: FlaskConical, title: t.purpose, body: t.purposeBody },
    { icon: ChartNoAxesCombined, title: t.pipeline, body: t.pipelineBody },
    { icon: Brain, title: t.interpretation, body: t.interpretationBody },
    { icon: ShieldAlert, title: t.validity, body: t.validityBody }
  ];

  return (
    <main className="research-page" dir={language === "fa" ? "rtl" : "ltr"}>
      <ResearchPageHeader
        eyebrow={t.guidance}
        title={t.guidanceTitle}
        body={t.guidanceBody}
        actions={<ResearchLink href="/admin/research/adaptive-learning">{t.results}</ResearchLink>}
      />
      <aside className="research-notice" role="note">{t.syntheticNotice}</aside>
      <section className="research-guidance-grid">
        {sections.map(({ icon: Icon, title, body }) => (
          <article className="research-panel" key={title}>
            <Icon aria-hidden="true" />
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </section>
      <section className="research-panel research-model-guide">
        <span className="section-label">{t.models}</span>
        <h2>{t.models}</h2>
        <dl>
          <div><dt>{t.classification}</dt><dd>Random Forest · Logistic Regression · SVM · CatBoost · XGBoost · LightGBM</dd></div>
          <div><dt>{t.regression}</dt><dd>Linear Regression · Random Forest · Gradient Boosting</dd></div>
          <div><dt>{t.clustering}</dt><dd>K-Means · Hierarchical Clustering · DBSCAN</dd></div>
        </dl>
      </section>
    </main>
  );
}
