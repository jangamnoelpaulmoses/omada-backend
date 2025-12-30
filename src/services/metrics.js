function computeInstagramMetrics(posts) {
    const now = new Date();
  
    if (!posts || posts.length === 0) {
      return {
        posts_last_30_days: 0,
        avg_posts_per_week: 0,
        days_since_last_post: null,
        followers: 0,
        engagement_rate: 0
      };
    }
  
    // Ensure latest-first
    posts = posts
      .filter(p => p.date_posted)
      .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
  
    const followers = posts[0]?.followers || 0;
  
    const last30 = posts.filter(p =>
      (now - new Date(p.date_posted)) / 86400000 <= 30
    );
  
    const daysSinceLastPost = Math.floor(
      (now - new Date(posts[0].date_posted)) / 86400000
    );
  
    // Use last 10 posts for engagement
    const recentPosts = posts.slice(0, 10);
  
    const totalEngagement = recentPosts.reduce(
      (sum, p) => sum + (p.likes || 0) + (p.num_comments || 0),
      0
    );
  
    const avgEngagementPerPost = recentPosts.length
      ? totalEngagement / recentPosts.length
      : 0;
  
    const engagementRate = followers
      ? (avgEngagementPerPost / followers) * 100
      : 0;
  
    return {
      posts_last_30_days: last30.length,
      avg_posts_per_week: Number((last30.length / 4).toFixed(2)),
      days_since_last_post: daysSinceLastPost,
      followers,
      engagement_rate: Number(engagementRate.toFixed(2))
    };
  }
  
function computeFacebookMetrics(posts) {
  const now = new Date();
  posts = posts
    .filter(p => p.date_posted)
    .sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));

  const followers = posts[0]?.page_followers || 0;

  const last30 = posts.filter(
    p => (now - new Date(p.date_posted)) / 86400000 <= 30
  );

  const daysSinceLastPost = Math.floor(
    (now - new Date(posts[0].date_posted)) / 86400000
  );

  const recent = posts.slice(0, 10);
  const totalEngagement = recent.reduce(
    (sum, p) => sum + (p.likes || 0) + (p.num_comments || 0) + (p.num_shares || 0),
    0
  );

  const avgEngagement = recent.length
    ? totalEngagement / recent.length
    : 0;

  const engagementRate = followers
    ? (avgEngagement / followers) * 100
    : 0;

  return {
    posts_last_30_days: last30.length,
    avg_posts_per_week: Number((last30.length / 4).toFixed(2)),
    days_since_last_post: daysSinceLastPost,
    followers,
    engagement_rate: Number(engagementRate.toFixed(2))
  };
}

module.exports = {
  computeInstagramMetrics,
  computeFacebookMetrics
};

