"use client";

import { useLayoutEffect } from "react";
import type { InterfaceLanguageCode } from "@/lib/i18n/interface-language";

export function InterfaceLanguageSync({
  language
}: {
  language: InterfaceLanguageCode;
}) {
  useLayoutEffect(() => {
    const root = globalThis.document.documentElement;
    root.lang = language;
    root.dir = language === "fa" ? "rtl" : "ltr";
  }, [language]);

  return null;
}
