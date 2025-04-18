export const getToday = () => new Date().toISOString().split('T')[0];

export const formatDisplayDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export const isSameDay = (a: string, b: string) => {
  const dateA = new Date(a).toDateString();
  const dateB = new Date(b).toDateString();
  return dateA === dateB;
};
