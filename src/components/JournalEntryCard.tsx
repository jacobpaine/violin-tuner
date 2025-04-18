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
  const { deleteEntry, goals, updateEntryGoals } = useJournal();

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
            onChange={(e) => setEditableDate(e.target.value)}
            style={{ marginBottom: "0.5rem" }}
          />
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            rows={5}
            style={{ width: "100%" }}
          />
          <div style={{ marginTop: "0.5rem" }}>
            <strong>Tags:</strong>
            <div
              style={{ display: "flex", flexWrap: "wrap", marginTop: "0.5rem" }}
            >
              {goals.map((goal) => (
                <label
                  key={goal.id}
                  style={{ marginRight: "0.5rem", fontSize: "0.9rem" }}
                >
                  <input
                    type="checkbox"
                    checked={entry.goalIds?.includes(goal.id) || false}
                    onChange={() => toggleGoal(goal.id)}
                  />
                  {goal.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntryCard;
