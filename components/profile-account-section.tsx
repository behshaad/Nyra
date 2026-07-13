"use client";

import Link from "next/link";
import { CreditCard, KeyRound, LogOut, Mail, Save, Settings, UserRound } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import type { AuthSession } from "@/lib/auth/session";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";
import { withInterfaceLanguage } from "@/lib/i18n/interface-language";

const labels = {
  fa: {
    section: "Account",
    account: "Account Settings",
    subscription: "Pricing / Subscription",
    displayName: "نام نمایشی",
    email: "ایمیل",
    password: "رمز عبور",
    passwordValue: "بازنشانی رمز عبور با ایمیل امن Supabase انجام می‌شود.",
    save: "ذخیره تغییرات",
    logout: "خروج",
    plan: "Standard",
    planBody: "اشتراک فعلا رایگان است و پرداخت بعدا در صفحه قیمت‌گذاری کامل می‌شود.",
    pricing: "دیدن قیمت‌گذاری"
  },
  en: {
    section: "Account",
    account: "Account Settings",
    subscription: "Pricing / Subscription",
    displayName: "Display name",
    email: "Email",
    password: "Password",
    passwordValue: "Password resets use Supabase secure email flow.",
    save: "Save changes",
    logout: "Logout",
    plan: "Standard",
    planBody: "Nyra is free while subscriptions and regional payments are prepared.",
    pricing: "View pricing"
  },
  de: {
    section: "Account",
    account: "Kontoeinstellungen",
    subscription: "Preise / Abo",
    displayName: "Anzeigename",
    email: "E-Mail",
    password: "Passwort",
    passwordValue: "Passwort-Zuruecksetzungen laufen ueber sichere Supabase-E-Mails.",
    save: "Aenderungen speichern",
    logout: "Abmelden",
    plan: "Standard",
    planBody: "Nyra ist kostenlos, waehrend Abos und regionale Zahlungen vorbereitet werden.",
    pricing: "Preise ansehen"
  }
} satisfies Record<InterfaceLanguageCode, Record<string, string>>;

export function ProfileAccountSection({
  language,
  session
}: {
  language: InterfaceLanguageCode;
  session: AuthSession | null;
}) {
  const copy = labels[language];

  return (
    <section className="app-panel profile-account-section" id="settings" aria-labelledby="profile-account-title">
      <div className="app-panel-header">
        <div>
          <p className="panel-kicker">{copy.section}</p>
          <h2 id="profile-account-title">{copy.account}</h2>
        </div>
        <Settings size={22} aria-hidden="true" />
      </div>

      <div className="profile-account-grid">
        <div className="profile-account-card">
          <label className="auth-field">
            <span>{copy.displayName}</span>
            <div>
              <UserRound size={18} aria-hidden="true" />
              <input defaultValue={session?.fullName ?? "Nyra Learner"} />
            </div>
          </label>
          <label className="auth-field">
            <span>{copy.email}</span>
            <div>
              <Mail size={18} aria-hidden="true" />
              <input defaultValue={session?.email ?? "learner@nyra.local"} type="email" />
            </div>
          </label>
          <div className="account-setting-row compact-row">
            <KeyRound size={18} aria-hidden="true" />
            <div>
              <strong>{copy.password}</strong>
              <span>{copy.passwordValue}</span>
            </div>
          </div>
          <div className="profile-account-actions">
            <button className="primary-button compact" type="button">
              <Save size={17} aria-hidden="true" />
              {copy.save}
            </button>
            <form action={logoutAction}>
              <button className="danger-button" type="submit">
                <LogOut size={17} aria-hidden="true" />
                {copy.logout}
              </button>
            </form>
          </div>
        </div>

        <article className="profile-account-card subscription-card">
          <div className="subscription-icon">
            <CreditCard size={22} aria-hidden="true" />
          </div>
          <div>
            <p className="panel-kicker">{copy.subscription}</p>
            <h3>{copy.plan}</h3>
            <p>{copy.planBody}</p>
          </div>
          <Link className="secondary-button" href={withInterfaceLanguage("/pricing", language)}>
            {copy.pricing}
          </Link>
        </article>
      </div>
    </section>
  );
}
