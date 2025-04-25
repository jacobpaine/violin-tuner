import { exportAllData } from "./journalTransfer";

export const getToday = () => new Date().toISOString().split('T')[0];

export const formatDisplayDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export const isSameDay = (a: string, b: string) => {
  const dateA = new Date(a).toDateString();
  const dateB = new Date(b).toDateString();
  return dateA === dateB;
};


export const startDailyAutoSave = () => {
  const saveBackup = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

    const today = new Date().toISOString().split('T')[0];
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-backup-${today}.json`;
    a.click();
  };

  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  const lastSaved = localStorage.getItem('lastAutoSaveDate');
  const today = new Date().toISOString().split('T')[0];

  if (lastSaved !== today) {
    saveBackup();
    localStorage.setItem('lastAutoSaveDate', today);
  }

  setInterval(() => {
    const currentToday = new Date().toISOString().split('T')[0];
    const last = localStorage.getItem('lastAutoSaveDate');

    if (last !== currentToday) {
      saveBackup();
      localStorage.setItem('lastAutoSaveDate', currentToday);
    }
  }, ONE_DAY_MS);
};
