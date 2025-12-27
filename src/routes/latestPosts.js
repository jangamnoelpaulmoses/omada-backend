const express = require("express");
const router = express.Router();

const {
  triggerInstagramForPosts,
  fetchInstagramFromSnapshot
} = require("../services/brightdata");

const {
  getSnapshot,
  setSnapshot
} = require("../cache/snapshotCache");

const { discoverProfiles } = require("../services/discovery");
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

    let snapshotId = getSnapshot(handle); //snapshotid from cache

    if (!snapshotId) {
      snapshotId = await triggerInstagramForPosts(handle);
      setSnapshot(handle, snapshotId);
    }

    // 🚀 FAST PATH: try once, no polling
    const data = await fetchInstagramFromSnapshot(snapshotId).catch(() => []);

    if ( data.length === 0) {
      return res.json({ posts: [] });
    }
    const normalizedData = normalizeBrightData(data);

    // Take ONLY latest 2 posts
    // const latestPosts = data.slice(0, 2).map(post => ({
    //   url: post.post_url || post.url,
    //   media_type: post.post_type || post.media_type,
    //   thumbnail: post.thumbnail || post.display_url
    // }));
    console.log("this is dataa from latest postss", data);
    res.json({ posts: normalizedData });
  } catch (err) {
    console.error("❌ /latest-posts error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;



