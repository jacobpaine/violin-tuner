import React, { useState } from "react";
import { useJournal } from "../context/JournalContext";
import JournalGoalCard from "./JournalGoalCard";
import { v4 as uuidv4 } from "uuid";

const JournalGoalsColumn: React.FC = () => {
  const { goals, addGoal } = useJournal();
  const [goalName, setGoalName] = useState("");

  const handleAdd = () => {
    if (!goalName.trim()) return;
    addGoal({ id: uuidv4(), name: goalName.trim() });
    setGoalName("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Goals</h3>

      <input
        type="text"
        placeholder="New goal..."
        value={goalName}
        onChange={(e) => setGoalName(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button onClick={handleAdd} style={{ marginBottom: "1rem" }}>
        + Add Goal
      </button>

      {[...goals]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((goal) => (
          <JournalGoalCard key={goal.id} goal={goal} />
        ))}
    </div>
  );
};

export default JournalGoalsColumn;
