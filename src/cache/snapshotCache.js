/**
 * In-memory snapshot cache
 * Key: instagram handle
 * Value: { snapshotId, time }
 */

const CACHE_TTL = 1000 * 60 * 30; // 30 minutes
const cache = {};

function getSnapshot(handle) {
  const entry = cache[handle];
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.time > CACHE_TTL) {
    delete cache[handle];
    return null;
  }

  return entry.snapshotId;
}

function setSnapshot(handle, snapshotId) {
  cache[handle] = {
    snapshotId,
    time: Date.now()
  };
}

function invalidateSnapshot(handle) {
  delete cache[handle];
}

module.exports = {
  getSnapshot,
  setSnapshot,
  invalidateSnapshot
};
