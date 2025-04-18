import React from "react";
import JournalTopicsColumn from "../components/JournalTopicColumn";
import JournalEntriesColumn from "../components/JournalEntriesColumn";
import JournalGoalsColumn from "../components/JournalGoalsColumn";

const JournalLayout: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      {/* Column 1: Topics */}
      <div
        style={{ flex: "1", borderRight: "1px solid #ccc", overflowY: "auto" }}
      >
        <JournalTopicsColumn />
      </div>

      {/* Column 2: Entries */}
      <div
        style={{
          flex: "1.5",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <JournalEntriesColumn />
      </div>

      {/* Column 3: Goals */}
      <div style={{ flex: "1", overflowY: "auto" }}>
        <JournalGoalsColumn />
      </div>
    </div>
  );
};

export default JournalLayout;
