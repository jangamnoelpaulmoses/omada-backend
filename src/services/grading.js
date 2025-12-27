const BENCHMARKS = require("./benchmarks");

function gradeInstagram(metrics) {
  let score = 100;
  const urgency = [];
    console.log("Grading Instagram with metrics:", metrics);
  if (metrics.days_since_last_post > 14) {
    score -= 25;
    urgency.push(
      `⚠️ Your last post was ${metrics.days_since_last_post} days ago.`
    );
  }

  if (metrics.avg_posts_per_week < BENCHMARKS.instagram.min_posts_per_week) {
    score -= 25;
    urgency.push(
      `⚠️ Posting ${metrics.avg_posts_per_week}x/week. Aim for 3–4x.`
    );
  }

  if (metrics.engagement_rate < BENCHMARKS.instagram.min_engagement_rate) {
    score -= 30;
    urgency.push(
      `⚠️ Engagement rate ${metrics.engagement_rate}%. Industry avg is 3–5%.`
    );
  }

  let grade = "A";
  if (score < 85) grade = "B";
  if (score < 70) grade = "C";
  if (score < 55) grade = "D";
  if (score < 40) grade = "F";

  return { grade, score, urgency };
}

module.exports = { gradeInstagram };
