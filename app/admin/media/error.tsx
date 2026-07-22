"use client";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";
export default function AdminMediaError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="media-admin-page"><section className="media-admin-empty" role="alert"><AlertTriangle aria-hidden="true" size={30} /><h1>Media Library could not load / رسانه بارگیری نشد</h1><p>Try again. If the problem continues, review the operational logs.</p>{error.digest ? <small>Reference: {error.digest}</small> : null}<div className="route-actions"><button className="primary-button" onClick={reset} type="button"><RotateCcw aria-hidden="true" size={16} />Retry</button><Link className="secondary-button" href="/admin">Back to Admin</Link></div></section></div>; }
