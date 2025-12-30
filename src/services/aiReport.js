const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAIReport({ platforms }) {
  if (!Array.isArray(platforms) || platforms.length === 0) {
    throw new Error("No platform data provided to AI report generator");
  }

  // Build platform-specific sections dynamically
  const platformSections = platforms
    .map((p, index) => {
      return `
Platform ${index + 1}: ${p.platform}

Handle: ${p.handle}
Grade: ${p.grade} (${p.score}/100)

Metrics:
Posts in last 30 days: ${p.metrics.posts_last_30_days}
Average posts per week: ${p.metrics.avg_posts_per_week}
Days since last post: ${p.metrics.days_since_last_post}
Followers: ${p.metrics.followers}
Engagement rate: ${p.metrics.engagement_rate}%

Issues identified:
${p.urgency?.length ? p.urgency.join(", ") : "None"}
`;
    })
    .join("\n");

  const prompt = `
You are a senior social media growth consultant.

Analyze the following social media profiles and generate a clear, concise, and actionable growth report intended for a small business owner.

${platformSections}

Write the report with the following structure:
Overall performance summary.
Platform by platform performance analysis.
Key issues holding back growth.
Cross platform opportunities and synergies.
Three high impact actionable recommendations.
What would move these profiles to the next grade tier.

IMPORTANT OUTPUT RULES:
Do NOT use markdown.
Do NOT use headings like ### or **.
Do NOT use bullet points.
Do NOT use symbols like #, *, -, or —.
Write in clean plain English paragraphs only.
Output must be suitable for direct UI display.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAIReport,
};
