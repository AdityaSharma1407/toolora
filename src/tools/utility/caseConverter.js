/**
 * Advanced text case transformation utilities.
 * Zero external dependencies.
 */

const MINOR_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "en", "for", "if", "in", "nor", "of", "on", "or", "per", "the", "to", "v", "vs", "via"
]);

/**
 * Split text into atomic words respecting camelCase, snake_case, spaces, and punctuation.
 * @param {string} str
 * @returns {string[]}
 */
export function extractWords(str = "") {
  if (!str) return [];
  // Split on transition from lower to upper (camelCase), non-alphanumeric, underscores, hyphens
  return str
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export function toUpperCase(str = "") {
  return str.toUpperCase();
}

export function toLowerCase(str = "") {
  return str.toLowerCase();
}

export function toSentenceCase(str = "") {
  if (!str) return "";
  return str.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z\p{L}])/gu, (match, prefix, char) => {
    return prefix + char.toUpperCase();
  });
}

export function toTitleCase(str = "") {
  if (!str) return "";
  const lines = str.split(/\r?\n/);

  return lines
    .map((line) => {
      const words = line.split(/(\s+)/);
      let wordIndex = 0;

      return words
        .map((segment) => {
          if (/^\s+$/.test(segment) || !segment) return segment;

          const lower = segment.toLowerCase();
          const isFirstOrLast = wordIndex === 0;
          wordIndex++;

          // Keep minor words lowercase unless first word
          if (!isFirstOrLast && MINOR_WORDS.has(lower.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""))) {
            return lower;
          }

          // Capitalize first letter of word
          return lower.replace(/^([^\p{L}\p{N}]*)([\p{L}\p{N}])/u, (m, p, c) => p + c.toUpperCase());
        })
        .join("");
    })
    .join("\n");
}

export function toCamelCase(str = "") {
  const words = extractWords(str);
  if (words.length === 0) return "";
  return words
    .map((w, idx) => {
      const lower = w.toLowerCase();
      if (idx === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

export function toPascalCase(str = "") {
  const words = extractWords(str);
  if (words.length === 0) return "";
  return words
    .map((w) => {
      const lower = w.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("");
}

export function toSnakeCase(str = "") {
  const words = extractWords(str);
  return words.map((w) => w.toLowerCase()).join("_");
}

export function toKebabCase(str = "") {
  const words = extractWords(str);
  return words.map((w) => w.toLowerCase()).join("-");
}

export function toConstantCase(str = "") {
  const words = extractWords(str);
  return words.map((w) => w.toUpperCase()).join("_");
}

export function toDotCase(str = "") {
  const words = extractWords(str);
  return words.map((w) => w.toLowerCase()).join(".");
}

export function toAlternatingCase(str = "") {
  let upper = false;
  return str
    .split("")
    .map((char) => {
      if (/[\p{L}]/u.test(char)) {
        upper = !upper;
        return upper ? char.toUpperCase() : char.toLowerCase();
      }
      return char;
    })
    .join("");
}

export function toInverseCase(str = "") {
  return str
    .split("")
    .map((char) => {
      if (char === char.toUpperCase() && char !== char.toLowerCase()) {
        return char.toLowerCase();
      }
      if (char === char.toLowerCase() && char !== char.toUpperCase()) {
        return char.toUpperCase();
      }
      return char;
    })
    .join("");
}

export const CASE_CONVERTERS = {
  uppercase: { id: "uppercase", name: "UPPERCASE", convert: toUpperCase },
  lowercase: { id: "lowercase", name: "lowercase", convert: toLowerCase },
  titlecase: { id: "titlecase", name: "Title Case", convert: toTitleCase },
  sentencecase: { id: "sentencecase", name: "Sentence case", convert: toSentenceCase },
  camelcase: { id: "camelcase", name: "camelCase", convert: toCamelCase },
  pascalcase: { id: "pascalcase", name: "PascalCase", convert: toPascalCase },
  snakecase: { id: "snakecase", name: "snake_case", convert: toSnakeCase },
  kebabcase: { id: "kebabcase", name: "kebab-case", convert: toKebabCase },
  constantcase: { id: "constantcase", name: "CONSTANT_CASE", convert: toConstantCase },
  dotcase: { id: "dotcase", name: "dot.case", convert: toDotCase },
  alternatingcase: { id: "alternatingcase", name: "aLtErNaTiNg", convert: toAlternatingCase },
  inversecase: { id: "inversecase", name: "InVeRsE cAsE", convert: toInverseCase },
};
