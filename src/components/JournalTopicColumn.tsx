import React from "react";
import { useJournal } from "../context/JournalContext";
import JournalTopicCard from "./JournalTopicCard";
import { v4 as uuidv4 } from "uuid";
import "../App.css";

const JournalTopicsColumn: React.FC = () => {
  const { topics, selectedTopicId, selectTopic, addTopic } = useJournal();

  const handleAddBlankTopic = () => {
    const newTopic = {
      id: uuidv4(),
      title: "",
      flavor: "",
    };
    addTopic(newTopic);
    selectTopic(newTopic.id); // auto-select so it opens in edit mode
  };

  return (
    <div
      style={{
        padding: "1rem",
      }}
    >
      <h3 className="column-header">Topics</h3>
      <button onClick={handleAddBlankTopic}>+ Add Topic</button>

      {topics.map((topic) => (
        <JournalTopicCard
          key={topic.id}
          topic={topic}
          selected={topic.id === selectedTopicId}
          onSelect={() => selectTopic(topic.id)}
        />
      ))}
    </div>
  );
};

export default JournalTopicsColumn;
