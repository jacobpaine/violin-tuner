import React, { useMemo, useState } from "react";
import { formatDuration } from "../utils/timerUtils";

type SummaryProps = {
  initialDays?: number;
};

type TimerLog = {
  mode: "focus" | "shortBreak";
  seconds: number;
  timestamp: number;
};

type TimerData = {
  title: string;
  logs?: TimerLog[];
  elapsedTime: { focus: number; shortBreak: number };
  startedAt: number | null;
  isRunning: boolean;
  mode: "focus" | "shortBreak";
};

const dayLabels = [
  { key: "Sun", label: "Sun" },
  { key: "Mon", label: "M" },
  { key: "Tue", label: "T" },
  { key: "Wed", label: "W" },
  { key: "Thu", label: "T" },
  { key: "Fri", label: "F" },
  { key: "Sat", label: "Sat" },
];

const getDayKey = (date: Date) => {
  return dayLabels[date.getDay()].key;
};

const getTimerDaySummaries = (
  days: number
): {
  title: string;
  totalsByDay: Record<string, number>;
  totalSeconds: number;
}[] => {
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;
  const summaries: Record<string, Record<string, number>> = {};
  const totalPerTimer: Record<string, number> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed: TimerData = JSON.parse(raw);
      const title = parsed.title || key;
      const logs = parsed.logs || [];

      for (const log of logs) {
        if (log.timestamp < cutoff) continue;
        const day = getDayKey(new Date(log.timestamp));
        summaries[title] ??= {};
        summaries[title][day] = (summaries[title][day] || 0) + log.seconds;
        totalPerTimer[title] = (totalPerTimer[title] || 0) + log.seconds;
      }

      if (parsed.isRunning && parsed.startedAt) {
        const realElapsed = Math.floor((now - parsed.startedAt) / 1000);
        const currentElapsed =
          (parsed.elapsedTime?.[parsed.mode] || 0) + realElapsed;
        const today = getDayKey(new Date(now));
        summaries[title] ??= {};
        summaries[title][today] =
          (summaries[title][today] || 0) + currentElapsed;
        totalPerTimer[title] = (totalPerTimer[title] || 0) + currentElapsed;
      }
    } catch {
      continue;
    }
  }

  return Object.entries(summaries).map(([title, totalsByDay]) => ({
    title,
    totalsByDay,
    totalSeconds: totalPerTimer[title] || 0,
  }));
};

const Summary: React.FC<SummaryProps> = ({ initialDays = 7 }) => {
  const [days, setDays] = useState<number>(initialDays);
  const summaries = useMemo(() => getTimerDaySummaries(days), [days]);

  return (
    <div style={{ padding: "1rem", color: "white" }}>
      <h2 style={{ color: "white" }}>
        Summary (Last {days} Day{days !== 1 ? "s" : ""})
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Show data from the last{" "}
          <input
            type="number"
            value={days}
            onChange={(e) =>
              setDays(Math.max(1, parseInt(e.target.value) || 1))
            }
            style={{ width: "60px", marginRight: "4px" }}
          />
          day{days !== 1 ? "s" : ""}
        </label>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "0.5rem",
                borderBottom: "2px solid #ccc",
              }}
            >
              Timer
            </th>
            {dayLabels.map(({ key, label }) => (
              <th
                key={key}
                style={{
                  padding: "0.5rem",
                  borderBottom: "2px solid #ccc",
                  textAlign: "center",
                }}
              >
                {label}
              </th>
            ))}
            <th
              style={{
                textAlign: "right",
                padding: "0.5rem",
                borderBottom: "2px solid #ccc",
              }}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {summaries.map(({ title, totalsByDay, totalSeconds }) => (
            <tr key={title}>
              <td style={{ padding: "0.5rem" }}>{title}</td>
              {dayLabels.map(({ key }) => (
                <td
                  key={key}
                  style={{ padding: "0.5rem", textAlign: "center" }}
                >
                  {totalsByDay[key] ? formatDuration(totalsByDay[key]) : "-"}
                </td>
              ))}
              <td style={{ padding: "0.5rem", textAlign: "right" }}>
                {formatDuration(totalSeconds)}
              </td>
            </tr>
          ))}
          {summaries.length === 0 && (
            <tr>
              <td
                colSpan={dayLabels.length + 2}
                style={{
                  padding: "0.5rem",
                  textAlign: "center",
                  color: "#888",
                }}
              >
                No activity in the last {days} day{days !== 1 ? "s" : ""}.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Summary;
