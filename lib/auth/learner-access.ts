import { devAuthUserId } from "@/lib/learner/preferences";

export function resolveLearnerAuthUserId(
  authUserId: string | null | undefined,
  environment = process.env.NODE_ENV
) {
  if (authUserId) {
    return authUserId;
  }

  return environment === "production" ? null : devAuthUserId;
}
