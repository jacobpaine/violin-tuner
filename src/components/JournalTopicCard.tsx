import React, { useEffect, useRef, useState } from "react";
import { JournalTopic } from "../types/journalTypes";
import { useJournal } from "../context/JournalContext";
import ConfirmModal from "./ConfirmModal";

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
  const [showConfirm, setShowConfirm] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        cardRef.current &&
        !cardRef.current.contains(event.target as Node)
      ) {
        saveChanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedTitle, editedFlavor]);

  return (
    <div
      ref={cardRef}
      onClick={onSelect}
      style={{
        border: selected ? "2px solid #007bff" : "1px solid #e0e0e0",
        borderRadius: "12px",
        padding: ".25rem",
        margin: "0.5rem 0",
        cursor: "pointer",
        background: selected ? "#f0f7ff" : "#fff",
        boxShadow: selected
          ? "0 2px 8px rgba(0, 123, 255, 0.15)"
          : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          opacity: selected ? 1 : 0.5,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirm(true);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#dc3545",
            cursor: "pointer",
            fontSize: "0.85rem",
          }}
        >
          ✖
        </button>
      </div>
      {showConfirm && (
        <ConfirmModal
          message={`Are you sure you want to delete "${topic.title}"? This will delete all entries associated with this topic.`}
          onConfirm={() => {
            deleteTopic(topic.id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
      {selected && isEditing ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={saveChanges}
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              marginBottom: "0.25rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "100%",
            }}
          />
          <textarea
            value={editedFlavor}
            onChange={(e) => setEditedFlavor(e.target.value)}
            onBlur={saveChanges}
            style={{
              fontSize: "0.85rem",
              border: "1px solid #ccc",
              borderRadius: "6px",
              width: "100%",
              resize: "none",
            }}
            rows={3}
          />
        </div>
      ) : (
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            marginBottom: "0.25rem",
            textAlign: "center",
            color: "#333",
            lineHeight: "1.4",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{topic.title}</div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#666",
              textAlign: "center",
              lineHeight: "1.3",
              whiteSpace: "pre-wrap",
            }}
          >
            {topic.flavor}
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalTopicCard;
