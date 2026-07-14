import { afterEach, describe, expect, it } from "vitest";
import { getAuthEnvStatus, missingRequiredAuthEnv } from "@/scripts/auth-env";

const authEnvKeys = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET"
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
      "DATABASE_URL",
      "NEXTAUTH_SECRET"
    ]);
  });

  it("passes when the database and Auth.js secret are configured", () => {
    clearAuthEnv();
    process.env.DATABASE_URL = "postgres://example";
    process.env.NEXTAUTH_SECRET = "secret";

    expect(missingRequiredAuthEnv()).toEqual([]);
    expect(
      getAuthEnvStatus().find(
        (entry) => entry.key === "NEXTAUTH_SECRET"
      )
    ).toMatchObject({
      present: true,
      required: true
    });
  });
});
