import { IStats } from "../../../models/problem";
import { messages } from "../../../locale/en-CA";

/**
 * Maps a day's attempt count to one of five intensity classes — a
 * contribution-graph ramp in the brand's terminal green.
 */
const levelClass = (count: number): string => {
  if (count === 0) return "bg-base-800";
  if (count === 1) return "bg-term-600/40";
  if (count === 2) return "bg-term-600/70";
  if (count <= 4) return "bg-term-500";
  return "bg-term-400";
};

interface IActivityHeatmapProps {
  heatmap: IStats["heatmap"];
}

/**
 * GitHub-style contribution grid of daily attempt activity: one column
 * per week, seven day-rows, most recent week on the right.
 */
export const ActivityHeatmap = ({ heatmap }: IActivityHeatmapProps) => {
  // Chunk the flat day list into week columns of 7 (oldest first).
  const weeks: IStats["heatmap"][] = [];
  for (let i = 0; i < heatmap.length; i += 7) {
    weeks.push(heatmap.slice(i, i + 7));
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="flex gap-1" role="img" aria-label="Activity heatmap">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day) => (
                <span
                  key={day.date}
                  title={`${day.date}: ${day.count} attempt${
                    day.count === 1 ? "" : "s"
                  }`}
                  className={`h-3 w-3 rounded-sm ${levelClass(day.count)}`}
                ></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-base-400">
        <span>{messages.STATS_LESS}</span>
        <span className="h-3 w-3 rounded-sm bg-base-800"></span>
        <span className="h-3 w-3 rounded-sm bg-term-600/40"></span>
        <span className="h-3 w-3 rounded-sm bg-term-600/70"></span>
        <span className="h-3 w-3 rounded-sm bg-term-500"></span>
        <span className="h-3 w-3 rounded-sm bg-term-400"></span>
        <span>{messages.STATS_MORE}</span>
      </div>
    </div>
  );
};
