const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAIReport({
  platform,
  handle,
  metrics,
  grade,
  score,
  urgency
}) {
    const prompt = `
    You are a senior social media growth consultant.
    
    Analyze the following ${platform} profile and produce a clear, concise report.
    
    Handle: ${handle}
    Grade: ${grade} (${score}/100)
    
    Metrics:
    Posts in last 30 days: ${metrics.posts_last_30_days}
    Average posts per week: ${metrics.avg_posts_per_week}
    Days since last post: ${metrics.days_since_last_post}
    Followers: ${metrics.followers}
    Engagement rate: ${metrics.engagement_rate}%
    
    Issues identified:
    ${urgency?.length ? urgency.join(", ") : "None"}
    
    Write the report with the following structure:
    Performance Summary:
    What the account is doing well:
    What is hurting growth:
    Three actionable recommendations:
    What would move this profile to the next grade:
    
    IMPORTANT OUTPUT RULES:
    - Do NOT use markdown
    - Do NOT use headings like ### or **
    - Do NOT use bullet points
    - Do NOT use symbols like #, *, -, or —
    - Write in clean plain English paragraphs only
    - Output must be suitable for direct UI display
    `;
    

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5
  });

  return response.choices[0].message.content;
}

module.exports = {
  generateAIReport
};
