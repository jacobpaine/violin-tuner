import React, { useEffect, useState } from "react";
import { JournalTopic } from "../types/journalTypes";
import { useJournal } from "../context/JournalContext";

interface Props {
  topic: JournalTopic;
  selected: boolean;
  onSelect: () => void;
}

const JournalTopicCard: React.FC<Props> = ({ topic, selected, onSelect }) => {
  const { updateTopic, deleteTopic } = useJournal();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(topic.title);
  const [editedFlavor, setEditedFlavor] = useState(topic.flavor);

  const saveChanges = () => {
    updateTopic({ ...topic, title: editedTitle, flavor: editedFlavor });
    setIsEditing(false);
  };

  useEffect(() => {
    if (!selected && isEditing) {
      saveChanges();
      setIsEditing(false);
    }
  }, [selected]);

  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: selected ? "2px solid #007bff" : "1px solid #ccc",
        borderRadius: "8px",
        padding: "12px",
        margin: "8px",
        cursor: "pointer",
        background: selected ? "#e6f0ff" : "#fff",
        transition: "background 0.2s ease",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          style={{
            fontSize: "0.8rem",
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
          }}
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteTopic(topic.id);
          }}
          style={{
            fontSize: "0.8rem",
            background: "none",
            border: "none",
            color: "#dc3545",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>

      {selected && isEditing ? (
        <>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={saveChanges}
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              width: "100%",
              marginBottom: "0.25rem",
            }}
          />
          <textarea
            value={editedFlavor}
            onChange={(e) => setEditedFlavor(e.target.value)}
            onBlur={saveChanges}
            style={{ fontSize: "0.85rem", width: "100%" }}
            rows={2}
          />
        </>
      ) : (
        <div
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "0.25rem",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{topic.title}</div>
          <div style={{ fontSize: "0.85rem", color: "#666" }}>
            {topic.flavor}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalTopicCard;
