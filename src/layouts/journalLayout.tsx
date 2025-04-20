import React from "react";
import JournalTopicsColumn from "../components/JournalTopicColumn";
import JournalEntriesColumn from "../components/JournalEntriesColumn";
import JournalGoalsColumn from "../components/JournalGoalsColumn";

const JournalLayout: React.FC = () => {
  return (
    <div className="journal-layout">
      <div className="journal-column journal-column-1">
        <JournalTopicsColumn />
      </div>
      <div className="journal-column journal-column-2">
        <JournalEntriesColumn />
      </div>
      <div className="journal-column journal-column-3">
        <JournalGoalsColumn />
      </div>
    </div>
  );
};

export default JournalLayout;
