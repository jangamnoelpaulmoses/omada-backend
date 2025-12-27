// const express = require("express");
// const router = express.Router();

// const { discoverProfiles } = require("../services/discovery");
// const { fetchInstagramData } = require("../services/brightdata");
// const { computeInstagramMetrics } = require("../services/metrics");
// const { gradeInstagram } = require("../services/grading");
// function normalizeBrightData(rawData) {
//     // Case 1: already an array
//     if (Array.isArray(rawData)) {
//       return rawData;
//     }
  
//     // Case 2: string with {}{}{} or NDJSON
//     if (typeof rawData === "string") {
//       return rawData
//         .split("\n")
//         .map(line => line.trim())
//         .filter(Boolean)
//         .map(line => {
//           try {
//             return JSON.parse(line);
//           } catch (e) {
//             return null;
//           }
//         })
//         .filter(Boolean);
//     }
  
//     return [];
//   }
  
//   router.post("/", async (req, res) => {
//     try {
//       const { input } = req.body;
//       if (!input) {
//         return res.status(400).json({ error: "input required" });
//       }
  
//       const profiles = discoverProfiles(input);
  
//       if (!profiles.instagram) {
//         return res.status(400).json({ error: "Instagram profile not found" });
//       }
  
//       const rawData = await fetchInstagramData(profiles.instagram);
//       const posts = normalizeBrightData(rawData);
  
//       console.log("📦 Normalized posts:", posts.length);
  
//       if (posts.length === 0) {
//         return res.status(400).json({ error: "No Instagram posts found" });
//       }
  
//       const metrics = computeInstagramMetrics(posts);
//       const grade = gradeInstagram(metrics);
  
//       res.json({
//         instagram: {
//           handle: profiles.instagram,
//           metrics,
//           ...grade
//         }
//       });
//     } catch (err) {
//       console.error("❌ /grade error:", err.message);
//       res.status(500).json({ error: "Internal server error" });
//     }
//   });
  

// module.exports = router;



const express = require("express");
const router = express.Router();

const { discoverProfiles } = require("../services/discovery");
const {
  triggerInstagram,
  fetchInstagramFromSnapshot
} = require("../services/brightdata");
const { computeInstagramMetrics } = require("../services/metrics");
const { gradeInstagram } = require("../services/grading");

const {
  getSnapshot,
  setSnapshot,
  invalidateSnapshot
} = require("../cache/snapshotCache");

function normalizeBrightData(rawData) {
  if (Array.isArray(rawData)) return rawData;

  if (typeof rawData === "string") {
    return rawData
      .split("\n")
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  return [];
}

router.post("/", async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: "input required" });
    }

    const profiles = discoverProfiles(input);
    if (!profiles.instagram) {
      return res.status(400).json({ error: "Instagram profile not found" });
    }

    const handle = profiles.instagram.toLowerCase();

    let snapshotId = getSnapshot(handle);

    if (snapshotId) {
      console.log("⚡ Cache hit:", snapshotId);
    } else {
      snapshotId = await triggerInstagram(handle);
      console.log("📸 New snapshot:", snapshotId);
      setSnapshot(handle, snapshotId);
    }

    let rawData;
    try {
      rawData = await fetchInstagramFromSnapshot(snapshotId);
    } catch (err) {
      // Snapshot invalid / expired → retry once
      console.log("♻️ Invalid snapshot, re-triggering");
      invalidateSnapshot(handle);

      snapshotId = await triggerInstagram(handle);
      setSnapshot(handle, snapshotId);
      rawData = await fetchInstagramFromSnapshot(snapshotId);
    }

    const posts = normalizeBrightData(rawData);
    console.log("📦 Normalized posts:", posts.length);

    if (posts.length === 0) {
      return res.status(400).json({ error: "No Instagram posts found" });
    }

    const metrics = computeInstagramMetrics(posts);
    const grade = gradeInstagram(metrics);

    res.json({
      instagram: {
        handle,
        metrics,
        ...grade
      }
    });
  } catch (err) {
    console.error("❌ /grade error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
