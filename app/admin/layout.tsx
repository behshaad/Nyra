import type { ReactNode } from "react";
import { requireAdminPageAccess } from "@/lib/auth/admin-access";

export default async function AdminLayout({
  children
}: {
  children: ReactNode;
}) {
  await requireAdminPageAccess();

  return children;
}
