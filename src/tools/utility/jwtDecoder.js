/**
 * Client-Side JSON Web Token (JWT) Inspector & Decoder.
 * Decodes header, payload, claims, and verifies expiration status.
 * Zero external dependencies. 100% private.
 */

function base64UrlDecode(str) {
  let output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0: break;
    case 2: output += "=="; break;
    case 3: output += "="; break;
    default: throw new Error("Illegal base64url string!");
  }
  const binary = atob(output);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

function formatRelativeTime(targetMs) {
  const now = Date.now();
  const diffSec = Math.round((targetMs - now) / 1000);
  const isPast = diffSec < 0;
  const absSec = Math.abs(diffSec);

  if (absSec < 60) {
    return isPast ? `${absSec}s ago` : `in ${absSec}s`;
  }
  const minutes = Math.floor(absSec / 60);
  if (minutes < 60) {
    return isPast ? `${minutes}m ago` : `in ${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours < 24) {
    return isPast
      ? `${hours}h ${remMinutes}m ago`
      : `in ${hours}h ${remMinutes}m`;
  }
  const days = Math.floor(hours / 24);
  return isPast ? `${days}d ago` : `in ${days}d`;
}

/**
 * Decodes and inspects a JWT token string.
 * @param {string} token
 * @returns {object} Decoded JWT breakdown and expiration status
 */
export function decodeJwt(token = "") {
  if (!token || !token.trim()) {
    return { success: false, error: "Please enter a JWT token string." };
  }

  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return {
      success: false,
      error: `Invalid JWT format: A valid token must have 3 dot-separated segments (header.payload.signature), but received ${parts.length}.`,
    };
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  let header = null;
  let payload = null;

  try {
    const headerJson = base64UrlDecode(headerB64);
    header = JSON.parse(headerJson);
  } catch (err) {
    return { success: false, error: "Failed to decode JWT Header: " + err.message };
  }

  try {
    const payloadJson = base64UrlDecode(payloadB64);
    payload = JSON.parse(payloadJson);
  } catch (err) {
    return { success: false, error: "Failed to decode JWT Payload: " + err.message };
  }

  // Parse standard claims
  let isExpired = false;
  let expDate = null;
  let expRelative = null;

  if (payload.exp && typeof payload.exp === "number") {
    const expMs = payload.exp * 1000;
    expDate = new Date(expMs).toISOString();
    isExpired = Date.now() > expMs;
    expRelative = formatRelativeTime(expMs);
  }

  let iatDate = null;
  if (payload.iat && typeof payload.iat === "number") {
    iatDate = new Date(payload.iat * 1000).toISOString();
  }

  let nbfDate = null;
  if (payload.nbf && typeof payload.nbf === "number") {
    nbfDate = new Date(payload.nbf * 1000).toISOString();
  }

  return {
    success: true,
    header,
    payload,
    signature: signatureB64,
    claims: {
      algorithm: header.alg || "Unknown",
      type: header.typ || "JWT",
      issuer: payload.iss || null,
      subject: payload.sub || null,
      audience: payload.aud || null,
      expirationTimestamp: payload.exp || null,
      expirationDate: expDate,
      isExpired,
      expirationRelative: expRelative,
      issuedAtTimestamp: payload.iat || null,
      issuedAtDate: iatDate,
      notBeforeDate: nbfDate,
    },
  };
}
