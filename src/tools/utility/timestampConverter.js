/**
 * Unix Timestamp (Epoch) & Date Converter.
 * Zero external dependencies.
 */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatRelativeTime(targetMs) {
  const now = Date.now();
  const diffSec = Math.round((targetMs - now) / 1000);
  const isPast = diffSec < 0;
  const absSec = Math.abs(diffSec);

  if (absSec < 60) return isPast ? `${absSec} seconds ago` : `in ${absSec} seconds`;
  const minutes = Math.floor(absSec / 60);
  if (minutes < 60) return isPast ? `${minutes} minutes ago` : `in ${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return isPast ? `${hours} hours ago` : `in ${hours} hours`;
  const days = Math.floor(hours / 24);
  return isPast ? `${days} days ago` : `in ${days} days`;
}

/**
 * Converts a Unix epoch timestamp (seconds or milliseconds) to date formats.
 */
export function timestampToDate(timestamp) {
  if (timestamp === "" || timestamp === null || timestamp === undefined) {
    return null;
  }

  let num = Number(timestamp);
  if (isNaN(num)) return { error: "Invalid numeric timestamp." };

  // If 10 digits or less, treat as seconds; otherwise milliseconds
  const isSeconds = Math.abs(num) < 1e11;
  const ms = isSeconds ? num * 1000 : num;

  const date = new Date(ms);
  if (isNaN(date.getTime())) {
    return { error: "Timestamp out of range for valid calendar date." };
  }

  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const year = date.getUTCFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return {
    epochSeconds: Math.floor(ms / 1000),
    epochMilliseconds: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
    relative: formatRelativeTime(ms),
    dayOfWeek: DAYS[date.getUTCDay()],
    dayOfYear,
    isLeapYear,
  };
}

/**
 * Converts a calendar date string (e.g. YYYY-MM-DDTHH:mm) to Unix timestamps.
 */
export function dateToTimestamp(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  const ms = date.getTime();
  return {
    epochSeconds: Math.floor(ms / 1000),
    epochMilliseconds: ms,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString(),
  };
}
