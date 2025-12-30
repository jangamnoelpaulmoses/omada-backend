const axios = require("axios");
const { sleep } = require("../utils/sleep");

const TOKEN = process.env.BRIGHTDATA_TOKEN;
const DATASET_ID = "gd_lk5ns7kz21pck8jpis";
const FB_DATASET_ID = "gd_lkaxegm826bjpoo9m5"; 


async function fetchHtmlWithBrightData(url) {
    const res = await fetch("https://api.brightdata.com/request", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.BRIGHTDATA_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        zone: process.env.BRIGHTDATA_ZONE,
        url,
        format: "raw"
      })
    });
  
    const contentType = res.headers.get("content-type") || "";
    const text = await res.text();
  
    // CASE 1: Bright Data returned JSON
    if (contentType.includes("application/json")) {
      const data = JSON.parse(text);
  
      if (!data.body) {
        throw new Error("BrightData JSON response missing body");
      }
  
      return data.body;
    }
  
    // CASE 2: Bright Data returned raw HTML
    if (text.length > 0) {
      return text;
    }
  
    // Anything else is an error
    throw new Error(`Unexpected BrightData response: ${text.slice(0, 200)}`);
  }
async function triggerInstagram(username) {
  const payload = [
    {
      url: `https://www.instagram.com/${username}/`,
      num_of_posts: 10,
      start_date: "",
      end_date: "",
      post_type: ""
    }
  ];

  const res = await axios.post(
    `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&include_errors=true&type=discover_new&discover_by=url`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  return res.data.snapshot_id;
}
async function triggerInstagramForPosts(username) {
    const payload = [
      {
        url: `https://www.instagram.com/${username}/`,
        num_of_posts: 2,
        start_date: "01-01-2020",
        end_date: "12-17-2025",
        post_type: ""
      }
    ];
  
    const res = await axios.post(
      `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${DATASET_ID}&include_errors=true&type=discover_new&discover_by=url`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  
    return res.data.snapshot_id;
  }

async function fetchSnapshot(snapshotId) {
  const res = await axios.get(
    `https://api.brightdata.com/datasets/v3/snapshot/${snapshotId}`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` }
    }
  );

  return res.data;
}

async function fetchInstagramFromSnapshot(snapshotId) {
  for (let i = 0; i < 35; i++) {
    
    console.log("⏳ polling snapshot...", snapshotId);

    const data = await fetchSnapshot(snapshotId);
    if ( data.length > 0) {
      console.log("✅ Snapshot ready");
      return data;
    }
    await sleep(4000);
  }

  throw new Error("Snapshot not ready");
}
async function triggerFacebook(page) {
    const payload = [
      {
        url: `https://www.facebook.com/${page}/`,
        num_of_posts: 5,
        start_date: "",
        end_date: ""
      }
    ];
  
    const res = await axios.post(
      `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${FB_DATASET_ID}&include_errors=true`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
  
    return res.data.snapshot_id;
  }
  
  async function fetchFacebookFromSnapshot(snapshotId) {
    for (let i = 0; i < 35; i++) {
    
        console.log(4*i,"sec ⏳ polling snapshot for facebook", snapshotId);
    
        const data = await fetchSnapshot(snapshotId);
        if ( data.length > 0) {
          console.log("✅ Snapshot ready");
          return data;
        }
        await sleep(4000);
      }
    
      throw new Error("Snapshot not ready");
  }
module.exports = {
  triggerInstagram,
  triggerInstagramForPosts,
  fetchInstagramFromSnapshot,
  fetchHtmlWithBrightData,
  triggerFacebook,
  fetchFacebookFromSnapshot
};







