import { describe, expect, it } from "vitest";
import { adminPageAccessRedirectForSession } from "@/lib/auth/admin-access";
import type { AuthSession } from "@/lib/auth/session";

function session(role: AuthSession["role"]): AuthSession {
  return {
    email: "learner@example.com",
    emailVerifiedAt: null,
    expiresAt: null,
    fullName: "Learner",
    id: "auth-user-1",
    role
  };
}

describe("admin page access", () => {
  it("redirects logged-out visitors to login with an admin return target", () => {
    expect(adminPageAccessRedirectForSession(null)).toBe("/login?returnTo=/admin");
  });

  it("sends authenticated non-admins to an access denied page", () => {
    expect(adminPageAccessRedirectForSession(session("USER"))).toBe(
      "/admin-access-denied"
    );
  });

  it("allows authenticated admins through", () => {
    expect(adminPageAccessRedirectForSession(session("ADMIN"))).toBeNull();
  });
});
