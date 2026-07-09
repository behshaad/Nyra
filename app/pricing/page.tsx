import { Check } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { pricingCopy, text } from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";

const featureCopy = {
  fa: ["اول A1 کامل و تمیز", "مسیر بلندمدت A1 تا B2", "فلش‌کارت و تحلیل بعد از حلقه اصلی"],
  en: ["A1 polished first", "A1-B2 long-term path", "Flashcards and analytics after core loop"],
  de: ["A1 zuerst polieren", "Langfristiger Pfad A1-B2", "Karten und Analysen nach dem Kernkreislauf"]
};

export default async function PricingPage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/pricing" />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">{text(pricingCopy.label, language)}</span>
          <h1>{text(pricingCopy.title, language)}</h1>
          <p>{text(pricingCopy.body, language)}</p>
        </div>

        <section className="premium-section standalone">
          <div>
            <span className="section-label">{text(pricingCopy.freeNow, language)}</span>
            <h2>{text(pricingCopy.trustTitle, language)}</h2>
            <p>{text(pricingCopy.trustBody, language)}</p>
          </div>
          <div className="pricing-card">
            <span className="status-pill bright">{text(pricingCopy.premium, language)}</span>
            <h3>Nyra Premium</h3>
            <p>{text(pricingCopy.trustBody, language)}</p>
            <ul>
              {featureCopy[language].map((feature) => (
                <li key={feature}>
                  <Check size={18} /> {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </main>
  );
}
