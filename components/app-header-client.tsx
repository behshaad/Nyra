"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  CreditCard,
  Globe2,
  Library,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
  X,
  Layers3
} from "lucide-react";
import type { ElementRef, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  interfaceLanguagePreferenceHref,
  type InterfaceLanguageCode,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import {
  interfaceThemePreferenceHref,
  type InterfaceThemeCode
} from "@/lib/i18n/interface-theme";

const navItems = [
  { href: "/learn", key: "learn", icon: BookOpenCheck },
  { href: "/flashcards", key: "flashcards", icon: Layers3 },
  { href: "/resources", key: "resources", icon: Library }
] as const;

const languageOptions: Array<{
  code: InterfaceLanguageCode;
  label: string;
}> = [
  { code: "fa", label: "FA" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" }
];

const labels = {
  fa: {
    home: "خانه Nyra",
    menu: "باز کردن منو",
    closeMenu: "بستن منو",
    profile: "باز کردن منوی پروفایل",
    languageMenu: "تغییر زبان رابط",
    pricing: "قیمت‌گذاری",
    account: "حساب",
    settings: "تنظیمات",
    logout: "خروج",
    logoutUnavailable: "خروج بعد از فعال شدن Auth آماده می‌شود.",
    light: "حالت روشن",
    dark: "حالت تیره"
  },
  en: {
    home: "Nyra home",
    menu: "Open menu",
    closeMenu: "Close menu",
    profile: "Open profile menu",
    languageMenu: "Change interface language",
    pricing: "Pricing",
    account: "Account",
    settings: "Settings",
    logout: "Logout",
    logoutUnavailable: "Logout will be available after Auth is connected.",
    light: "Light mode",
    dark: "Dark mode"
  },
  de: {
    home: "Nyra Startseite",
    menu: "Menue oeffnen",
    closeMenu: "Menue schliessen",
    profile: "Profilmenue oeffnen",
    languageMenu: "Oberflaechensprache aendern",
    pricing: "Preise",
    account: "Konto",
    settings: "Einstellungen",
    logout: "Abmelden",
    logoutUnavailable: "Abmelden ist verfuegbar, sobald Auth verbunden ist.",
    light: "Heller Modus",
    dark: "Dunkler Modus"
  }
} satisfies Record<InterfaceLanguageCode, Record<string, string>>;

function nextNavbarTheme(theme: InterfaceThemeCode): Exclude<InterfaceThemeCode, "SYSTEM"> {
  return theme === "DARK" ? "LIGHT" : "DARK";
}

function isActive(currentPath: string, href: string) {
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

export function AppHeaderClient({
  labels: headerLabels,
  currentPath,
  language,
  theme
}: {
  labels: {
    nav: {
      resources: string;
      flashcards: string;
    };
    continueLearning: string;
    languageLabel: string;
  };
  currentPath: string;
  language: InterfaceLanguageCode;
  theme: InterfaceThemeCode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [systemTheme, setSystemTheme] = useState<"LIGHT" | "DARK">("LIGHT");
  const headerRef = useRef<ElementRef<"header">>(null);
  const activeTheme = theme === "SYSTEM" ? systemTheme : theme;
  const ThemeIcon = activeTheme === "DARK" ? Moon : Sun;
  const nextTheme = nextNavbarTheme(activeTheme);
  const localLabels = labels[language];
  const themeLabel = activeTheme === "DARK" ? localLabels.dark : localLabels.light;

  useEffect(() => {
    const media = globalThis.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme() {
      setSystemTheme(media.matches ? "DARK" : "LIGHT");
    }

    syncTheme();
    media.addEventListener("change", syncTheme);

    return () => media.removeEventListener("change", syncTheme);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsLanguageOpen(false);
  }, [currentPath]);

  useEffect(() => {
    function closeOnEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
        setIsLanguageOpen(false);
      }
    }

    function closeOnOutsideClick(event: globalThis.PointerEvent) {
      if (
        headerRef.current &&
        event.target instanceof globalThis.Node &&
        !headerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
        setIsLanguageOpen(false);
      }
    }

    globalThis.document.addEventListener("keydown", closeOnEscape);
    globalThis.document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      globalThis.document.removeEventListener("keydown", closeOnEscape);
      globalThis.document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, []);

  const navLinks = navItems.map((item) => {
    const Icon = item.icon;

    return (
      <Link
        className={isActive(currentPath, item.href) ? "active" : undefined}
        href={withInterfaceLanguage(item.href, language)}
        key={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Icon size={17} aria-hidden="true" />
        <span>
          {item.key === "learn"
            ? headerLabels.continueLearning
            : headerLabels.nav[item.key]}
        </span>
      </Link>
    );
  });

  return (
    <header className={`topbar ${language === "fa" ? "persian-nav" : ""}`} ref={headerRef}>
      <div className="topbar-left">
        <Link className="brand" href={withInterfaceLanguage("/", language)} aria-label={localLabels.home}>
          <span className="brand-mark" aria-hidden="true">N</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks}
        </nav>
      </div>

      <div className="topbar-actions">
        <div className="desktop-controls">
          <LanguageSwitcher
            currentPath={currentPath}
            id="desktop-language-menu"
            isOpen={isLanguageOpen}
            language={language}
            menuLabel={localLabels.languageMenu}
            label={headerLabels.languageLabel}
            onOpenChange={setIsLanguageOpen}
          />
          <ThemeToggle
            currentPath={currentPath}
            icon={<ThemeIcon size={18} aria-hidden="true" />}
            label={themeLabel}
            nextTheme={nextTheme}
          />
        </div>

        <button
          className="icon-button hamburger-button"
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? localLabels.closeMenu : localLabels.menu}
          aria-controls="mobile-navigation-menu"
          onClick={() => {
            setIsMobileMenuOpen((open) => !open);
            setIsProfileOpen(false);
            setIsLanguageOpen(false);
          }}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="profile-menu-wrap">
          <button
            className="profile-avatar-button"
            type="button"
            aria-expanded={isProfileOpen}
            aria-label={localLabels.profile}
            aria-controls="profile-menu"
            onClick={() => {
              setIsProfileOpen((open) => !open);
              setIsMobileMenuOpen(false);
              setIsLanguageOpen(false);
            }}
          >
            <span className="profile-avatar" aria-hidden="true">
              <UserRound size={20} />
            </span>
          </button>

          <AnimatePresence>
            {isProfileOpen ? (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="profile-dropdown"
                exit={{ opacity: 0, scale: 0.98, y: -6 }}
                id="profile-menu"
                initial={{ opacity: 0, scale: 0.98, y: -6 }}
                role="menu"
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <ProfileMenuLink
                  href="/pricing"
                  icon={<CreditCard size={17} />}
                  label={localLabels.pricing}
                  language={language}
                  onClick={() => setIsProfileOpen(false)}
                />
                <ProfileMenuLink
                  href="/profile"
                  icon={<UserRound size={17} />}
                  label={localLabels.account}
                  language={language}
                  onClick={() => setIsProfileOpen(false)}
                />
                <ProfileMenuLink
                  href="/profile#settings"
                  icon={<Settings size={17} />}
                  label={localLabels.settings}
                  language={language}
                  onClick={() => setIsProfileOpen(false)}
                />
                <button
                  className="profile-menu-item disabled"
                  disabled
                  title={localLabels.logoutUnavailable}
                  type="button"
                >
                  <LogOut size={17} />
                  <span>{localLabels.logout}</span>
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen ? (
          <motion.nav
            animate={{ opacity: 1, y: 0 }}
            className="mobile-menu"
            exit={{ opacity: 0, y: -10 }}
            id="mobile-navigation-menu"
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            aria-label="Mobile navigation"
          >
            <div className="mobile-menu-links">{navLinks}</div>
            <div className="mobile-menu-controls">
              <LanguageSwitcher
                currentPath={currentPath}
                id="mobile-language-menu"
                isOpen={isLanguageOpen}
                language={language}
                menuLabel={localLabels.languageMenu}
                label={headerLabels.languageLabel}
                onOpenChange={setIsLanguageOpen}
              />
              <ThemeToggle
                currentPath={currentPath}
                icon={<ThemeIcon size={18} aria-hidden="true" />}
                label={themeLabel}
                nextTheme={nextTheme}
              />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function LanguageSwitcher({
  currentPath,
  id,
  isOpen,
  label,
  language,
  menuLabel,
  onOpenChange
}: {
  currentPath: string;
  id: string;
  isOpen: boolean;
  label: string;
  language: InterfaceLanguageCode;
  menuLabel: string;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return (
    <div className="language-menu-wrap">
      <button
        className="icon-button language-globe-button"
        type="button"
        aria-expanded={isOpen}
        aria-label={menuLabel}
        aria-controls={id}
        title={menuLabel}
        onClick={() => onOpenChange(!isOpen)}
      >
        <Globe2 size={18} aria-hidden="true" />
        <span>{language.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="language-dropdown"
            exit={{ opacity: 0, scale: 0.98, y: -6 }}
            id={id}
            initial={{ opacity: 0, scale: 0.98, y: -6 }}
            role="menu"
            aria-label={label}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {languageOptions.map((option) => (
              <Link
                className={option.code === language ? "active" : undefined}
                href={interfaceLanguagePreferenceHref({
                  language: option.code,
                  returnTo: currentPath
                })}
                key={option.code}
                role="menuitem"
                aria-current={option.code === language ? "true" : undefined}
                onClick={() => onOpenChange(false)}
              >
                <span>{option.label}</span>
              </Link>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ThemeToggle({
  currentPath,
  icon,
  label,
  nextTheme
}: {
  currentPath: string;
  icon: ReactNode;
  label: string;
  nextTheme: "LIGHT" | "DARK";
}) {
  return (
    <Link
      className="icon-button theme-toggle"
      href={interfaceThemePreferenceHref({
        theme: nextTheme,
        returnTo: currentPath
      })}
      aria-label={label}
      title={label}
    >
      <motion.span
        animate={{ rotate: 0, scale: 1 }}
        initial={{ rotate: -20, scale: 0.88 }}
        key={label}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {icon}
      </motion.span>
    </Link>
  );
}

function ProfileMenuLink({
  href,
  icon,
  label,
  language,
  onClick
}: {
  href: string;
  icon: ReactNode;
  label: string;
  language: InterfaceLanguageCode;
  onClick: () => void;
}) {
  return (
    <Link
      className="profile-menu-item"
      href={withInterfaceLanguage(href, language)}
      role="menuitem"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
