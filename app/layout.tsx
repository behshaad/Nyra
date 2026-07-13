import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/auth-provider";
import { getAuthSession } from "@/lib/auth/server";
import { interfaceCopy } from "@/lib/i18n/interface-language";
import { getLearnerPreferencesForAuthUser } from "@/lib/learner/preferences";
import "./globals.css";

const inter = localFont({
  src: "../public/fonts/nyra-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"]
});

const vazirmatn = localFont({
  src: "../public/fonts/far-baseet.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["system-ui", "sans-serif"]
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
  const session = await getAuthSession();
  const preferences = await getLearnerPreferencesForAuthUser(session?.id);
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
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
