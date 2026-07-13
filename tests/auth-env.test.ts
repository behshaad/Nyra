import { afterEach, describe, expect, it } from "vitest";
import { getAuthEnvStatus, missingRequiredAuthEnv } from "@/scripts/auth-env";

const authEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "DATABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY"
] as const;

const originalEnv = Object.fromEntries(
  authEnvKeys.map((key) => [key, process.env[key]])
);

function clearAuthEnv() {
  for (const key of authEnvKeys) {
    delete process.env[key];
  }
}

afterEach(() => {
  clearAuthEnv();

  for (const [key, value] of Object.entries(originalEnv)) {
    if (value !== undefined) {
      process.env[key] = value;
    }
  }
});

describe("auth env checks", () => {
  it("reports every required authentication variable", () => {
    clearAuthEnv();

    expect(missingRequiredAuthEnv()).toEqual([
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "DATABASE_URL"
    ]);
  });

  it("treats the service role key as optional for app startup", () => {
    clearAuthEnv();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "publishable";
    process.env.DATABASE_URL = "postgres://example";

    expect(missingRequiredAuthEnv()).toEqual([]);
    expect(
      getAuthEnvStatus().find(
        (entry) => entry.key === "SUPABASE_SERVICE_ROLE_KEY"
      )
    ).toMatchObject({
      present: false,
      required: false
    });
  });
});
