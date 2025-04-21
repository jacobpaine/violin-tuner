import "../styles/Timer.css";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import { EditableField } from "./EditableField";
import { EditableNumberField } from "./EditableNumberField";
import { Goal } from "../types/timerTypes";
import { exportDataAsJSON, importDataFromJSON } from "../utils/timerUtils";
import { useTimerContext } from "../context/TimerContext";
import Summary from "./Summary";

function TimerHome() {
  const { timers, addTimer, removeTimer, updateTimer } = useTimerContext();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const timerKeys = Object.keys(timers).sort();

  useEffect(() => {
    const saved = localStorage.getItem("goals");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setGoals(parsed);
        }
      } catch (err) {
        console.warn("Failed to parse saved goals", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = () => {
    setGoals((prev) => [
      ...prev,
      {
        id: `goal-${Date.now()}`,
        name: "",
        hours: 1,
        completed: false,
        description: "",
      },
    ]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal))
    );
  };

  const toggleComplete = (id: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const removeGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div>
        <div className="app">
          <div className="layout">
            <div className="panels">
              <div className="left-panel">
                <h2>Goals</h2>
                <button className="button button-primary" onClick={addGoal}>
                  + Add Goal
                </button>
                <div className="goals-list">
                  {goals
                    .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
                    .map((goal) => {
                      const isEditing = editingId === goal.id;
                      const score = goal?.linkedTo
                        ? timers[goal.linkedTo]?.total?.focus || 0
                        : 0;
                      const goalMet = score >= goal.hours;
                      return (
                        <div
                          key={goal.id}
                          style={{
                            backgroundColor: goalMet ? "#d4edda" : undefined,
                          }}
                          className="card"
                        >
                          <div className="goal-row">
                            <select
                              value={goal.linkedTo || ""}
                              onChange={(e) =>
                                updateGoal(goal.id, {
                                  linkedTo: e.target.value,
                                })
                              }
                            >
                              <option value="">(Not linked)</option>
                              {timerKeys.map((key) => (
                                <option key={key} value={key}>
                                  {key}
                                </option>
                              ))}
                            </select>

                            <input
                              type="checkbox"
                              checked={goal.completed}
                              onChange={() => toggleComplete(goal.id)}
                            />
                            {isEditing ? (
                              <EditableField
                                value={goal.name}
                                onChange={(newName) =>
                                  updateGoal(goal.id, { name: newName })
                                }
                              />
                            ) : (
                              <div
                                onClick={() => setEditingId(goal.id)}
                                className={`goal-name-display ${
                                  goal.completed ? "strike" : ""
                                }`}
                              >
                                {goal.name || (
                                  <span style={{ color: "#aaa" }}>
                                    Click to add name
                                  </span>
                                )}
                              </div>
                            )}
                            <EditableNumberField
                              value={goal.hours}
                              onChange={(val) =>
                                updateGoal(goal.id, { hours: val })
                              }
                            />
                            <button
                              onClick={() => removeGoal(goal.id)}
                              className="remove-goal-button"
                              title="Remove goal"
                            >
                              ❌
                            </button>
                          </div>
                          <textarea
                            className={`goal-description ${
                              goal.completed ? "strike" : ""
                            }`}
                            value={goal.description}
                            onChange={(e) =>
                              updateGoal(goal.id, {
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe your goal..."
                          />
                        </div>
                      );
                    })}
                </div>

                <h2>Totals</h2>
                {timerKeys.map((key) => {
                  const timer = timers[key];
                  if (!timer) return null;
                  const focus = timer?.total?.focus || 0;
                  const shortBreak = timer?.total?.shortBreak || 0;
                  return (
                    <div className="time-display" key={key}>
                      <strong>{key}</strong>:<label> 🎯 </label>{" "}
                      <EditableNumberField
                        value={focus}
                        onChange={(val) =>
                          updateTimer(key, {
                            total: {
                              ...timer.total,
                              focus: val,
                            },
                          })
                        }
                      />
                      <label> ☕ </label>
                      <EditableNumberField
                        value={shortBreak}
                        onChange={(val) =>
                          updateTimer(key, {
                            total: {
                              ...timer.total,
                              shortBreak: val,
                            },
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>

              <div className="right-panel">
                <button
                  className="add-timer button button-primary"
                  onClick={() => addTimer(`Timer ${timerKeys.length + 1}`)}
                >
                  + Add Timer
                </button>

                <div className="timers-column">
                  {timerKeys.map((key) => (
                    <div key={key} className="timer-row-ui card">
                      <Timer
                        storageKey={key}
                        onRemove={() => removeTimer(key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="buttonBox">
          <button
            className="button button-secondary"
            onClick={() => exportDataAsJSON({ goals, timers })}
          >
            Download Data
          </button>
          <button
            className="button button-secondary"
            onClick={() =>
              importDataFromJSON((data) => {
                const timerTitles = Object.keys(data.timers || {});
                setGoals(data.goals || []);
                timerTitles.forEach((key) => addTimer(key, data.timers[key]));
              })
            }
          >
            Load Data
          </button>
        </div>
      </div>
      <hr />
      <Summary initialDays={1825} />
    </div>
  );
}

export default TimerHome;
