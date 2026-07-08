export type InterfaceThemeCode = "SYSTEM" | "LIGHT" | "DARK";

export const defaultInterfaceTheme: InterfaceThemeCode = "SYSTEM";

const themes = new Set<InterfaceThemeCode>(["SYSTEM", "LIGHT", "DARK"]);

export function resolveInterfaceTheme(value: unknown): InterfaceThemeCode {
  return themes.has(value as InterfaceThemeCode)
    ? (value as InterfaceThemeCode)
    : defaultInterfaceTheme;
}

export function nextInterfaceTheme(theme: InterfaceThemeCode): InterfaceThemeCode {
  if (theme === "SYSTEM") {
    return "DARK";
  }

  if (theme === "DARK") {
    return "LIGHT";
  }

  return "SYSTEM";
}

export function interfaceThemePreferenceHref(input: {
  theme: InterfaceThemeCode;
  returnTo: string;
}) {
  const params = new globalThis.URLSearchParams({
    theme: input.theme,
    returnTo: input.returnTo
  });

  return `/api/learner-preferences/interface-theme?${params.toString()}`;
}
