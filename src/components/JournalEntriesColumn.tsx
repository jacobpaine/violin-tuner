import React from "react";
import { useJournal } from "../context/JournalContext";
import JournalEntryCard from "./JournalEntryCard";
import { getToday } from "../utils/journalUtils";
import { v4 as uuidv4 } from "uuid";
import { JournalEntry } from "../types/journalTypes";

const JournalEntriesColumn: React.FC = () => {
  const { selectedTopicId, entries, addEntry } = useJournal();

  if (!selectedTopicId) {
    return (
      <div style={{ padding: "1rem" }}>
        Select a topic to view journal entries.
      </div>
    );
  }

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: uuidv4(),
      topicId: selectedTopicId,
      date: getToday(),
      content: "",
    };
    addEntry(newEntry);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Journal Entries</h3>
      <button onClick={handleNewEntry} style={{ marginBottom: "1rem" }}>
        + New Entry
      </button>

      {entries
        .sort((a: { date: any }, b: { date: string }) =>
          b.date.localeCompare(a.date)
        )
        .map((entry: { id: any }) => (
          <JournalEntryCard key={entry.id} entry={entry} />
        ))}
    </div>
  );
};

export default JournalEntriesColumn;
