/**
 * Client-Side Audio Extractor Engine.
 * Decodes audio from MP4, WebM, and other video/audio files via Web Audio API
 * and exports studio-quality WAV files with zero external dependencies.
 */

import { encodeWavBuffer, sliceAudioChannels } from "./audioEncode.js";

/**
 * Decodes an audio or video File/Blob into an AudioBuffer in browser memory.
 * @param {Blob | File} file
 * @returns {Promise<AudioBuffer>}
 */
export async function decodeMediaAudio(file) {
  if (typeof window === "undefined" && typeof AudioContext === "undefined") {
    throw new Error("Audio decoding requires Web Audio API browser environment.");
  }

  const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtxClass) {
    throw new Error("Web Audio API is not supported in this browser.");
  }

  const audioCtx = new AudioCtxClass();
  const arrayBuffer = await file.arrayBuffer();

  try {
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } finally {
    if (audioCtx.state !== "closed") {
      audioCtx.close().catch(() => {});
    }
  }
}

/**
 * Extracts and encodes audio from a video or audio file.
 *
 * @param {Blob | File} mediaFile
 * @param {object} [options]
 * @param {'stereo'|'mono'} [options.channels='stereo']
 * @param {number} [options.sampleRate] - default: audio's original sample rate
 * @param {number} [options.startTime=0]
 * @param {number} [options.endTime=0]
 * @returns {Promise<{ blob: Blob, dataUrl: string, duration: number, sampleRate: number, channels: number, size: number }>}
 */
export async function extractAudioFromMedia(mediaFile, options = {}) {
  const {
    channels: channelMode = "stereo",
    startTime = 0,
    endTime = 0,
  } = options;

  const audioBuffer = await decodeMediaAudio(mediaFile);
  const sampleRate = options.sampleRate || audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;

  // Extract channel Float32Arrays
  let channelData = [];
  if (channelMode === "mono" || numChannels === 1) {
    if (numChannels === 1) {
      channelData = [audioBuffer.getChannelData(0)];
    } else {
      // Downmix stereo to mono
      const left = audioBuffer.getChannelData(0);
      const right = audioBuffer.getChannelData(1);
      const mono = new Float32Array(left.length);
      for (let i = 0; i < left.length; i++) {
        mono[i] = (left[i] + right[i]) * 0.5;
      }
      channelData = [mono];
    }
  } else {
    // Stereo
    channelData = [
      audioBuffer.getChannelData(0),
      numChannels > 1 ? audioBuffer.getChannelData(1) : audioBuffer.getChannelData(0),
    ];
  }

  // Trim if bounds specified
  if (startTime > 0 || (endTime > 0 && endTime < audioBuffer.duration)) {
    channelData = sliceAudioChannels(channelData, audioBuffer.sampleRate, startTime, endTime);
  }

  // Encode to 16-bit WAV
  const wavArrayBuffer = encodeWavBuffer(channelData, sampleRate);
  const blob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  const dataUrl = URL.createObjectURL(blob);
  const duration = channelData[0].length / sampleRate;

  return {
    blob,
    dataUrl,
    duration,
    sampleRate,
    channels: channelData.length,
    size: blob.size,
  };
}
