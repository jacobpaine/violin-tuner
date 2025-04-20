import React, { createContext, useContext, useState, useEffect } from "react";
import { JournalTopic, JournalEntry, JournalGoal } from "../types/journalTypes";
import {
  getAllTopics,
  saveTopic,
  deleteTopic as deleteTopicFromDB,
  getEntriesByTopic,
  saveEntry,
  getAllGoals,
  saveGoal,
  deleteEntry as deleteEntryFromDB,
  deleteGoal as deleteGoalFromDB,
} from "../utils/indexDb";

interface JournalContextType {
  topics: JournalTopic[];
  selectedTopicId: string | null;
  selectTopic: (id: string) => void;
  addTopic: (topic: JournalTopic) => void;
  updateTopic: (updated: JournalTopic) => void;
  deleteTopic: (topicId: string) => void;
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntryGoals: (entryId: string, goalIds: string[]) => void;
  deleteEntry: (entryId: string) => void;
  goals: JournalGoal[];
  addGoal: (goal: JournalGoal) => void;
  updateGoal: (goal: JournalGoal) => void;
  deleteGoal: (goalId: string) => void;
  updateEntryGoalData: (
    entryId: string,
    goalId: string,
    data: { hours: number; money: number }
  ) => void;
  updateEntryContent: (
    entryId: string,
    updates: Partial<Pick<JournalEntry, "content" | "date">>
  ) => void;
  enrichEntriesWithTopicGoals: (
    entries: JournalEntry[],
    topicId: string,
    goals: JournalGoal[]
  ) => JournalEntry[];
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [topics, setTopics] = useState<JournalTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<JournalGoal[]>([]);

  useEffect(() => {
    getAllTopics().then(setTopics);
    getAllGoals().then(setGoals);
  }, []);

  useEffect(() => {
    if (selectedTopicId) {
      getEntriesByTopic(selectedTopicId).then((loadedEntries) => {
        const enriched = enrichEntriesWithTopicGoals(
          loadedEntries,
          selectedTopicId,
          goals
        );
        setEntries(enriched);
      });
    } else {
      setEntries([]);
    }
  }, [selectedTopicId, goals]);

  const selectTopic = (id: string) => setSelectedTopicId(id);

  const deleteTopic = async (topicId: string) => {
    await deleteTopicFromDB(topicId);
    setTopics((prev) => prev.filter((t) => t.id !== topicId));
    // Optionally deselect the topic if it was selected
    if (selectedTopicId === topicId) {
      setSelectedTopicId(null);
      setEntries([]);
    }
  };

  const addTopic = async (topic: JournalTopic) => {
    await saveTopic(topic);
    setTopics((prev) => [...prev, topic]);
  };

  const addEntry = async (entry: JournalEntry) => {
    await saveEntry(entry);
    setEntries((prev) => [...prev, entry]);
  };

  const updateEntryContent = async (
    entryId: string,
    updates: Partial<Pick<JournalEntry, "content" | "date">>
  ) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === entryId ? { ...entry, ...updates } : entry
    );

    const updated = updatedEntries.find((e) => e.id === entryId);
    if (updated) {
      await saveEntry(updated);
    }

    setEntries(updatedEntries);
  };

  const updateEntryGoals = async (entryId: string, goalIds: string[]) => {
    const updated = entries.map((entry) =>
      entry.id === entryId ? { ...entry, goalIds } : entry
    );
    const entry = updated.find((e) => e.id === entryId);
    if (entry) {
      await saveEntry(entry);
    }
    setEntries(updated);
  };

  const enrichEntriesWithTopicGoals = (
    entries: JournalEntry[],
    topicId: string,
    goals: JournalGoal[]
  ): JournalEntry[] => {
    const matchingGoalIds = goals
      .filter((goal) => goal.topicIds?.includes(topicId))
      .map((goal) => goal.id);

    return entries.map((entry) => {
      const goalData: JournalEntry["goalData"] = {};

      for (const goalId of matchingGoalIds) {
        goalData[goalId] = entry.goalData?.[goalId] ?? { hours: 0, money: 0 };
      }

      return {
        ...entry,
        goalIds: matchingGoalIds,
        goalData,
      };
    });
  };

  const updateTopic = async (updated: JournalTopic) => {
    await saveTopic(updated);
    setTopics((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteEntry = async (entryId: string) => {
    await deleteEntryFromDB(entryId);
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
  };

  const deleteGoal = async (goalId: string) => {
    await deleteGoalFromDB(goalId);
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const addGoal = async (goal: JournalGoal) => {
    await saveGoal(goal);
    setGoals((prev) => [...prev, goal]);
  };

  const updateGoal = async (goal: JournalGoal) => {
    await saveGoal(goal);
    setGoals((prev) => prev.map((g) => (g.id === goal.id ? goal : g)));
  };

  const updateEntryGoalData = async (
    entryId: string,
    goalId: string,
    data: { hours: number; money: number }
  ) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            goalData: {
              ...entry.goalData,
              [goalId]: data,
            },
          }
        : entry
    );

    const updated = updatedEntries.find((e) => e.id === entryId);
    if (updated) {
      await saveEntry(updated);
    }

    setEntries(updatedEntries);
  };

  return (
    <JournalContext.Provider
      value={{
        topics,
        selectedTopicId,
        selectTopic,
        addTopic,
        updateTopic,
        deleteTopic,
        entries,
        addEntry,
        deleteEntry,
        updateEntryContent,
        updateEntryGoals,
        updateEntryGoalData,
        enrichEntriesWithTopicGoals,
        goals,
        addGoal,
        deleteGoal,
        updateGoal,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context)
    throw new Error("useJournal must be used within a JournalProvider");
  return context;
};
