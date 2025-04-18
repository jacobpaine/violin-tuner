import React, { useEffect, useState } from "react";
import { useJournal } from "../context/JournalContext";
import JournalGoalCard from "./JournalGoalCard";
import { v4 as uuidv4 } from "uuid";
import "../App.css";

const JournalGoalsColumn: React.FC = () => {
  const { goals, addGoal } = useJournal();

  const handleAddBlankGoal = () => {
    const newGoal = {
      id: uuidv4(),
      name: "",
    };
    addGoal(newGoal);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3 className="column-header">Goals</h3>

      <button onClick={handleAddBlankGoal} style={{ marginBottom: "1rem" }}>
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
