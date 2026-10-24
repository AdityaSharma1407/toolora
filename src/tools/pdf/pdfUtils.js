/**
 * Safely triggers a browser download for a Blob.
 * @param {Blob} blob
 * @param {string} fileName
 */
export function triggerBlobDownload(blob, fileName = "merged-document.pdf") {
  if (typeof window === "undefined" || !blob) return;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Allow browser time to initialize download before revoking
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 60000);
}

/**
 * Reads the first N bytes of a File/Blob asynchronously for signature inspection.
 * @param {Blob | File} file
 * @param {number} byteCount
 * @returns {Promise<ArrayBuffer>}
 */
export async function readFirstBytes(file, byteCount = 1024) {
  if (!file || typeof file.slice !== "function") {
    return new ArrayBuffer(0);
  }
  const slice = file.slice(0, Math.min(file.size, byteCount));
  return await slice.arrayBuffer();
}

/**
 * Reorders an array by moving an item from one index to another.
 * Returns a new array.
 * @template T
 * @param {T[]} list
 * @param {number} fromIndex
 * @param {number} toIndex
 * @returns {T[]}
 */
export function moveItemInArray(list, fromIndex, toIndex) {
  if (
    fromIndex < 0 ||
    fromIndex >= list.length ||
    toIndex < 0 ||
    toIndex >= list.length ||
    fromIndex === toIndex
  ) {
    return list;
  }
  const result = [...list];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Sums the file sizes of an array of File items.
 * @param {Array<{ size?: number, file?: { size?: number } }>} items
 * @returns {number}
 */
export function calculateTotalSize(items = []) {
  return items.reduce((total, item) => {
    const size = item.size ?? item.file?.size ?? 0;
    return total + size;
  }, 0);
}
