import { describe, expect, it } from "vitest";
import { normalizeDatabaseConnectionString } from "@/lib/db/connection-string";

describe("database connection string normalization", () => {
  it.each(["prefer", "require", "verify-ca"])(
    "makes the current strict %s behavior explicit",
    (sslMode) => {
      expect(
        normalizeDatabaseConnectionString(
          `postgresql://user:password@example.com/nyra?sslmode=${sslMode}`
        )
      ).toContain("sslmode=verify-full");
    }
  );

  it("preserves unrelated and invalid connection strings", () => {
    expect(
      normalizeDatabaseConnectionString(
        "postgresql://user:password@example.com/nyra?sslmode=disable"
      )
    ).toContain("sslmode=disable");
    expect(normalizeDatabaseConnectionString("not-a-url")).toBe("not-a-url");
  });
});
