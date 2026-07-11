import Link from "next/link";
import { Menu, Monitor, Moon, Sun } from "lucide-react";
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
import { ThemeSync } from "@/components/theme-sync";

const navItems = [
  { href: "/learn", key: "learn" },
  { href: "/practice", key: "practice" },
  { href: "/resources", key: "resources" },
  { href: "/flashcards", key: "flashcards" },
  { href: "/pricing", key: "pricing" },
  { href: "/profile", key: "profile" },
  { href: "/admin", key: "admin" }
] as const;

const learnerNavItems = navItems.filter((item) => item.key !== "admin");
const languageOptions: Array<{
  code: InterfaceLanguageCode;
  label: string;
}> = [
  { code: "fa", label: "FA" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" }
];

const themeLabels = {
  fa: {
    SYSTEM: "سیستم",
    LIGHT: "روشن",
    DARK: "تیره"
  },
  en: {
    SYSTEM: "system",
    LIGHT: "light",
    DARK: "dark"
  },
  de: {
    SYSTEM: "System",
    LIGHT: "hell",
    DARK: "dunkel"
  }
} satisfies Record<InterfaceLanguageCode, Record<InterfaceThemeCode, string>>;

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
  const nextTheme = nextInterfaceTheme(activeTheme);
  const ThemeIcon =
    activeTheme === "DARK" ? Moon : activeTheme === "LIGHT" ? Sun : Monitor;
  const themeLabel = themeLabels[activeLanguage][activeTheme];

  return (
    <>
      <ThemeSync theme={activeTheme} />
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
            <Link
              className={currentPath.startsWith(item.href) ? "active" : undefined}
              key={item.href}
              href={withInterfaceLanguage(item.href, activeLanguage)}
            >
              {copy.nav[item.key]}
            </Link>
          ))}
        </nav>

        <div className="topbar-actions">
          <div className="language-switcher" aria-label={copy.header.languageLabel}>
            {languageOptions.map((option) => (
              <Link
                className={option.code === activeLanguage ? "active" : undefined}
                href={interfaceLanguagePreferenceHref({
                  language: option.code,
                  returnTo: currentPath
                })}
                key={option.code}
                aria-current={option.code === activeLanguage ? "true" : undefined}
              >
                {option.label}
              </Link>
            ))}
          </div>
          <Link
            className="icon-button theme-toggle"
            href={interfaceThemePreferenceHref({
              theme: nextTheme,
              returnTo: currentPath
            })}
            aria-label={themeLabel}
            title={themeLabel}
          >
            <ThemeIcon size={18} />
            <span>{themeLabel}</span>
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
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {learnerNavItems.map((item) => (
          <Link
            className={currentPath.startsWith(item.href) ? "active" : undefined}
            key={item.href}
            href={withInterfaceLanguage(item.href, activeLanguage)}
          >
            {copy.nav[item.key]}
          </Link>
        ))}
        <Link className="mobile-admin-link" href={withInterfaceLanguage("/admin", activeLanguage)}>
          <Menu size={16} />
          {copy.nav.admin}
        </Link>
      </nav>
    </>
  );
}
