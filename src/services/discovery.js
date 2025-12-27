function discoverProfiles(input) {
    const profiles = { instagram: null };
  
    if (input.includes("instagram.com")) {
      profiles.instagram = input
        .split("instagram.com/")[1]
        .split("/")[0]
        .trim();
    }
  
    return profiles;
  }
  
  module.exports = { discoverProfiles };
  