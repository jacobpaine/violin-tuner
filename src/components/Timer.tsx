import React, { useEffect, useState } from "react";
import {
  formatDuration,
  parseDuration,
  playMelody,
  sessionEndMelody,
} from "../utils/timerUtils";
import { useTimerContext } from "../context/TimerContext";
import { Mode } from "../types/timerTypes";

const Timer: React.FC<{
  storageKey: string;
  onRemove?: () => void;
}> = ({ storageKey, onRemove }) => {
  const { timers, updateTimer } = useTimerContext();
  const timer = timers[storageKey];

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [editableTimeInput, setEditableTimeInput] = useState("30m");

  const toggleStart = () => {
    if (!timer.isRunning) {
      updateTimer(storageKey, {
        isRunning: true,
        startedAt: Date.now(),
        lastUpdated: Date.now(),
      });
    } else {
      updateTimer(storageKey, {
        isRunning: false,
        startedAt: null,
        elapsedTime: {
          ...timer.elapsedTime,
          [timer.mode]: timer.elapsedTime[timer.mode],
        },
        total: {
          ...timer.total,
          [timer.mode]: timer.total[timer.mode],
        },
        lastUpdated: Date.now(),
      });
    }
  };

  const handleTitleSubmit = () => {
    const newTitle = editingTitle?.trim();
    if (!newTitle || newTitle === storageKey) {
      setIsEditingTitle(false);
      setEditingTitle(null);
      return;
    }

    let finalTitle = newTitle;
    let counter = 1;
    while (timers[finalTitle]) {
      finalTitle = `${newTitle} (${counter++})`;
    }

    const timerData = { ...timers[storageKey] };
    localStorage.setItem(finalTitle, JSON.stringify(timerData));
    localStorage.removeItem(storageKey);

    delete timers[storageKey];
    updateTimer(finalTitle, timerData);
    if (onRemove) onRemove();
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h > "00" ? `${h}h ` : ""}${m}m ${s}s`;
  };

  useEffect(() => {
    if (!timer.isRunning || !timer.startedAt) return;

    const tick = () => {
      const now = Date.now();
      const currentElapsed = Math.floor((now - timer.startedAt!) / 1000);
      const elapsedTime = timer.elapsedTime[timer.mode] + currentElapsed;
      const remaining = timer.durations[timer.mode] - elapsedTime;
      const totalTime = timer.total[timer.mode] + currentElapsed;

      if (remaining <= 0) {
        const nextMode: Mode = timer.mode === "focus" ? "shortBreak" : "focus";
        const updatedCounts = {
          ...timer.completedCounts,
          [timer.mode]: timer.completedCounts[timer.mode] + 1,
        };
        if (timer.mode === "focus") playMelody(sessionEndMelody);
        updateTimer(storageKey, {
          mode: nextMode,
          isRunning: false,
          secondsLeft: timer.durations[nextMode] - timer.total[nextMode],
          completedCounts: updatedCounts,
          total: {
            ...timer.total,
            [timer.mode]: totalTime,
          },
          elapsedTime: {
            ...timer.elapsedTime,
            [timer.mode]: 0,
          },
          startedAt: null,
          lastUpdated: Date.now(),
        });
        return;
      }

      updateTimer(storageKey, {
        secondsLeft: remaining,
        total: {
          ...timer.total,
          [timer.mode]: totalTime,
        },
        elapsedTime: {
          ...timer.elapsedTime,
          [timer.mode]: elapsedTime,
        },
        lastUpdated: Date.now(),
      });
    };

    const interval = setInterval(tick, 1000);
    tick();
    return () => clearInterval(interval);
  }, [
    timer.isRunning,
    timer.startedAt,
    timer.mode,
    timer.durations,
    storageKey,
  ]);

  return (
    <div className="timer">
      {isEditingTitle ? (
        <input
          type="text"
          value={editingTitle ?? storageKey}
          onChange={(e) => setEditingTitle(e.target.value)}
          onBlur={handleTitleSubmit}
          onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
          autoFocus
        />
      ) : (
        <h3
          onClick={() => setIsEditingTitle(true)}
          style={{ cursor: "pointer" }}
        >
          {storageKey}
        </h3>
      )}

      <div className="button-row">
        <button className="button button-tertiary" onClick={toggleStart}>
          {timer.isRunning ? "Pause" : "Start"}
        </button>
        <button
          className="button button-tertiary"
          onClick={() => {
            const newMode: Mode =
              timer.mode === "focus" ? "shortBreak" : "focus";
            updateTimer(storageKey, {
              isRunning: false,
              mode: newMode,
              secondsLeft:
                timer.durations[newMode] - timer.elapsedTime[newMode],
              lastUpdated: Date.now(),
            });
          }}
        >
          {timer.mode === "focus" ? "Focus" : "Break"}
        </button>
        <button
          onClick={onRemove}
          className="remove-timer button button-danger"
        >
          X
        </button>
      </div>

      <div className="time-display">
        {isEditingTime ? (
          <input
            type="text"
            value={editableTimeInput}
            onChange={(e) => setEditableTimeInput(e.target.value)}
            onBlur={() => {
              const newSeconds = parseDuration(editableTimeInput);
              if (newSeconds > 0) {
                updateTimer(storageKey, {
                  secondsLeft: newSeconds,
                  durations: {
                    ...timer.durations,
                    [timer.mode]: newSeconds,
                  },
                  lastUpdated: Date.now(),
                });
              }
              setIsEditingTime(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            autoFocus
          />
        ) : (
          <span
            onClick={() => {
              setEditableTimeInput(formatDuration(timer.secondsLeft));
              setIsEditingTime(true);
            }}
            style={{ cursor: "pointer" }}
          >
            {formatTime(timer.secondsLeft)}
          </span>
        )}
      </div>
    </div>
  );
};

export default Timer;
