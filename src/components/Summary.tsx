import React, { useMemo, useState } from "react";
import { formatDuration } from "../utils/timerUtils";

type SummaryProps = {
  initialDays?: number;
};

type TimerData = {
  title: string;
  elapsedTime: { focus: number; shortBreak: number };
  total?: { focus: number; shortBreak: number };
  lastUpdated: number;
};

const getTimerSummaries = (
  days: number
): { title: string; totalSeconds: number }[] => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const summaries: { title: string; totalSeconds: number }[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed: TimerData = JSON.parse(raw);

      if (!parsed.lastUpdated || parsed.lastUpdated < cutoff) continue;

      const focus =
        (parsed.elapsedTime?.focus || 0) + (parsed.total?.focus || 0);
      const shortBreak =
        (parsed.elapsedTime?.shortBreak || 0) + (parsed.total?.shortBreak || 0);
      const totalSeconds = focus + shortBreak;

      summaries.push({ title: parsed.title || key, totalSeconds });
    } catch {
      continue;
    }
  }

  return summaries.sort((a, b) => b.totalSeconds - a.totalSeconds);
};

const Summary: React.FC<SummaryProps> = ({ initialDays = 7 }) => {
  const [days, setDays] = useState<number>(initialDays);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const summaries = useMemo(
    () => getTimerSummaries(days),
    [days, refreshCounter]
  );

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
            onChange={(e) => {
              const val = Math.max(1, parseInt(e.target.value) || 1);
              setDays(val);
              setRefreshCounter((c) => c + 1); // ✅ force refresh
            }}
            style={{ width: "60px", marginRight: "4px" }}
          />
          day{days !== 1 ? "s" : ""}
        </label>
      </div>

      <table
        style={{
          width: "50%",
          borderCollapse: "collapse",
          justifySelf: "center",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                textAlign: "center",
                padding: "0.5rem",
                borderBottom: "2px solid #ccc",
              }}
            >
              Timer
            </th>
            <th
              style={{
                textAlign: "right",
                padding: "0.5rem",
                borderBottom: "2px solid #ccc",
              }}
            >
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {summaries.map(({ title, totalSeconds }) => (
            <tr key={title}>
              <td style={{ padding: "0.5rem" }}>{title}</td>
              <td style={{ padding: "0.5rem", textAlign: "right" }}>
                {formatDuration(totalSeconds)}
              </td>
            </tr>
          ))}
          {summaries.length === 0 && (
            <tr>
              <td
                colSpan={2}
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
