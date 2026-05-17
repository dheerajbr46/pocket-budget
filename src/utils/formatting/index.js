export { formatCurrency } from '../currency/index.js';

export function formatShortDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
}

export function formatGroupDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date(`${value}T00:00:00`));
}
