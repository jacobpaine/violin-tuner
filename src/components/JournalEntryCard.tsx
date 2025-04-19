import React, { useState } from "react";
import { JournalEntry } from "../types/journalTypes";
import { formatDisplayDate } from "../utils/journalUtils";
import { useJournal } from "../context/JournalContext";

interface Props {
  entry: JournalEntry;
}

const JournalEntryCard: React.FC<Props> = ({ entry }) => {
  const [collapsed, setCollapsed] = useState(entry.collapsed ?? false);
  const [editableContent, setEditableContent] = useState(entry.content);
  const [editableDate, setEditableDate] = useState(entry.date);
  const {
    deleteEntry,
    goals,
    updateEntryGoals,
    updateEntryGoalData,
    updateEntryContent,
  } = useJournal();

  const toggleGoal = (goalId: string) => {
    const current = entry.goalIds || [];
    const next = current.includes(goalId)
      ? current.filter((id) => id !== goalId)
      : [...current, goalId];
    updateEntryGoals(entry.id, next);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "1rem",
      }}
    >
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: "flex",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "0.5rem",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
        }}
      >
        {formatDisplayDate(editableDate)}
        <button
          onClick={() => deleteEntry(entry.id)}
          style={{
            background: "transparent",
            color: "#999",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          ✖
        </button>
      </div>

      {!collapsed && (
        <div>
          <input
            type="date"
            value={editableDate}
            onChange={(e) => {
              setEditableDate(e.target.value);
              updateEntryContent(entry.id, { date: e.target.value });
            }}
            style={{ marginBottom: "0.5rem" }}
          />
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            onBlur={() =>
              updateEntryContent(entry.id, { content: editableContent })
            }
            rows={5}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <div style={{ color: "#fff", marginTop: "0.5rem" }}>
            <strong>Tags:</strong>
            <div
              style={{ display: "flex", flexWrap: "wrap", marginTop: "0.5rem" }}
            >
              {goals.map((goal) => {
                const goalMetrics = entry.goalData?.[goal.id] || {
                  hours: 0,
                  money: 0,
                };

                return (
                  <div key={goal.id} style={{ marginBottom: "0.5rem" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={entry.goalIds?.includes(goal.id) || false}
                        onChange={() => toggleGoal(goal.id)}
                      />{" "}
                      {goal.name}
                    </label>
                    {entry.goalIds?.includes(goal.id) && (
                      <div style={{ marginLeft: "1rem" }}>
                        <label>Hours:</label>
                        <input
                          type="number"
                          value={goalMetrics.hours}
                          onChange={(e) =>
                            updateEntryGoalData(entry.id, goal.id, {
                              ...goalMetrics,
                              hours: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Hours"
                          style={{ width: "60px", marginRight: "0.5rem" }}
                        />
                        <label>$:</label>
                        <input
                          type="number"
                          value={goalMetrics.money}
                          onChange={(e) =>
                            updateEntryGoalData(entry.id, goal.id, {
                              ...goalMetrics,
                              money: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="$"
                          style={{ width: "60px" }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntryCard;
