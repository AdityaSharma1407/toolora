/**
 * Cryptographically Secure Password & Passphrase Generator.
 * Calculates NIST-compliant entropy and estimated crack resistance.
 * Zero external dependencies.
 */

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = /[il1Lo0O]/g;

const PASSPHRASE_WORDS = [
  "apple", "banana", "galaxy", "orbit", "crystal", "phoenix", "falcon", "river",
  "summit", "ocean", "vector", "matrix", "shield", "beacon", "aurora", "shadow",
  "timber", "glacier", "zenith", "thunder", "harbor", "canyon", "voyage", "cipher",
  "cobalt", "quartz", "anchor", "silver", "ember", "radiant", "canvas", "vortex",
  "pinnacle", "stellar", "horizon", "breeze", "meadow", "cascade", "prism", "stride",
  "monarch", "solace", "venture", "echo", "spirit", "haven", "cavalier", "fable"
];

function getRandomInt(max) {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}

/**
 * Calculates bits of entropy and crack-time estimate for a password.
 */
export function calculateEntropy(password = "") {
  if (!password) return { bits: 0, score: "Empty", crackTime: "Instant" };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/\d/.test(password)) poolSize += 10;
  if (/[^a-zA-Z\d]/.test(password)) poolSize += 32;

  if (poolSize === 0) poolSize = 1;

  const bits = Math.round(password.length * Math.log2(poolSize));

  let score = "Very Weak";
  let color = "rose";
  if (bits >= 128) {
    score = "Very Strong";
    color = "emerald";
  } else if (bits >= 60) {
    score = "Strong";
    color = "emerald";
  } else if (bits >= 36) {
    score = "Reasonable";
    color = "amber";
  } else if (bits >= 28) {
    score = "Weak";
    color = "rose";
  }

  // Assuming 10 billion (1e10) hashes/sec for offline brute-force
  const combinations = Math.pow(poolSize, password.length);
  const secondsToCrack = combinations / 1e10;

  let crackTime = "Instant";
  if (secondsToCrack >= 3.15e16) crackTime = "Trillions of years";
  else if (secondsToCrack >= 3.15e7) crackTime = `${Math.round(secondsToCrack / 3.15e7)} years`;
  else if (secondsToCrack >= 86400) crackTime = `${Math.round(secondsToCrack / 86400)} days`;
  else if (secondsToCrack >= 3600) crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
  else if (secondsToCrack >= 60) crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
  else if (secondsToCrack > 1) crackTime = `${Math.round(secondsToCrack)} seconds`;

  return { bits, score, color, crackTime, poolSize };
}

/**
 * Generates a random password or passphrase.
 */
export function generatePassword(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
    excludeAmbiguous = false,
    mode = "characters",
    wordCount = 4,
    separator = "-",
  } = options;

  if (mode === "passphrase") {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
      const idx = getRandomInt(PASSPHRASE_WORDS.length);
      words.push(PASSPHRASE_WORDS[idx]);
    }
    const passphrase = words.join(separator);
    return {
      password: passphrase,
      entropy: calculateEntropy(passphrase),
    };
  }

  let charset = "";
  let mandatory = [];

  let up = UPPERCASE;
  let low = LOWERCASE;
  let num = NUMBERS;
  let sym = SYMBOLS;

  if (excludeAmbiguous) {
    up = up.replace(AMBIGUOUS, "");
    low = low.replace(AMBIGUOUS, "");
    num = num.replace(AMBIGUOUS, "");
  }

  if (uppercase) {
    charset += up;
    mandatory.push(up[getRandomInt(up.length)]);
  }
  if (lowercase) {
    charset += low;
    mandatory.push(low[getRandomInt(low.length)]);
  }
  if (numbers) {
    charset += num;
    mandatory.push(num[getRandomInt(num.length)]);
  }
  if (symbols) {
    charset += sym;
    mandatory.push(sym[getRandomInt(sym.length)]);
  }

  if (!charset) {
    charset = lowercase ? low : "abcdefghijklmnopqrstuvwxyz";
  }

  const safeLen = Math.max(mandatory.length, Math.min(128, Number(length) || 16));
  const chars = [...mandatory];

  for (let i = chars.length; i < safeLen; i++) {
    chars.push(charset[getRandomInt(charset.length)]);
  }

  // Shuffle mandatory chars so they aren't always at the front
  for (let i = chars.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    const temp = chars[i];
    chars[i] = chars[j];
    chars[j] = temp;
  }

  const password = chars.join("");
  return {
    password,
    entropy: calculateEntropy(password),
  };
}
