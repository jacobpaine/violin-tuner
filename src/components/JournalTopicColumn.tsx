import React, { useState } from "react";
import { useJournal } from "../context/JournalContext";
import JournalTopicCard from "./JournalTopicCard";
import { v4 as uuidv4 } from "uuid";

const JournalTopicsColumn: React.FC = () => {
  const { topics, selectedTopicId, selectTopic, addTopic } = useJournal();
  const [titleInput, setTitleInput] = useState("");
  const [flavorInput, setFlavorInput] = useState("");

  const handleAdd = () => {
    if (!titleInput.trim()) return;
    addTopic({
      id: uuidv4(),
      title: titleInput.trim(),
      flavor: flavorInput.trim(),
    });
    setTitleInput("");
    setFlavorInput("");
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Topics</h3>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Title"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />
        <button onClick={handleAdd}>Add Topic</button>
      </div>

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
