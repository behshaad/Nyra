import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Vazirmatn } from "next/font/google";
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

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${inter.variable} ${vazirmatn.variable}`}>
        {children}
      </body>
    </html>
  );
}
