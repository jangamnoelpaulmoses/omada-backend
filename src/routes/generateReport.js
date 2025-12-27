const express = require("express");
const router = express.Router();
const { generateAIReport } = require("../services/aiReport");

router.post("/", async (req, res) => {
  try {
    const { platform, handle, metrics, grade, score, urgency } = req.body;

    if (!platform || !metrics || !grade) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const report = await generateAIReport({
      platform,
      handle,
      metrics,
      grade,
      score,
      urgency
    });

    res.json({ report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate AI report" });
  }
});

module.exports = router;
