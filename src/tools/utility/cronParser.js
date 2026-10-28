/**
 * Client-Side Cron Expression Parser, Explainer & Next Execution Calculator.
 * Supports standard 5-part cron syntax: [minute] [hour] [day-of-month] [month] [day-of-week].
 * 100% pure JavaScript with zero external dependencies.
 */

export const CRON_PRESETS = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every 15 minutes", cron: "*/15 * * * *" },
  { label: "Every 30 minutes", cron: "*/30 * * * *" },
  { label: "Every hour at minute 0", cron: "0 * * * *" },
  { label: "Every day at midnight (00:00)", cron: "0 0 * * *" },
  { label: "Every day at 8:00 AM", cron: "0 8 * * *" },
  { label: "Every day at noon (12:00)", cron: "0 12 * * *" },
  { label: "Every Monday at 9:00 AM", cron: "0 9 * * 1" },
  { label: "Weekdays (Mon-Fri) at 9:00 AM", cron: "0 9 * * 1-5" },
  { label: "Weekends (Sat-Sun) at 10:00 AM", cron: "0 10 * * 0,6" },
  { label: "1st of every month at midnight", cron: "0 0 1 * *" },
  { label: "Quarterly (1st of Jan, Apr, Jul, Oct)", cron: "0 0 1 1,4,7,10 *" },
];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const DOW_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

/**
 * Validates a single cron field with range and step syntax.
 * @param {string} field
 * @param {number} min
 * @param {number} max
 * @returns {boolean}
 */
function isValidCronField(field, min, max) {
  if (field === "*") return true;

  // Step: */5 or 10-50/5
  if (field.includes("/")) {
    const parts = field.split("/");
    if (parts.length !== 2) return false;
    const step = parseInt(parts[1], 10);
    if (isNaN(step) || step <= 0) return false;
    if (parts[0] === "*") return true;
    return isValidCronField(parts[0], min, max);
  }

  // Lists: 1,2,3
  if (field.includes(",")) {
    const items = field.split(",");
    return items.every((item) => isValidCronField(item, min, max));
  }

  // Ranges: 1-5
  if (field.includes("-")) {
    const [startStr, endStr] = field.split("-");
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (isNaN(start) || isNaN(end)) return false;
    return start >= min && end <= max && start <= end;
  }

  const num = parseInt(field, 10);
  return !isNaN(num) && num >= min && num <= max;
}

/**
 * Parses a 5-part cron expression and checks its validity.
 * @param {string} cron
 * @returns {{ valid: boolean, parts: string[], error?: string }}
 */
export function parseCron(cron = "") {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      valid: false,
      parts: [],
      error: `Expected 5 space-separated parts (minute, hour, day, month, weekday), got ${parts.length}.`,
    };
  }

  const [min, hour, dom, month, dow] = parts;

  if (!isValidCronField(min, 0, 59)) {
    return { valid: false, parts, error: `Invalid minute field '${min}'. Must be between 0 and 59.` };
  }
  if (!isValidCronField(hour, 0, 23)) {
    return { valid: false, parts, error: `Invalid hour field '${hour}'. Must be between 0 and 23.` };
  }
  if (!isValidCronField(dom, 1, 31)) {
    return { valid: false, parts, error: `Invalid day-of-month field '${dom}'. Must be between 1 and 31.` };
  }
  if (!isValidCronField(month, 1, 12)) {
    return { valid: false, parts, error: `Invalid month field '${month}'. Must be between 1 and 12.` };
  }
  if (!isValidCronField(dow, 0, 7)) {
    return { valid: false, parts, error: `Invalid day-of-week field '${dow}'. Must be between 0 and 7 (0 or 7 is Sunday).` };
  }

  return {
    valid: true,
    parts: [min, hour, dom, month, dow],
  };
}

/**
 * Generates an English human-readable explanation for a cron expression.
 * @param {string} cron
 * @returns {string}
 */
export function explainCron(cron = "") {
  const parseResult = parseCron(cron);
  if (!parseResult.valid) {
    return parseResult.error || "Invalid cron expression";
  }

  const [min, hour, dom, month, dow] = parseResult.parts;

  // Handle common shorthand patterns
  if (cron.trim() === "* * * * *") return "Every minute, every day";
  if (cron.trim() === "0 * * * *") return "Every hour, at minute 0";
  if (cron.trim() === "0 0 * * *") return "Every day at midnight (00:00)";
  if (cron.trim() === "0 12 * * *") return "Every day at noon (12:00)";

  // Format minute
  let minText = "";
  if (min === "*") {
    minText = "every minute";
  } else if (min.startsWith("*/")) {
    minText = `every ${min.replace("*/", "")} minutes`;
  } else {
    minText = `at minute ${min}`;
  }

  // Format hour
  let hourText = "";
  if (hour === "*") {
    hourText = min === "*" ? "" : "past every hour";
  } else if (hour.startsWith("*/")) {
    hourText = `every ${hour.replace("*/", "")} hours`;
  } else {
    const padHour = hour.padStart(2, "0");
    const padMin = min === "*" ? "00" : min.padStart(2, "0");
    hourText = `at ${padHour}:${padMin}`;
  }

  // Format day-of-month
  let domText = "";
  if (dom !== "*") {
    domText = `on day ${dom} of the month`;
  }

  // Format month
  let monthText = "";
  if (month !== "*") {
    const monthNum = parseInt(month, 10);
    monthText = MONTH_NAMES[monthNum - 1] ? `in ${MONTH_NAMES[monthNum - 1]}` : `in month ${month}`;
  }

  // Format day-of-week
  let dowText = "";
  if (dow !== "*") {
    if (dow === "1-5") {
      dowText = "on weekdays (Monday through Friday)";
    } else if (dow === "0,6" || dow === "6,0" || dow === "7,6") {
      dowText = "on weekends (Saturday and Sunday)";
    } else {
      const dows = dow.split(",").map((d) => {
        const val = parseInt(d, 10) % 7;
        return DOW_NAMES[val] || d;
      });
      dowText = `on ${dows.join(", ")}`;
    }
  }

  const parts = [];
  if (hour !== "*" && min !== "*") {
    parts.push(hourText);
  } else {
    parts.push(minText);
    if (hourText) parts.push(hourText);
  }
  if (domText) parts.push(domText);
  if (monthText) parts.push(monthText);
  if (dowText) parts.push(dowText);

  return parts.join(", ") || "Executes on schedule";
}

/**
 * Expands a cron field to a Set of matching integers.
 * @param {string} field
 * @param {number} min
 * @param {number} max
 * @returns {Set<number>}
 */
function expandField(field, min, max) {
  const allowed = new Set();
  const subfields = field.split(",");

  for (const sub of subfields) {
    if (sub === "*") {
      for (let i = min; i <= max; i++) allowed.add(i);
    } else if (sub.includes("/")) {
      const [rangePart, stepPart] = sub.split("/");
      const step = parseInt(stepPart, 10);
      let rMin = min;
      let rMax = max;
      if (rangePart !== "*") {
        if (rangePart.includes("-")) {
          const [s, e] = rangePart.split("-").map(Number);
          rMin = s;
          rMax = e;
        } else {
          rMin = parseInt(rangePart, 10);
        }
      }
      for (let i = rMin; i <= rMax; i += step) {
        allowed.add(i);
      }
    } else if (sub.includes("-")) {
      const [s, e] = sub.split("-").map(Number);
      for (let i = s; i <= e; i++) allowed.add(i);
    } else {
      const n = parseInt(sub, 10);
      // Day of week: 7 is Sunday (0)
      if (max === 7 && n === 7) {
        allowed.add(0);
      } else {
        allowed.add(n);
      }
    }
  }

  return allowed;
}

/**
 * Calculates the next N scheduled execution times for a cron expression.
 * @param {string} cron
 * @param {number} [count=5]
 * @param {Date} [startDate=new Date()]
 * @returns {Date[]}
 */
export function getNextExecutions(cron = "", count = 5, startDate = new Date()) {
  const parseResult = parseCron(cron);
  if (!parseResult.valid) return [];

  const [minField, hourField, domField, monthField, dowField] = parseResult.parts;
  const mins = expandField(minField, 0, 59);
  const hours = expandField(hourField, 0, 23);
  const doms = expandField(domField, 1, 31);
  const months = expandField(monthField, 1, 12);
  const dows = expandField(dowField, 0, 7);

  const results = [];
  const current = new Date(startDate.getTime());
  // Advance by 1 minute to avoid matching current instant
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  // Search forward up to 5 years (prevent infinite loops on rare leap days)
  const maxIterations = 525600 * 5; // minutes in 5 years
  let iterations = 0;

  while (results.length < count && iterations < maxIterations) {
    iterations++;

    const month = current.getMonth() + 1; // 1-12
    if (!months.has(month)) {
      // Advance to start of next month
      current.setMonth(current.getMonth() + 1, 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    const dom = current.getDate();
    const dow = current.getDay(); // 0-6

    // If both dom and dow are restricted, cron standard usually matches OR.
    // If either is *, it matches the other.
    const domRestricted = domField !== "*";
    const dowRestricted = dowField !== "*";

    let dayMatches = false;
    if (domRestricted && dowRestricted) {
      dayMatches = doms.has(dom) || dows.has(dow);
    } else if (domRestricted) {
      dayMatches = doms.has(dom);
    } else if (dowRestricted) {
      dayMatches = dows.has(dow);
    } else {
      dayMatches = true;
    }

    if (!dayMatches) {
      // Advance to next day
      current.setDate(current.getDate() + 1);
      current.setHours(0, 0, 0, 0);
      continue;
    }

    const hour = current.getHours();
    if (!hours.has(hour)) {
      // Advance to next hour
      current.setHours(current.getHours() + 1, 0, 0, 0);
      continue;
    }

    const min = current.getMinutes();
    if (!mins.has(min)) {
      current.setMinutes(current.getMinutes() + 1);
      continue;
    }

    // Found match
    results.push(new Date(current.getTime()));
    current.setMinutes(current.getMinutes() + 1);
  }

  return results;
}
