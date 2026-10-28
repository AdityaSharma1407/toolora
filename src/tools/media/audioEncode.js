/**
 * Client-Side Audio Encoding Engine.
 * Formats multi-channel raw PCM audio buffers into 16-bit PCM RIFF WAVE (.wav) files.
 * 100% pure JavaScript with zero external dependencies.
 */

/**
 * Formats seconds into MM:SS or HH:MM:SS string.
 * @param {number} seconds
 * @param {boolean} [includeMs=false]
 * @returns {string}
 */
export function formatTimecode(seconds = 0, includeMs = false) {
  if (isNaN(seconds) || seconds < 0) return includeMs ? "00:00.0" : "00:00";

  const totalSecs = Math.floor(seconds);
  const hrs = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  const ms = Math.floor((seconds - totalSecs) * 10);

  const minsStr = String(mins).padStart(2, "0");
  const secsStr = String(secs).padStart(2, "0");

  let result = hrs > 0
    ? `${String(hrs).padStart(2, "0")}:${minsStr}:${secsStr}`
    : `${minsStr}:${secsStr}`;

  if (includeMs) {
    result += `.${ms}`;
  }

  return result;
}

/**
 * Encodes multi-channel Float32Array PCM samples into a 16-bit stereo or mono WAV ArrayBuffer.
 *
 * @param {Float32Array[]} channels - Array of Float32Array (1 for mono, 2 for stereo)
 * @param {number} sampleRate - e.g. 44100 or 48000
 * @returns {ArrayBuffer}
 */
export function encodeWavBuffer(channels, sampleRate = 44100) {
  if (!channels || channels.length === 0 || !channels[0]) {
    throw new Error("No audio channel data provided for encoding.");
  }

  const numChannels = Math.min(2, channels.length);
  const numSamples = channels[0].length;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // Helper to write ASCII string to DataView
  const writeString = (offset, str) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  // 1. RIFF Header
  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true); // ChunkSize
  writeString(8, "WAVE");

  // 2. fmt Subchunk
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, numChannels, true); // NumChannels
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, byteRate, true); // ByteRate
  view.setUint16(32, blockAlign, true); // BlockAlign
  view.setUint16(34, bitsPerSample, true); // BitsPerSample

  // 3. data Subchunk
  writeString(36, "data");
  view.setUint32(40, dataSize, true); // Subchunk2Size

  // 4. Interleave & write 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Clamp between -1.0 and 1.0
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit signed integer [-32768, 32767]
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return buffer;
}

/**
 * Trims audio samples between startTime and endTime.
 * @param {Float32Array[]} channels
 * @param {number} sampleRate
 * @param {number} startTime - in seconds
 * @param {number} endTime - in seconds
 * @returns {Float32Array[]}
 */
export function sliceAudioChannels(channels, sampleRate, startTime = 0, endTime = 0) {
  const startSample = Math.max(0, Math.floor(startTime * sampleRate));
  const maxSample = channels[0] ? channels[0].length : 0;
  const endSample = endTime > 0 ? Math.min(maxSample, Math.floor(endTime * sampleRate)) : maxSample;

  if (startSample >= endSample) {
    throw new Error("Start time must be strictly before end time.");
  }

  return channels.map((ch) => ch.slice(startSample, endSample));
}
