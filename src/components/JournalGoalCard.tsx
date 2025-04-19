import React, { useEffect, useRef, useState } from "react";
import { JournalGoal } from "../types/journalTypes";
import { useJournal } from "../context/JournalContext";

interface Props {
  goal: JournalGoal;
}

const JournalGoalCard: React.FC<Props> = ({ goal }) => {
  const { entries, updateGoal, deleteGoal } = useJournal();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(goal.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        saveChanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedName]);

  const totals = entries.reduce(
    (acc, entry) => {
      const g = entry.goalData?.[goal.id];
      if (g) {
        acc.hours += g.hours || 0;
        acc.money += g.money || 0;
      }
      return acc;
    },
    { hours: 0, money: 0 }
  );

  const saveChanges = () => {
    if (editedName.trim() !== goal.name) {
      updateGoal({ ...goal, name: editedName.trim() });
    }
    setIsEditing(false);
  };

  const handleTargetChange = (
    key: "hourTarget" | "moneyTarget",
    value: number
  ) => {
    updateGoal({ ...goal, [key]: value });
  };

  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== "INPUT") {
          setIsEditing(true);
        }
      }}
      style={{
        position: "relative",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "8px",
        marginBottom: "8px",
        background: "#fafafa",
        cursor: "pointer",
      }}
    >
      {isEditing ? (
        <div>
          <input
            ref={inputRef}
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={saveChanges}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveChanges();
              if (e.key === "Escape") setIsEditing(false);
            }}
            style={{ width: "100%" }}
          />
          <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
            <div>
              Hours: {totals.hours.toFixed(1)} /{" "}
              <input
                type="number"
                defaultValue={goal.hourTarget ?? 100}
                onBlur={(e) =>
                  handleTargetChange(
                    "hourTarget",
                    parseFloat(e.target.value) || 0
                  )
                }
                style={{ width: "60px" }}
              />
            </div>
            <div>
              Cost: ${totals.money.toFixed(2)} /{" "}
              <input
                type="number"
                defaultValue={goal.moneyTarget ?? 0}
                onBlur={(e) =>
                  handleTargetChange(
                    "moneyTarget",
                    parseFloat(e.target.value) || 0
                  )
                }
                style={{ width: "60px" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
          <div style={{ position: "absolute" }}>🖋️</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <strong>{goal.name}</strong>
          </div>
          <div>
            Hours: {totals.hours.toFixed(1)} /{" "}
            <input
              type="number"
              defaultValue={goal.hourTarget ?? 100}
              onBlur={(e) =>
                handleTargetChange(
                  "hourTarget",
                  parseFloat(e.target.value) || 0
                )
              }
              style={{ width: "60px" }}
            />
          </div>
          <div>
            Cost: ${totals.money.toFixed(2)} /{" "}
            <input
              type="number"
              defaultValue={goal.moneyTarget ?? 0}
              onBlur={(e) =>
                handleTargetChange(
                  "moneyTarget",
                  parseFloat(e.target.value) || 0
                )
              }
              style={{ width: "60px" }}
            />
          </div>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteGoal(goal.id);
        }}
        style={{
          position: "absolute",
          top: "4px",
          right: "6px",
          background: "transparent",
          border: "none",
          color: "#999",
          fontSize: "0.9rem",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
};

export default JournalGoalCard;
