import Link from "next/link";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  interfaceLanguagePreferenceHref,
  interfaceCopy,
  type InterfaceLanguageCode,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import {
  interfaceThemePreferenceHref,
  nextInterfaceTheme,
  type InterfaceThemeCode
} from "@/lib/i18n/interface-theme";
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
  theme,
  currentPath = "/"
}: {
  language?: InterfaceLanguageCode;
  theme?: InterfaceThemeCode;
  currentPath?: string;
}) {
  const preferences = language && theme ? null : await getLearnerPreferences();
  const activeLanguage = language ?? preferences?.interfaceLanguage ?? "fa";
  const activeTheme = theme ?? preferences?.interfaceTheme ?? "SYSTEM";
  const copy = interfaceCopy[activeLanguage];
  const alternateLanguage: InterfaceLanguageCode =
    activeLanguage === "fa" ? "en" : "fa";
  const nextTheme = nextInterfaceTheme(activeTheme);
  const ThemeIcon =
    activeTheme === "DARK" ? Moon : activeTheme === "LIGHT" ? Sun : Monitor;

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
        <Link
          className="icon-button theme-toggle"
          href={interfaceThemePreferenceHref({
            theme: nextTheme,
            returnTo: currentPath
          })}
          aria-label={`Interface theme: ${activeTheme.toLowerCase()}`}
          title={`Theme: ${activeTheme.toLowerCase()}`}
        >
          <ThemeIcon size={18} />
          <span>{activeTheme.toLowerCase()}</span>
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
