import Link from "next/link";
import type { ReactNode } from "react";
import type { ResearchRow } from "@/lib/research/adaptive-learning";

export function ResearchPageHeader({
  eyebrow,
  title,
  body,
  actions
}: {
  eyebrow: string;
  title: string;
  body: string;
  actions?: ReactNode;
}) {
  return (
    <header className="research-hero">
      <div>
        <span className="section-label">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{body}</p>
      </div>
      {actions ? <div className="research-actions">{actions}</div> : null}
    </header>
  );
}

export function ResearchLink({
  href,
  children,
  secondary = false
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={secondary ? "button-link compact-link" : "primary-link compact-link"} href={href}>
      {children}
    </Link>
  );
}

function labelFor(column: string) {
  return column.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value: string | number, locale: string) {
  if (typeof value !== "number") return value || "—";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 4 }).format(value);
}

export function ResearchTable({
  title,
  rows,
  locale,
  limit = 8
}: {
  title: string;
  rows: ResearchRow[];
  locale: string;
  limit?: number;
}) {
  const visibleRows = rows.slice(0, limit);
  const columns = Object.keys(visibleRows[0] ?? {});

  return (
    <section className="research-panel">
      <h2>{title}</h2>
      {visibleRows.length ? (
        <div aria-label={title} className="research-table-scroll" role="region" tabIndex={0}>
          <table>
            <thead>
              <tr>
                {columns.map((column) => <th key={column}>{labelFor(column)}</th>)}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, rowIndex) => (
                <tr key={`${title}-${rowIndex}`}>
                  {columns.map((column) => <td key={column}>{formatValue(row[column], locale)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="research-empty">No generated rows.</p>}
    </section>
  );
}
