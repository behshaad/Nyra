"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, type ReactNode, useEffect, useRef, useState } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  ChevronDown,
  FileQuestion,
  FileText,
  Image,
  LayoutDashboard,
  Map,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";

type NavItem = {
  href: string;
  icon: typeof LayoutDashboard;
  label: { en: string; fa: string };
};

const navigation: Array<{
  label?: { en: string; fa: string };
  items: NavItem[];
}> = [
  {
    items: [
      { href: "/admin", icon: LayoutDashboard, label: { en: "Overview", fa: "نمای کلی" } },
      { href: "/admin/practice", icon: Map, label: { en: "Practice Journey", fa: "مسیر تمرین" } }
    ]
  },
  {
    label: { en: "Content", fa: "محتوا" },
    items: [
      { href: "/admin/skills", icon: BookOpen, label: { en: "Levels & Skills", fa: "سطح‌ها و مهارت‌ها" } },
      { href: "/admin/questions", icon: FileQuestion, label: { en: "Questions", fa: "سؤال‌ها" } },
      { href: "/admin/flashcards", icon: Sparkles, label: { en: "Flashcards", fa: "فلش‌کارت‌ها" } },
      { href: "/admin/resources", icon: FileText, label: { en: "Resources", fa: "منابع" } },
      { href: "/admin/media", icon: Image, label: { en: "Media", fa: "رسانه" } }
    ]
  },
  {
    label: { en: "Manage", fa: "مدیریت" },
    items: [
      { href: "/admin/users", icon: Users, label: { en: "Users", fa: "کاربران" } },
      { href: "/admin/analytics", icon: BarChart3, label: { en: "Analytics", fa: "تحلیل‌ها" } },
      { href: "/admin/logs", icon: Activity, label: { en: "Operations", fa: "عملیات" } },
      { href: "/admin/settings", icon: Settings, label: { en: "Settings", fa: "تنظیمات" } }
    ]
  }
];

const pathLabels: Record<string, { en: string; fa: string }> = {
  admin: { en: "Admin", fa: "مدیریت" },
  practice: { en: "Practice Journey", fa: "مسیر تمرین" },
  skills: { en: "Skills", fa: "مهارت‌ها" },
  questions: { en: "Questions", fa: "سؤال‌ها" },
  flashcards: { en: "Flashcards", fa: "فلش‌کارت‌ها" },
  resources: { en: "Resources", fa: "منابع" },
  media: { en: "Media", fa: "رسانه" },
  users: { en: "Users", fa: "کاربران" },
  analytics: { en: "Analytics", fa: "تحلیل‌ها" },
  logs: { en: "Operations", fa: "عملیات" },
  settings: { en: "Settings", fa: "تنظیمات" },
  edit: { en: "Edit", fa: "ویرایش" },
  new: { en: "New", fa: "جدید" }
};

function localized(value: { en: string; fa: string }, language: InterfaceLanguageCode) {
  return language === "fa" ? value.fa : value.en;
}

function activePath(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  language
}: {
  children: ReactNode;
  language: InterfaceLanguageCode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const profileRef = useRef<globalThis.HTMLDivElement>(null);
  const isPersian = language === "fa";
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function closeProfile(event: PointerEvent) {
      if (
        profileRef.current &&
        event.target instanceof globalThis.Node &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    globalThis.document.addEventListener("pointerdown", closeProfile);
    return () => globalThis.document.removeEventListener("pointerdown", closeProfile);
  }, []);

  function submitSearch(event: FormEvent<globalThis.HTMLFormElement>) {
    event.preventDefault();
    const cleaned = query.trim();

    if (cleaned) {
      router.push(`/admin/search?q=${encodeURIComponent(cleaned)}`);
    }
  }

  const nav = (
    <nav className="admin-shell-nav" aria-label={isPersian ? "ناوبری مدیریت" : "Admin navigation"}>
      {navigation.map((group, groupIndex) => (
        <section className="admin-nav-group" key={group.label?.en ?? groupIndex}>
          {group.label ? <p>{localized(group.label, language)}</p> : null}
          {group.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                aria-current={activePath(pathname, item.href) ? "page" : undefined}
                className={activePath(pathname, item.href) ? "active" : undefined}
                href={item.href}
                key={item.href}
              >
                <Icon aria-hidden="true" size={17} />
                <span>{localized(item.label, language)}</span>
              </Link>
            );
          })}
        </section>
      ))}
    </nav>
  );

  return (
    <div className={`admin-shell ${isPersian ? "admin-shell-rtl" : ""}`} dir={isPersian ? "rtl" : "ltr"}>
      <aside className="admin-shell-sidebar">
        <Link className="admin-shell-brand" href="/admin" aria-label="Nyra Admin">
          <span>N</span>
          <div>
            <strong>Nyra</strong>
            <small>{isPersian ? "مرکز مدیریت" : "Admin Console"}</small>
          </div>
        </Link>
        {nav}
        <div className="admin-shell-sidebar-footer">
          <ShieldCheck size={16} aria-hidden="true" />
          <span>{isPersian ? "دسترسی مدیر تأیید شد" : "Admin Access verified"}</span>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          className="admin-shell-scrim"
          aria-label={isPersian ? "بستن منو" : "Close menu"}
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      ) : null}

      <aside className={`admin-shell-mobile-nav ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <div className="admin-mobile-nav-header">
          <strong>Nyra Admin</strong>
          <button className="admin-icon-button" onClick={() => setMobileOpen(false)} type="button">
            <X size={19} />
            <span className="sr-only">{isPersian ? "بستن" : "Close"}</span>
          </button>
        </div>
        {nav}
      </aside>

      <div className="admin-shell-main">
        <header className="admin-shell-topbar">
          <div className="admin-topbar-leading">
            <button
              className="admin-icon-button admin-mobile-menu-button"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <Menu size={19} />
              <span className="sr-only">{isPersian ? "باز کردن منو" : "Open menu"}</span>
            </button>
            <nav className="admin-breadcrumbs" aria-label={isPersian ? "مسیر صفحه" : "Breadcrumb"}>
              {segments.map((segment, index) => {
                const href = `/${segments.slice(0, index + 1).join("/")}`;
                const label = pathLabels[segment]
                  ? localized(pathLabels[segment], language)
                  : segment.replaceAll("-", " ");
                return index === segments.length - 1 ? (
                  <span aria-current="page" key={href}>{label}</span>
                ) : (
                  <Link href={href} key={href}>{label}</Link>
                );
              })}
            </nav>
          </div>

          <form className="admin-global-search" onSubmit={submitSearch} role="search">
            <Search size={16} aria-hidden="true" />
            <label className="sr-only" htmlFor="admin-global-search">
              {isPersian ? "جستجوی مدیریت" : "Search Admin"}
            </label>
            <input
              id="admin-global-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isPersian ? "جستجوی محتوا و کاربران…" : "Search content and users…"}
              type="search"
              value={query}
            />
            <kbd>⌘K</kbd>
          </form>

          <div className="admin-topbar-actions">
            <Link className="admin-icon-button" href="/admin/notifications" aria-label={isPersian ? "اعلان‌ها" : "Notifications"}>
              <Bell size={18} />
            </Link>
            <div className="admin-profile-menu" ref={profileRef}>
              <button
                className="admin-profile-trigger"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                type="button"
              >
                <span>{(session?.fullName ?? "A").slice(0, 1).toUpperCase()}</span>
                <div>
                  <strong>{session?.fullName ?? "Basic Admin"}</strong>
                  <small>{session?.email ?? "Environment access"}</small>
                </div>
                <ChevronDown size={15} />
              </button>
              {profileOpen ? (
                <div className="admin-profile-dropdown">
                  {session ? <Link href="/profile">{isPersian ? "پروفایل" : "Profile"}</Link> : null}
                  <Link href="/">{isPersian ? "مشاهده سایت" : "View learner site"}</Link>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="admin-shell-content">{children}</main>
      </div>
    </div>
  );
}
