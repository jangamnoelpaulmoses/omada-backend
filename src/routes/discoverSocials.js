const express = require("express");
const router = express.Router();

const { fetchHtmlWithBrightData } = require("../services/brightdata");
const { extractSocialsFromHtml } = require("../utils/extractSocials");

router.post("/", async (req, res) => {
  try {
    const { website_url } = req.body;
    console.log("Discovering socials for:", website_url);
    
    if (!website_url) {
      return res.status(400).json({ error: "website_url is required" });
    }

    const html = await fetchHtmlWithBrightData(website_url);
    
    const socials = extractSocialsFromHtml(html);
    console.log("length of html", html);
    console.log("Discovered socials length", socials.length);
    res.json({
      website: website_url,
      socials
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to discover social handles",
      message: err.message
    });
  }
});

module.exports = router;

