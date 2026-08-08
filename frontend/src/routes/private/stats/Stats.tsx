import { formatDistance } from "date-fns";
import { IStats } from "../../../models/problem";
import { useStatsQuery } from "../../../hooks/useStatsQuery";
import { ActivityHeatmap } from "./ActivityHeatmap";
import { messages } from "../../../locale/en-CA";

const difficultyClass: Record<string, string> = {
  easy: "text-term-400",
  medium: "text-amber-400",
  hard: "text-traffic-red",
};

const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
};

const StatTile = ({ value, label }: { value: string; label: string }) => (
  <div className="rounded-xl border border-base-700 bg-base-900/70 px-5 py-4">
    <div className="text-2xl font-bold text-term-400">{value}</div>
    <div className="mt-1 text-sm text-base-400">{label}</div>
  </div>
);

const SectionCard = ({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-xl border border-base-700 bg-base-900/70 p-6">
    <p className="mb-5 text-sm font-semibold text-term-400">{heading}</p>
    {children}
  </section>
);

const CoverageBar = ({
  entry,
}: {
  entry: IStats["categories"][number];
}) => {
  const percent = entry.total > 0 ? (entry.solved / entry.total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-44 shrink-0 truncate text-base-200">
        {entry.label}
      </span>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-700">
        <span
          className="block h-full bg-term-500"
          style={{ width: `${percent}%` }}
        ></span>
      </span>
      <span className="w-12 shrink-0 text-right font-bold text-base-400">
        {entry.solved}/{entry.total}
      </span>
    </div>
  );
};

/**
 * Stats / history page: headline totals, a 12-week activity heatmap,
 * per-pattern coverage bars, and a recent-attempts log.
 */
export const StatsRoute = () => {
  const { data: stats, isLoading, isError } = useStatsQuery();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold text-term-400">
        {messages.STATS_LABEL}
      </p>
      <h1 className="mt-2 mb-8 text-2xl font-bold tracking-tight text-base-100">
        {messages.STATS_TITLE}
      </h1>

      {isLoading ? (
        <div
          role="status"
          aria-label="Loading stats"
          className="h-64 animate-pulse rounded-xl border border-base-700 bg-base-800/60"
        ></div>
      ) : isError || !stats ? null : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatTile
              value={`${stats.totals.solved}/${stats.totals.catalog}`}
              label={messages.STATS_STAT_SOLVED}
            />
            <StatTile
              value={String(stats.totals.attempts)}
              label={messages.STATS_STAT_ATTEMPTS}
            />
            <StatTile
              value={String(stats.totals.streak)}
              label={messages.STATS_STAT_STREAK}
            />
            <StatTile
              value={stats.totals.avg_score.toFixed(1)}
              label={messages.STATS_STAT_AVG}
            />
            <StatTile
              value={formatMinutes(stats.totals.minutes)}
              label={messages.STATS_STAT_TIME}
            />
          </div>

          <SectionCard heading={messages.STATS_ACTIVITY_HEADING}>
            <ActivityHeatmap heatmap={stats.heatmap} />
          </SectionCard>

          <SectionCard heading={messages.STATS_COVERAGE_HEADING}>
            <div className="flex flex-col gap-3">
              {stats.categories.map((entry) => (
                <CoverageBar key={entry.category} entry={entry} />
              ))}
            </div>
          </SectionCard>

          <SectionCard heading={messages.STATS_RECENT_HEADING}>
            {stats.recent.length === 0 ? (
              <p className="font-sans text-sm text-base-300">
                {messages.STATS_RECENT_EMPTY}
              </p>
            ) : (
              <div className="flex flex-col divide-y divide-base-700/50">
                {stats.recent.map((attempt) => (
                  <div
                    key={`${attempt.problem_id}-${attempt.timestamp}`}
                    className="flex items-center gap-3 py-2.5 text-sm"
                  >
                    <span className="min-w-0 flex-1 truncate font-bold text-base-100">
                      {attempt.name}
                    </span>
                    <span
                      className={`hidden w-16 font-bold sm:inline ${
                        difficultyClass[attempt.difficulty]
                      }`}
                    >
                      {attempt.difficulty}
                    </span>
                    <span
                      className={`w-10 text-right font-bold ${
                        attempt.score >= 6
                          ? "text-term-400"
                          : "text-traffic-red"
                      }`}
                    >
                      {attempt.score}/10
                    </span>
                    <span className="hidden w-32 text-right text-base-400 md:inline">
                      {formatDistance(attempt.timestamp, new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </section>
  );
};
