/**
 * List Operations, Deduplication, Shuffling & Set Utilities.
 * Zero external dependencies.
 */

/**
 * Parses raw text input into clean line array.
 */
export function textToList(text = "", stripEmpty = true, trimLines = true) {
  let lines = text.split(/\r?\n/);
  if (trimLines) lines = lines.map((l) => l.trim());
  if (stripEmpty) lines = lines.filter((l) => l.length > 0);
  return lines;
}

/**
 * Fisher-Yates array shuffling with cryptographic randomness.
 */
export function shuffleList(list = []) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    let randIndex;
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      randIndex = arr[0] % (i + 1);
    } else {
      randIndex = Math.floor(Math.random() * (i + 1));
    }
    const temp = result[i];
    result[i] = result[randIndex];
    result[randIndex] = temp;
  }
  return result;
}

/**
 * Sorts list with multiple modes.
 */
export function sortList(list = [], options = {}) {
  const { order = "asc", caseSensitive = false } = options;
  const result = [...list];

  result.sort((a, b) => {
    if (order === "length") {
      return a.length - b.length || a.localeCompare(b);
    }
    if (order === "natural") {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: caseSensitive ? "case" : "base" });
    }
    const cmp = caseSensitive
      ? a.localeCompare(b)
      : a.toLowerCase().localeCompare(b.toLowerCase());
    return order === "desc" ? -cmp : cmp;
  });

  return result;
}

/**
 * Deduplicates list while preserving sequence.
 */
export function deduplicateList(list = [], caseSensitive = false) {
  const seen = new Set();
  const unique = [];
  let duplicatesCount = 0;

  for (const item of list) {
    const key = caseSensitive ? item : item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    } else {
      duplicatesCount++;
    }
  }

  return {
    list: unique,
    removedCount: duplicatesCount,
    originalCount: list.length,
    uniqueCount: unique.length,
  };
}

/**
 * Inverts list order.
 */
export function reverseList(list = []) {
  return [...list].reverse();
}

/**
 * Adds custom prefix and suffix to every list entry.
 */
export function wrapListItems(list = [], prefix = "", suffix = "") {
  return list.map((item) => `${prefix}${item}${suffix}`);
}

/**
 * Splits list into chunks of N items.
 */
export function chunkList(list = [], size = 5) {
  const safeSize = Math.max(1, Number(size) || 1);
  const chunks = [];
  for (let i = 0; i < list.length; i += safeSize) {
    chunks.push(list.slice(i, i + safeSize));
  }
  return chunks;
}

/**
 * Set operations between List A and List B.
 */
export function setOperations(listA = [], listB = [], operation = "intersection", caseSensitive = false) {
  const toKey = (s) => (caseSensitive ? s : s.toLowerCase());

  const setA = new Set(listA.map(toKey));
  const setB = new Set(listB.map(toKey));

  let result = [];

  switch (operation) {
    case "intersection":
      // A ∩ B: items present in both lists
      result = listA.filter((item) => setB.has(toKey(item)));
      break;

    case "union":
      // A ∪ B: unique combination of both lists
      result = [...listA];
      for (const item of listB) {
        if (!setA.has(toKey(item))) {
          result.push(item);
        }
      }
      break;

    case "diffA":
      // A \ B: items in A that are NOT in B
      result = listA.filter((item) => !setB.has(toKey(item)));
      break;

    case "diffB":
      // B \ A: items in B that are NOT in A
      result = listB.filter((item) => !setA.has(toKey(item)));
      break;

    default:
      result = listA;
  }

  // Deduplicate results
  return deduplicateList(result, caseSensitive).list;
}
