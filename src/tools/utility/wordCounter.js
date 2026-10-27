/**
 * Analyzes text and returns comprehensive statistics.
 * Zero external dependencies.
 *
 * @param {string} text
 * @returns {object} Text metrics and keyword frequencies
 */
export function analyzeText(text = "") {
  if (typeof text !== "string") {
    text = String(text || "");
  }

  const rawLength = text.length;

  // Characters without whitespace
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  // Characters without punctuation
  const charactersNoPunctuation = text.replace(/[\s\p{P}\p{S}]/gu, "").length;

  // Words: extract unicode word tokens
  const wordsArray = text
    .trim()
    .match(/[\p{L}\p{N}'’_-]+/gu) || [];
  const wordCount = wordsArray.length;

  // Sentences: match ending punctuation (. ! ? etc.) or non-empty string
  const sentencesArray = text
    .trim()
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0);
  const sentenceCount = sentencesArray.length;

  // Paragraphs: non-empty chunks separated by newlines
  const paragraphsArray = text
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const paragraphCount = paragraphsArray.length;

  // Reading time: standard ~200 words per minute
  const readingTimeMinutes = wordCount === 0 ? 0 : wordCount / 200;
  const readingSeconds = Math.round(readingTimeMinutes * 60);

  // Speaking time: standard ~130 words per minute
  const speakingTimeMinutes = wordCount === 0 ? 0 : wordCount / 130;
  const speakingSeconds = Math.round(speakingTimeMinutes * 60);

  // Average word length & average sentence length
  const totalWordChars = wordsArray.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = wordCount > 0 ? (totalWordChars / wordCount).toFixed(1) : 0;
  const avgSentenceLength =
    sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;

  // Top keywords calculation
  const stopWords = new Set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's",
    "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
    "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she",
    "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such",
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves",
    "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up",
    "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
    "weren't", "what", "what's", "when", "when's", "where", "where's", "which",
    "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
    "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours",
    "yourself", "yourselves",
  ]);

  const freqMap = {};
  for (const word of wordsArray) {
    const lower = word.toLowerCase();
    if (lower.length > 1 && !stopWords.has(lower)) {
      freqMap[lower] = (freqMap[lower] || 0) + 1;
    }
  }

  const keywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({
      word,
      count,
      percentage: wordCount > 0 ? ((count / wordCount) * 100).toFixed(1) : 0,
    }));

  return {
    wordCount,
    characterCount: rawLength,
    charactersNoSpaces,
    charactersNoPunctuation,
    sentenceCount,
    paragraphCount,
    readingTimeSeconds: readingSeconds,
    speakingTimeSeconds: speakingSeconds,
    avgWordLength: Number(avgWordLength),
    avgSentenceLength: Number(avgSentenceLength),
    keywords,
  };
}
