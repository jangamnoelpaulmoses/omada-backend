function discoverProfiles(input) {
    const profiles = { instagram: null };
  
    if (input.includes("instagram.com")) {
      profiles.instagram = input
        .split("instagram.com/")[1]
        .split("/")[0]
        .trim();
    }
    if (input.includes("facebook.com")) {
        profiles.facebook = input
          .split("facebook.com/")[1]
          .split("/")[0]
          .replace("profile.php?id=", "")
          .trim();
      }
    
  
    return profiles;
  }
  
  module.exports = { discoverProfiles };
  