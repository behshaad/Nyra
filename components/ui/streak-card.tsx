import { Flame, Trophy } from "lucide-react";

export type StreakPeriod = {
  periodStart: string;
  periodEnd: string;
};

type StreakCardLabels = {
  title?: string;
  current?: string;
  longest?: string;
  total?: string;
  days?: string;
};

type StreakCardProps = {
  streak: StreakPeriod[];
  currentStreak: number;
  longestStreak: number;
  total: number;
  labels?: StreakCardLabels;
};

function dayLabel(period: StreakPeriod) {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(`${period.periodStart}T00:00:00Z`)
  );
}

export function StreakCard({
  streak,
  currentStreak,
  longestStreak,
  total,
  labels
}: StreakCardProps) {
  const safeLongest = Math.max(longestStreak, 1);
  const streakPercent = Math.min(100, Math.round((currentStreak / safeLongest) * 100));

  return (
    <article className="streak-card" aria-label={labels?.title ?? "Daily streak"}>
      <div className="streak-card-main">
        <div className="streak-card-icon" aria-hidden="true">
          <Flame size={22} />
        </div>
        <div className="streak-card-copy">
          <span>{labels?.title ?? "Daily Streak"}</span>
          <strong>{currentStreak}</strong>
          <small>{labels?.days ?? "days"}</small>
        </div>
      </div>

      <div className="streak-card-ring" aria-hidden="true">
        <svg viewBox="0 0 96 96">
          <circle className="streak-card-ring-track" cx="48" cy="48" r="38" />
          <circle
            className="streak-card-ring-value"
            cx="48"
            cy="48"
            r="38"
            pathLength={100}
            style={{ strokeDasharray: 100, strokeDashoffset: 100 - streakPercent }}
          />
        </svg>
      </div>

      <div className="streak-card-days" aria-label={`${streak.length} recent streak days`}>
        {streak.map((period) => (
          <span className="active" key={`${period.periodStart}-${period.periodEnd}`}>
            {dayLabel(period)}
          </span>
        ))}
      </div>

      <div className="streak-card-metrics">
        <span>
          <Trophy size={14} aria-hidden="true" />
          {labels?.longest ?? "Best"}: <strong>{longestStreak}</strong>
        </span>
        <span>
          {labels?.total ?? "Total"}: <strong>{total}</strong>
        </span>
      </div>
    </article>
  );
}
