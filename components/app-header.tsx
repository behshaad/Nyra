import Link from "next/link";
import {
  interfaceCopy,
  type InterfaceLanguageCode,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";

const navItems = [
  { href: "/learn", key: "learn" },
  { href: "/resources", key: "resources" },
  { href: "/flashcards", key: "flashcards" },
  { href: "/pricing", key: "pricing" },
  { href: "/profile", key: "profile" },
  { href: "/admin", key: "admin" }
] as const;

export function AppHeader({
  language = "fa",
  currentPath = "/"
}: {
  language?: InterfaceLanguageCode;
  currentPath?: string;
}) {
  const copy = interfaceCopy[language];
  const alternateLanguage: InterfaceLanguageCode = language === "fa" ? "en" : "fa";

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
          <Link key={item.href} href={withInterfaceLanguage(item.href, language)}>
            {copy.nav[item.key]}
          </Link>
        ))}
      </nav>

      <div className="topbar-actions">
        <Link
          className="language-toggle"
          href={withInterfaceLanguage(currentPath, alternateLanguage)}
          aria-label={copy.header.languageLabel}
        >
          {language === "fa" ? "English" : "فارسی"}
        </Link>
        <Link className="ghost-button" href={withInterfaceLanguage("/admin", language)}>
          {copy.header.adminPreview}
        </Link>
        <Link
          className="primary-button compact"
          href={withInterfaceLanguage("/learn/greet-and-say-your-name", language)}
        >
          {copy.header.startLearning}
        </Link>
      </div>
    </header>
  );
}
