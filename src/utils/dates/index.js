export function toDateInputValue(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getWeekStart(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  return start;
}

export function getMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getPreviousMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

export function getNextMonthStart(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

export function isOnOrAfter(transactionDate, startDate) {
  return new Date(`${transactionDate}T00:00:00`) >= startDate;
}

export function isBefore(transactionDate, endDate) {
  return new Date(`${transactionDate}T00:00:00`) < endDate;
}

export function isWithinRange(transactionDate, startDate, endDate) {
  return isOnOrAfter(transactionDate, startDate) && isBefore(transactionDate, endDate);
}
