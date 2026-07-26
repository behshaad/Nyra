import { describe, expect, it } from "vitest";
import {
  resolveSupportedInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";

describe("supported interface language", () => {
  it("uses a valid URL override", () => {
    expect(resolveSupportedInterfaceLanguage("en", "fa")).toBe("en");
  });

  it("ignores invalid and preview-only URL overrides", () => {
    expect(resolveSupportedInterfaceLanguage("fr", "en")).toBe("en");
    expect(resolveSupportedInterfaceLanguage("de", "en")).toBe("en");
  });

  it("migrates a preview-only saved preference to Persian", () => {
    expect(resolveSupportedInterfaceLanguage(undefined, "de")).toBe("fa");
  });

  it("replaces a stale language parameter without losing page state", () => {
    expect(withInterfaceLanguage("/resources?q=wort&ui=en#results", "fa"))
      .toBe("/resources?q=wort#results");
    expect(withInterfaceLanguage("/resources?q=wort&ui=fa#results", "en"))
      .toBe("/resources?q=wort&ui=en#results");
  });
});
