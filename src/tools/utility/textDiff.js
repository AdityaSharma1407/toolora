/**
 * Fast Line-by-Line Text Difference & Comparison Engine (LCS algorithm).
 * Zero external dependencies.
 */

/**
 * Computes line-by-line difference between original and modified text.
 * @param {string} originalText
 * @param {string} modifiedText
 * @param {object} [options]
 * @param {boolean} [options.ignoreWhitespace=false]
 * @param {boolean} [options.ignoreCase=false]
 * @returns {object} Diff result with lines and statistics
 */
export function computeTextDiff(originalText = "", modifiedText = "", options = {}) {
  const { ignoreWhitespace = false, ignoreCase = false } = options;

  const origLines = originalText.split(/\r?\n/);
  const modLines = modifiedText.split(/\r?\n/);

  function normalize(line) {
    let s = line;
    if (ignoreWhitespace) s = s.trim().replace(/\s+/g, " ");
    if (ignoreCase) s = s.toLowerCase();
    return s;
  }

  const N = origLines.length;
  const M = modLines.length;

  // Build 2D LCS matrix
  // For memory safety with very large text, limit line count
  const maxLines = 2000;
  const safeN = Math.min(N, maxLines);
  const safeM = Math.min(M, maxLines);

  const dp = Array.from({ length: safeN + 1 }, () => new Uint16Array(safeM + 1));

  for (let i = 0; i < safeN; i++) {
    for (let j = 0; j < safeM; j++) {
      if (normalize(origLines[i]) === normalize(modLines[j])) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  // Backtrack to find diff chunks
  let i = safeN;
  let j = safeM;
  const diff = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && normalize(origLines[i - 1]) === normalize(modLines[j - 1])) {
      diff.unshift({
        type: "equal",
        originalLineNumber: i,
        modifiedLineNumber: j,
        content: origLines[i - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({
        type: "added",
        originalLineNumber: null,
        modifiedLineNumber: j,
        content: modLines[j - 1],
      });
      j--;
    } else if (i > 0) {
      diff.unshift({
        type: "removed",
        originalLineNumber: i,
        modifiedLineNumber: null,
        content: origLines[i - 1],
      });
      i--;
    }
  }

  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  for (const item of diff) {
    if (item.type === "added") additions++;
    else if (item.type === "removed") deletions++;
    else unchanged++;
  }

  return {
    lines: diff,
    stats: {
      additions,
      deletions,
      unchanged,
      totalLines: diff.length,
    },
  };
}
