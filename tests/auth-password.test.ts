import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("auth password hashing", () => {
  it("stores passwords as bcrypt hashes and verifies only the original password", async () => {
    const hash = await hashPassword("Admin123!");

    expect(hash).toMatch(/^\$2[aby]\$/);
    await expect(verifyPassword("Admin123!", hash)).resolves.toBe(true);
    await expect(verifyPassword("Wrong123!", hash)).resolves.toBe(false);
    expect(hash).not.toContain("Admin123!");
  });
});
