const express = require("express");
const router = express.Router();
const { generateAIReport } = require("../services/aiReport");

router.post("/", async (req, res) => {
  console.log("Generating AI report with data:", req.body);
  

  try {
    // Expect an array of platform reports
    const platforms = Array.isArray(req.body)
      ? req.body
      : [req.body]; // backward compatible
    if (platforms.length === 0) {
      return res.status(400).json({ error: "No platform data provided" });
    }

    // Validate each platform
    for (const p of platforms) {
      const { platform, metrics, grade } = p;

      if (!platform || !metrics || !grade) {
        return res.status(400).json({
          error: `Missing required data for platform ${platform || "unknown"}`
        });
      }
    }
    console.log("All platform data validated successfully.");
    console.log("Generating AI report for platforms:", platforms);
    // Pass ALL platforms to AI
    const report = await generateAIReport({
      platforms
    });

    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate AI report" });
  }
});

module.exports = router;
