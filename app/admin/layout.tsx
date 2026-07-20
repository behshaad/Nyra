import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdminPageAccess } from "@/lib/auth/admin-access";
import { getAuthSession } from "@/lib/auth/server";
import { getLearnerPreferencesForAuthUser } from "@/lib/learner/preferences";

export default async function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireAdminPageAccess();
  const session = await getAuthSession();
  const preferences = session
    ? await getLearnerPreferencesForAuthUser(session.id)
    : null;

  return (
    <AdminShell language={preferences?.interfaceLanguage ?? "en"}>
      {children}
    </AdminShell>
  );
}
