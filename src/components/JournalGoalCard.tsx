import React, { useEffect, useRef, useState } from "react";
import { JournalGoal } from "../types/journalTypes";
import { useJournal } from "../context/JournalContext";

interface Props {
  goal: JournalGoal;
}

const JournalGoalCard: React.FC<Props> = ({ goal }) => {
  const { updateGoal, deleteGoal } = useJournal();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(goal.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const saveChanges = () => {
    if (editedName.trim() !== goal.name) {
      updateGoal({ ...goal, name: editedName.trim() });
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <div
      onClick={() => setIsEditing(true)}
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
      ) : (
        <span>{goal.name}</span>
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
