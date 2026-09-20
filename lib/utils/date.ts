const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export function formatDateOnly(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateOnly(value: string): Date {
  const match = DATE_ONLY_PATTERN.exec(value);

  if (!match) return new Date(value);

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}
