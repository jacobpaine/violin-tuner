export interface JournalEntry {
  id: string;
  topicId: string;
  date: string; // ISO date string
  content: string;
  collapsed?: boolean;
  goalIds?: string[];
  goalData?: {
  [goalId: string]: {
    hours: number;
    money: number;
  };
};
}

export interface JournalGoal {
  id: string;
  name: string;
  hourTarget?: number;
  moneyTarget?: number;
}

export interface JournalTopic {
  id: string;
  title: string;
  flavor: string;
}

export interface JournalContextType {
  topics: JournalTopic[];
  selectedTopicId: string | null;
  selectTopic: (id: string) => void;
  addTopic: (topic: JournalTopic) => void;
  entries: JournalEntry[];
  addEntry: (entry: JournalEntry) => void;
  updateEntryGoals: (entryId: string, goalIds: string[]) => void;
  goals: JournalGoal[];
  addGoal: (goal: JournalGoal) => void;
}