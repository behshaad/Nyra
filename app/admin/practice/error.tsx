"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminPracticeError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="practice-admin-page">
      <section className="practice-admin-error" role="alert">
        <AlertTriangle aria-hidden="true" size={30} />
        <h1>Practice Journey could not load / مسیر تمرین بارگیری نشد</h1>
        <p>
          Try the request again. If the problem continues, review the operational logs.
          <br />
          دوباره تلاش کنید. اگر مشکل ادامه داشت، گزارش‌های عملیاتی را بررسی کنید.
        </p>
        {error.digest ? <small>Reference: {error.digest}</small> : null}
        <div>
          <button className="primary-button" onClick={reset} type="button">
            <RotateCcw aria-hidden="true" size={16} />
            Retry / تلاش دوباره
          </button>
          <Link className="secondary-button" href="/admin">
            Back to Admin / بازگشت
          </Link>
        </div>
      </section>
    </div>
  );
}
