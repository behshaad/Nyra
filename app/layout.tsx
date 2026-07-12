import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Vazirmatn } from "next/font/google";
import { interfaceCopy } from "@/lib/i18n/interface-language";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Nyra | آموزش آلمانی برای فارسی‌زبان‌ها",
  description:
    "یک مسیر مدرن آموزش آلمانی برای فارسی‌زبان‌ها."
};

const criticalCss = `
:root {
  color-scheme: light;
  --bg: #fff5f8;
  --text: #301f32;
  --muted: #745a73;
  --line: rgba(92, 49, 76, 0.14);
  --surface: rgba(255, 255, 255, 0.74);
  --surface-strong: #ffffff;
  --control: rgba(255, 255, 255, 0.62);
  --control-hover: rgba(201, 141, 160, 0.13);
  --green: #927394;
  --green-dark: #5f3f61;
  --teal: #f0a6b7;
  --danger: #a84660;
  --shadow: 0 24px 80px rgba(92, 49, 76, 0.15);
  --hover-shadow: 0 14px 34px rgba(92, 49, 76, 0.11);
  --radius: 8px;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #121313;
  --text: #fff6fa;
  --muted: #d8bccb;
  --line: rgba(246, 201, 214, 0.18);
  --surface: rgba(48, 28, 43, 0.8);
  --surface-strong: #3b253d;
  --control: rgba(48, 28, 43, 0.78);
  --control-hover: rgba(231, 143, 165, 0.18);
  --green: #e7c9dc;
  --green-dark: #f6dce6;
  --teal: #f0a6b7;
  --danger: #ffb4c7;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.38);
  --hover-shadow: 0 14px 34px rgba(0, 0, 0, 0.32);
}

* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-inter), var(--font-vazirmatn), system-ui, sans-serif;
}
.learner-rtl { font-family: var(--font-vazirmatn), var(--font-inter), system-ui, sans-serif; }
a { color: inherit; text-decoration: none; }
button, input, textarea, select { font: inherit; }
.site-shell { min-height: 100vh; overflow: hidden; padding: 18px; position: relative; }
.site-shell[dir="rtl"] { text-align: right; }
.topbar {
  align-items: center;
  backdrop-filter: blur(20px);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  display: flex;
  gap: 12px;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 1180px;
  min-height: 68px;
  padding: 10px 12px;
  position: sticky;
  top: 18px;
  z-index: 20;
}
.topbar-left, .topbar-actions, .desktop-nav, .desktop-controls { align-items: center; display: flex; gap: 8px; }
.brand-mark, .icon-button, .flashcard-add-button {
  align-items: center;
  background: var(--control);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text);
  display: inline-flex;
  justify-content: center;
  min-height: 42px;
  min-width: 42px;
}
.desktop-nav a, .primary-button, .secondary-button, .danger-button {
  align-items: center;
  border-radius: 7px;
  display: inline-flex;
  font-weight: 750;
  gap: 8px;
  justify-content: center;
  min-height: 42px;
  padding: 0 14px;
}
.desktop-nav a.active, .primary-button {
  background: linear-gradient(135deg, var(--green), var(--teal));
  color: white;
}
.secondary-button, .danger-button { background: var(--control); border: 1px solid var(--line); color: var(--text); }
.danger-button { color: var(--danger); }
.route-page {
  display: grid;
  gap: 28px;
  margin: 0 auto;
  max-width: 1180px;
  padding: 56px 0 88px;
}
.route-hero { display: grid; gap: 10px; max-width: 820px; }
.route-hero h1 { font-size: clamp(2.7rem, 7vw, 5.6rem); line-height: 0.95; margin: 0; }
.route-hero p, .flashcard-library-heading p, .flashcard-empty-library p {
  color: var(--muted);
  line-height: 1.6;
  margin: 0;
}
.section-label { color: var(--green); font-size: 0.78rem; font-weight: 900; }
.flashcard-layer, .flashcard-library-section { display: grid; gap: 18px; }
.flashcard-library-heading { align-items: center; display: flex; justify-content: space-between; gap: 14px; }
.flashcard-library-heading h2 { font-size: clamp(1.8rem, 4vw, 2.8rem); margin: 0; }
.flashcard-library-grid { display: grid; gap: 12px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.flashcard-library-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  display: grid;
  gap: 14px;
  min-height: 176px;
  padding: 16px;
  text-align: start;
}
.flashcard-library-icon {
  align-items: center;
  background: var(--control-hover);
  border-radius: 8px;
  color: var(--green);
  display: inline-flex;
  height: 42px;
  justify-content: center;
  width: 42px;
}
.flashcard-library-card strong, .flashcard-library-card small, .flashcard-library-meta { display: block; overflow-wrap: anywhere; }
.flashcard-library-card small, .flashcard-library-meta { color: var(--muted); line-height: 1.5; }
.flashcard-empty-library {
  background: var(--surface);
  border: 1px dashed var(--line);
  border-radius: 8px;
  padding: 18px;
}
@media (max-width: 1040px) { .flashcard-library-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 960px) {
  .site-shell { padding: 12px; }
  .topbar { top: 12px; }
  .desktop-nav, .desktop-controls { display: none; }
}
@media (max-width: 520px) {
  .flashcard-library-heading { align-items: stretch; flex-direction: column; }
  .flashcard-library-grid { grid-template-columns: 1fr; }
  .primary-button, .secondary-button, .danger-button { width: 100%; }
}
`;

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const preferences = await getLearnerPreferences();
  const themeAttribute =
    preferences.interfaceTheme === "SYSTEM"
      ? undefined
      : preferences.interfaceTheme.toLowerCase();
  const copy = interfaceCopy[preferences.interfaceLanguage];

  return (
    <html
      lang={preferences.interfaceLanguage}
      dir={copy.dir}
      data-theme={themeAttribute}
    >
      <head>
        <style
          id="nyra-critical-css"
          dangerouslySetInnerHTML={{
            __html: criticalCss
          }}
        />
      </head>
      <body className={`${inter.variable} ${vazirmatn.variable}`}>
        {children}
      </body>
    </html>
  );
}
