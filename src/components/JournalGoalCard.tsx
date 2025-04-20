import React, { useEffect, useRef, useState } from "react";
import { JournalGoal } from "../types/journalTypes";
import { useJournal } from "../context/JournalContext";

interface Props {
  goal: JournalGoal;
}

const JournalGoalCard: React.FC<Props> = ({ goal }) => {
  const { topics, entries, updateGoal, deleteGoal } = useJournal();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(goal.name);
  const [collapsed, setCollapsed] = useState(true);
  const [editedDescription, setEditedDescription] = useState(
    goal.description ?? ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditing &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        saveChanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedName]);

  const totals = entries.reduce(
    (acc, entry) => {
      const g = entry.goalData?.[goal.id];
      if (g) {
        acc.hours += g.hours || 0;
        acc.money += g.money || 0;
      }
      return acc;
    },
    { hours: 0, money: 0 }
  );

  const saveChanges = () => {
    if (editedName.trim() !== goal.name) {
      updateGoal({ ...goal, name: editedName.trim() });
    }
    setIsEditing(false);
  };

  const handleTargetChange = (
    key: "hourTarget" | "moneyTarget",
    value: number
  ) => {
    updateGoal({ ...goal, [key]: value });
  };

  return (
    <div
      ref={cardRef}
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== "INPUT") {
          setIsEditing(true);
        }
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        borderRadius: "6px",
        padding: "8px",
        marginBottom: "8px",
        background: "#fafafa",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <button
          className={"goal-button"}
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed((prev) => !prev);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#666",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          {collapsed ? "▸" : "▾"}
        </button>

        {isEditing ? (
          <div>
            <input
              ref={inputRef}
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={saveChanges}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveChanges();
                if (e.key === "Escape") setIsEditing(false);
              }}
              style={{ width: "100%" }}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <strong>{goal.name}</strong>
            </div>
          </div>
        )}
        <button
          className={"goal-button"}
          onClick={(e) => {
            e.stopPropagation();
            deleteGoal(goal.id);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#999",
            fontSize: "0.9rem",
            cursor: "pointer",
          }}
        >
          ✖
        </button>
      </div>
      {!collapsed && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "0.8rem",
            marginTop: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
            }}
          >
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              onBlur={() =>
                updateGoal({ ...goal, description: editedDescription.trim() })
              }
              placeholder="Describe this goal..."
              style={{
                width: "100%",
                fontSize: "0.8rem",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "0.5rem",
              }}
              rows={2}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "0.7rem",
              marginTop: "0.5rem",
              justifyContent: "space-around",
            }}
          >
            <div>
              Hours: {totals.hours.toFixed(1)} /
              <input
                type="number"
                defaultValue={goal.hourTarget ?? 100}
                onBlur={(e) =>
                  handleTargetChange(
                    "hourTarget",
                    parseFloat(e.target.value) || 0
                  )
                }
                style={{
                  width: "50px",
                  fontSize: "0.7rem",
                }}
              />
            </div>
            <div>
              Cost: ${totals.money.toFixed(2)} /{" "}
              <input
                type="number"
                defaultValue={goal.moneyTarget ?? 0}
                onBlur={(e) =>
                  handleTargetChange(
                    "moneyTarget",
                    parseFloat(e.target.value) || 0
                  )
                }
                style={{
                  width: "50px",
                  fontSize: "0.7rem",
                }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "0.5rem",
            }}
          >
            <strong style={{ fontSize: "0.8rem" }}>Tag to topics:</strong>
            <div
              style={{
                marginTop: "0.25rem",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {topics.map((topic) => (
                <label
                  key={topic.id}
                  style={{ display: "block", fontSize: "0.8rem" }}
                >
                  <input
                    type="checkbox"
                    checked={goal.topicIds?.includes(topic.id) || false}
                    onChange={(e) => {
                      const topicIds = new Set(goal.topicIds ?? []);
                      if (e.target.checked) {
                        topicIds.add(topic.id);
                      } else {
                        topicIds.delete(topic.id);
                      }
                      updateGoal({ ...goal, topicIds: Array.from(topicIds) });
                    }}
                  />{" "}
                  {topic.title}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalGoalCard;
