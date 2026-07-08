import Link from "next/link";
import {
  interfaceLanguagePreferenceHref,
  interfaceCopy,
  type InterfaceLanguageCode,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";

const navItems = [
  { href: "/learn", key: "learn" },
  { href: "/resources", key: "resources" },
  { href: "/flashcards", key: "flashcards" },
  { href: "/pricing", key: "pricing" },
  { href: "/profile", key: "profile" },
  { href: "/admin", key: "admin" }
] as const;

export async function AppHeader({
  language,
  currentPath = "/"
}: {
  language?: InterfaceLanguageCode;
  currentPath?: string;
}) {
  const preferences = language ? null : await getLearnerPreferences();
  const activeLanguage = language ?? preferences?.interfaceLanguage ?? "fa";
  const copy = interfaceCopy[activeLanguage];
  const alternateLanguage: InterfaceLanguageCode =
    activeLanguage === "fa" ? "en" : "fa";

  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="Nyra home">
        <span className="brand-mark">N</span>
        <span>
          <strong>Nyra</strong>
          <small>{copy.brandSubtitle}</small>
        </span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={withInterfaceLanguage(item.href, activeLanguage)}>
            {copy.nav[item.key]}
          </Link>
        ))}
      </nav>

      <div className="topbar-actions">
        <Link
          className="language-toggle"
          href={interfaceLanguagePreferenceHref({
            language: alternateLanguage,
            returnTo: currentPath
          })}
          aria-label={copy.header.languageLabel}
        >
          {activeLanguage === "fa" ? "English" : "فارسی"}
        </Link>
        <Link className="ghost-button" href={withInterfaceLanguage("/admin", activeLanguage)}>
          {copy.header.adminPreview}
        </Link>
        <Link
          className="primary-button compact"
          href={withInterfaceLanguage("/learn", activeLanguage)}
        >
          {copy.header.startLearning}
        </Link>
      </div>
    </header>
  );
}
