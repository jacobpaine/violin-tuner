import React, { useState } from "react";
import { JournalEntry } from "../types/journalTypes";
import { formatDisplayDate } from "../utils/journalUtils";
import { useJournal } from "../context/JournalContext";

interface Props {
  entry: JournalEntry;
}

const JournalEntryCard: React.FC<Props> = ({ entry }) => {
  const [collapsed, setCollapsed] = useState(entry.collapsed ?? true);
  const [editableContent, setEditableContent] = useState(entry.content);
  const [editableDate, setEditableDate] = useState(entry.date);
  const { deleteEntry, goals, updateEntryGoalData, updateEntryContent } =
    useJournal();

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
            rows={15}
            style={{ width: "100%", marginBottom: "0.5rem" }}
          />
          <div style={{ color: "#fff", marginTop: "0.5rem" }}>
            <strong>Tags:</strong>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: "0.5rem",
                justifyContent: "space-around",
              }}
            >
              {entry.goalIds?.map((goalId) => {
                const goal = goals.find((g) => g.id === goalId);
                const metrics = entry.goalData?.[goalId] ?? {
                  hours: 0,
                  money: 0,
                };

                return goal ? (
                  <div key={goalId} style={{ marginBottom: "0.5rem" }}>
                    <strong>{goal.name}</strong>
                    <div>
                      <label>
                        Hours:
                        <input
                          type="number"
                          value={metrics.hours}
                          onChange={(e) =>
                            updateEntryGoalData(entry.id, goalId, {
                              ...metrics,
                              hours: parseFloat(e.target.value) || 0,
                            })
                          }
                          style={{ width: "60px", marginLeft: "0.5rem" }}
                        />
                      </label>
                    </div>
                    <div>
                      <label>
                        Cost:
                        <input
                          type="number"
                          value={metrics.money}
                          onChange={(e) =>
                            updateEntryGoalData(entry.id, goalId, {
                              ...metrics,
                              money: parseFloat(e.target.value) || 0,
                            })
                          }
                          style={{ width: "60px", marginLeft: "0.5rem" }}
                        />
                      </label>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntryCard;
