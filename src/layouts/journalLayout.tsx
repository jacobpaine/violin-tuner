import React, { useEffect } from "react";
import JournalTopicsColumn from "../components/JournalTopicColumn";
import JournalEntriesColumn from "../components/JournalEntriesColumn";
import JournalGoalsColumn from "../components/JournalGoalsColumn";
import {
  AppData,
  exportAllData,
  importAllData,
} from "../utils/journalTransfer";
import { startDailyAutoSave } from "../utils/journalUtils";

const handleSave = async () => {
  const data = await exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "journal-data.json";
  a.click();
};

const handleLoad = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    const text = await file.text();
    const data: AppData = JSON.parse(text);
    await importAllData(data);
    window.location.reload();
  };

  input.click();
};

const JournalLayout: React.FC = () => {
  useEffect(() => {
    startDailyAutoSave();
  }, []);
  return (
    <div>
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
      <div
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <button onClick={handleSave}>💾 Save All</button>
        <button onClick={handleLoad}>📂 Load All</button>
      </div>
    </div>
  );
};

export default JournalLayout;
