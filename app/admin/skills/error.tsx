"use client";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminSkillsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="skill-studio-page"><section className="skill-studio-empty" role="alert"><AlertTriangle aria-hidden="true" size={30} /><h1>Skill Studio could not load / مهارت‌ها بارگیری نشد</h1><p>Try again. If the problem continues, review the operational logs.</p>{error.digest ? <small>Reference: {error.digest}</small> : null}<div className="route-actions"><button className="primary-button" onClick={reset} type="button"><RotateCcw aria-hidden="true" size={16} />Retry</button><Link className="secondary-button" href="/admin">Back to Admin</Link></div></section></div>;
}
