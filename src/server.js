
console.log("✅ CORRECT server.js FILE LOADED");

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const gradeRoute = require("./routes/grade");


const app = express();
app.use(cors());
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.send("ok");
});

// routes
app.use("/grade", gradeRoute);
app.use("/latest-posts", require("./routes/latestPosts"));
app.use("/discover-socials", require("./routes/discoverSocials"));
app.use("/generate-report", require("./routes/generateReport"));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Social Media Grader running on ${PORT}`);
});

// keep process alive (debug safety)
setInterval(() => {
  // console.log("🟢 server alive");
}, 10000);

