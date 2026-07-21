/* =========================================================
   THE PACK — data file
   This is the single source of truth for the public site.
   Edit it by hand, OR use admin/admin.html locally and export
   a new version of this file, then commit + push it.
   ========================================================= */

const RARITIES = {
  common:    { label: "Common",    color: "#8992A6", order: 1 },
  rare:      { label: "Rare",      color: "#4FD1C5", order: 2 },
  epic:      { label: "Epic",      color: "#B98CE8", order: 3 },
  legendary: { label: "Legendary", color: "#FFC24B", order: 4 },
};

const CARDS = [
  { name:"Nova Byte",     handle:"@novabyte",     platform:"Twitch",  game:"Speedrunning",     followers:"482K", peak:"18.2K", rarity:"legendary", img:null, hue:210 },
  { name:"Kessler",       handle:"@kessler_live", platform:"YouTube", game:"Strategy",         followers:"210K", peak:"6.4K",  rarity:"epic",      img:null, hue:265 },
  { name:"Pixel Sage",    handle:"@pixelsage",    platform:"Twitch",  game:"Retro Platformers",followers:"96K",  peak:"2.1K",  rarity:"rare",      img:null, hue:150 },
  { name:"Marrow",        handle:"@marrowplays",  platform:"Kick",    game:"Horror",           followers:"58K",  peak:"1.3K",  rarity:"common",    img:null, hue:5 },
  { name:"Vantablack",    handle:"@vanta",        platform:"Twitch",  game:"FPS Ranked",       followers:"640K", peak:"24.7K", rarity:"legendary", img:null, hue:280 },
  { name:"Coral & Co.",   handle:"@coralco",      platform:"YouTube", game:"Just Chatting",    followers:"133K", peak:"3.8K",  rarity:"rare",      img:null, hue:20 },
  { name:"Driftwood",     handle:"@driftwoodgg",  platform:"Twitch",  game:"Survival Craft",   followers:"77K",  peak:"1.9K",  rarity:"common",    img:null, hue:40 },
  { name:"Ember Rae",     handle:"@emberrae",     platform:"Kick",    game:"Rhythm Games",     followers:"301K", peak:"9.6K",  rarity:"epic",      img:null, hue:335 },
];