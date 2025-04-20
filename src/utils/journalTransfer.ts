import { JournalEntry, JournalGoal, JournalTopic } from "../types/journalTypes";
import { set, get, keys, del } from "idb-keyval";

export interface AppData {
  topics: JournalTopic[];
  goals: JournalGoal[];
  entries: JournalEntry[];
}

export const exportAllData = async (): Promise<AppData> => {
  const allKeys = await keys();

  const topicKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('topic-'));
  const goalKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('goal-'));
  const entryKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('entry-'));

  const topics = await Promise.all(topicKeys.map((key) => get(key)));
  const goals = await Promise.all(goalKeys.map((key) => get(key)));
  const entries = await Promise.all(entryKeys.map((key) => get(key)));

  return {
    topics: topics.filter(Boolean) as JournalTopic[],
    goals: goals.filter(Boolean) as JournalGoal[],
    entries: entries.filter(Boolean) as JournalEntry[],
  };
};


export const importAllData = async (data: AppData): Promise<void> => {
  const allKeys = await keys();
  await Promise.all(allKeys.map((key) => del(key)));

  const allWrites = [
    ...data.topics.map((t) => set(`topic-${t.id}`, t)),
    ...data.goals.map((g) => set(`goal-${g.id}`, g)),
    ...data.entries.map((e) => set(`entry-${e.id}`, e)),
  ];

  await Promise.all(allWrites);
};
