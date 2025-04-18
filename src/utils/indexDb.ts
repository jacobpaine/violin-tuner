import { get, set, update, del, keys } from 'idb-keyval';
import { JournalEntry, JournalGoal } from '../types/journalTypes';

export const saveTopic = async (topic: any) => {
  await set(`topic-${topic.id}`, topic);
};

export const getAllTopics = async (): Promise<any[]> => {
  const allKeys = await keys();
  const topicKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('topic-'));
  const all = await Promise.all(topicKeys.map((key) => get(key)));
  return all.filter(Boolean);
};

export const saveEntry = async (entry: any) => {
  await set(`entry-${entry.id}`, entry);
};

export const getEntriesByTopic = async (topicId: string): Promise<JournalEntry[]> => {
  const allKeys = await keys();
  const entryKeys = allKeys.filter(
    (k): k is string => typeof k === 'string' && k.startsWith('entry-')
  );
  const allEntries = await Promise.all(entryKeys.map((key) => get(key)));
  return allEntries.filter(
    (entry): entry is JournalEntry => entry?.topicId === topicId
  );
};

export const saveGoal = async (goal: any) => {
  await set(`goal-${goal.id}`, goal);
};

export const getAllGoals = async (): Promise<JournalGoal[]> => {
  const allKeys = await keys();
  const goalKeys = allKeys.filter(
    (k): k is string => typeof k === 'string' && k.startsWith('goal-')
  );
  const allGoals = await Promise.all(goalKeys.map((key) => get(key)));
  return allGoals.filter((goal): goal is JournalGoal => Boolean(goal));
};

export const deleteEntry = async (entryId: string) => {
  await del(`entry-${entryId}`);
};

export const deleteGoal = async (goalId: string) => {
  await del(`goal-${goalId}`);
};

export const deleteTopic = async (topicId: string) => {
  await del(`topic-${topicId}`);
};