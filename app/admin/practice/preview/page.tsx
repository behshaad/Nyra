import Link from "next/link";
import { ArrowLeft, Eye, LockKeyhole } from "lucide-react";
import { LearningJourney } from "@/components/practice/learning-journey";
import { resolveInterfaceLanguage, type InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { getPracticeJourney } from "@/lib/practice/journey";

export const dynamic = "force-dynamic";

const languageLabels: Record<InterfaceLanguageCode, string> = {
  fa: "فارسی",
  en: "English",
  de: "Deutsch"
};

export default async function AdminPracticePreviewPage({
  searchParams
}: {
  searchParams: Promise<{ course?: string; ui?: string }>;
}) {
  const { course, ui } = await searchParams;
  const language = resolveInterfaceLanguage(ui);
  const journey = await getPracticeJourney({
    courseSlug: course,
    interfaceLanguage: language,
    progressMode: "clean"
  });
  const courseSlug = journey.course?.slug ?? course;

  return (
    <div className="practice-admin-preview-page">
      <header className="practice-admin-preview-toolbar">
        <div>
          <Link
            className="ghost-button compact-link"
            href={courseSlug ? `/admin/practice?course=${encodeURIComponent(courseSlug)}` : "/admin/practice"}
          >
            <ArrowLeft aria-hidden="true" size={15} />
            Back / بازگشت
          </Link>
          <div>
            <Eye aria-hidden="true" size={17} />
            <strong>Learner Preview</strong>
            <span>Clean no-progress state · حالت بدون پیشرفت</span>
          </div>
        </div>
        <nav aria-label="Preview interface language">
          {(Object.keys(languageLabels) as InterfaceLanguageCode[]).map((option) => (
            <Link
              aria-current={option === language ? "page" : undefined}
              className={option === language ? "active" : undefined}
              href={`/admin/practice/preview?${new globalThis.URLSearchParams({
                ...(courseSlug ? { course: courseSlug } : {}),
                ui: option
              }).toString()}`}
              key={option}
            >
              {languageLabels[option]}
            </Link>
          ))}
        </nav>
        <div className="practice-admin-preview-safety">
          <LockKeyhole aria-hidden="true" size={14} />
          <span>Isolated preview · navigation disabled</span>
        </div>
      </header>
      <main className={`practice-shell practice-admin-preview-canvas ${language === "fa" ? "learner-rtl" : ""}`} dir="ltr">
        <LearningJourney initialJourney={journey} language={language} mode="preview" />
      </main>
    </div>
  );
}
