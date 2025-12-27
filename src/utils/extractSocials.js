function extractSocialsFromHtml(html) {
    const patterns = {
      instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._]+/gi,
      facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9._?=]+/gi,
      linkedin: /https?:\/\/(www\.)?linkedin\.com\/(company|in)\/[a-zA-Z0-9._-]+/gi,
      twitter: /https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9._]+/gi,
      youtube: /https?:\/\/(www\.)?youtube\.com\/[a-zA-Z0-9._/-]+/gi,
      tiktok: /https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9._]+/gi
    };
  
    const socials = {
      instagram: new Set(),
      facebook: new Set(),
      linkedin: new Set(),
      twitter: new Set(),
      youtube: new Set(),
      tiktok: new Set()
    };
  
    for (const [platform, regex] of Object.entries(patterns)) {
      const matches = html.match(regex) || [];
      matches.forEach(m => socials[platform].add(m));
    }
  
    return {
      instagram: [...socials.instagram],
      facebook: [...socials.facebook],
      linkedin: [...socials.linkedin],
      twitter: [...socials.twitter],
      youtube: [...socials.youtube],
      tiktok: [...socials.tiktok]
    };
  }
  
  module.exports = {
    extractSocialsFromHtml
  };
  


