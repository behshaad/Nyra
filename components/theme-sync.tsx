"use client";

import { useEffect } from "react";
import type { InterfaceThemeCode } from "@/lib/i18n/interface-theme";

export function ThemeSync({ theme }: { theme: InterfaceThemeCode }) {
  useEffect(() => {
    if (theme === "SYSTEM") {
      globalThis.document.documentElement.removeAttribute("data-theme");
      return;
    }

    globalThis.document.documentElement.setAttribute("data-theme", theme.toLowerCase());
  }, [theme]);

  return null;
}
