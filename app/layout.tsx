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
      <body className={`${inter.variable} ${vazirmatn.variable}`}>
        {children}
      </body>
    </html>
  );
}
