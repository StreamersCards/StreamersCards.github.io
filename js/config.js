/* ============================================================
   STREAMERCARDS — CONFIG
   This is the ONLY file you need to touch to add/change cards.
   Everything the site renders (collections, cards, rarities,
   colors, images) is read from the objects below.
   ============================================================ */

/* ------------------------------------------------------------
   1. RARITIES
   Add, rename, remove, or recolor tiers here. "weight" controls
   sort order (higher = rarer, shown first inside a set).
   "glow" is used for the border + hover foil-sheen color.
   Set holo:true to give a tier the animated rainbow foil sweep
   instead of a flat color sheen (reserve this for your top tier).
   ------------------------------------------------------------ */
const RARITIES = {
  common: {
    label: "Common",
    color: "#9AA3B2",
    glow: "rgba(154, 163, 178, 0.55)",
    weight: 1,
    holo: false,
  },
  rare: {
    label: "Rare",
    color: "#4C8DFF",
    glow: "rgba(76, 141, 255, 0.55)",
    weight: 2,
    holo: false,
  },
  epic: {
    label: "Epic",
    color: "#B15CFF",
    glow: "rgba(177, 92, 255, 0.6)",
    weight: 3,
    holo: false,
  },
  legendary: {
    label: "Legendary",
    color: "#FFB627",
    glow: "rgba(255, 182, 39, 0.65)",
    weight: 4,
    holo: false,
  },
  mythic: {
    label: "Mythic",
    color: "#2FD9C4",
    glow: "rgba(47, 217, 196, 0.7)",
    weight: 5,
    holo: true, // gets the rainbow foil sweep
  },
};

/* ------------------------------------------------------------
   2. COLLECTIONS (a.k.a. "sets" / categories)
   Each collection is a shelf on the home page. "cover" is the
   image shown on the home page tile — doesn't have to be a card
   image, can be dedicated cover art.
   ------------------------------------------------------------ */
const COLLECTIONS = [
  {
    id: "launch-series",
    name: "Launch Series",
    tagline: "The first drop. Where every collection starts.",
    cover: "images/covers/launch-series.png",
    accent: "#4C8DFF",
    cards: [
      {
        id: "ls-001",
        name: "ODED SVR",
        number: "001/040",
        rarity: "common",
        image: "images/cards/ls-001.png",
        description: "Code: 4566-8583-AB99",
      },
      {
        id: "ls-002",
        name: "PYSDED",
        number: "002/040",
        rarity: "common",
        image: "images/cards/ls-002.png",
        description: "Code: 4566-8583-AB99",
      },
      {
        id: "ls-003",
        name: "ODED SVR (SuperCharged)",
        number: "003/040",
        rarity: "rare",
        image: "images/cards/ls-003.png",
        description: "Code: 4566-8583-AB99",
      },
      {
        id: "ls-027",
        name: "Sub Goal Hit",
        number: "027/040",
        rarity: "epic",
        image: "images/cards/ls-027.png",
        description: "Confetti cannon, air horn, the works.",
      },
      {
        id: "ls-040",
        name: "Founder's Edition",
        number: "040/040",
        rarity: "legendary",
        image: "images/cards/ls-040.png",
        description: "Only printed for the very first run. Signed in the metadata.",
      },
    ],
  },
  {
    id: "season-2-rivals",
    name: "Season 2: Rivals",
    tagline: "Two channels enter. One thumbnail wins.",
    cover: "images/covers/season-2-rivals.png",
    accent: "#B15CFF",
    cards: [
      {
        id: "s2-003",
        name: "Trash Talk",
        number: "003/035",
        rarity: "common",
        image: "images/cards/s2-003.png",
        description: "Pre-match banter, purely for the plot.",
      },
      {
        id: "s2-011",
        name: "Comeback Arc",
        number: "011/035",
        rarity: "rare",
        image: "images/cards/s2-011.png",
        description: "Down 0-2, then everything changes.",
      },
      {
        id: "s2-019",
        name: "Overtime",
        number: "019/035",
        rarity: "epic",
        image: "images/cards/s2-019.png",
        description: "Nobody in chat is blinking right now.",
      },
      {
        id: "s2-035",
        name: "Rivalry Trophy",
        number: "035/035",
        rarity: "mythic",
        image: "images/cards/s2-035.png",
        description: "Holo-foil. Only the winner gets one of these.",
      },
    ],
  },
  {
    id: "legendary-vault",
    name: "Legendary Vault",
    tagline: "Rare pulls only. No filler cards in this set.",
    cover: "images/covers/legendary-vault.png",
    accent: "#FFB627",
    cards: [
      {
        id: "lv-002",
        name: "1 Million Subs",
        number: "002/012",
        rarity: "legendary",
        image: "images/cards/lv-002.png",
        description: "The banner that took three years to earn.",
      },
      {
        id: "lv-005",
        name: "24 Hour Marathon",
        number: "005/012",
        rarity: "legendary",
        image: "images/cards/lv-005.png",
        description: "Voice completely gone by hour twenty.",
      },
      {
        id: "lv-012",
        name: "Hall of Fame",
        number: "012/012",
        rarity: "mythic",
        image: "images/cards/lv-012.png",
        description: "The rarest pull in the vault. Foil never sits still.",
      },
    ],
  },
];

/* ------------------------------------------------------------
   3. SITE SETTINGS
   ------------------------------------------------------------ */
const SITE = {
  name: "StreamerCards",
  tagline: "Every clip. Every clutch. Collect the moment.",
  // Shown when a card image fails to load (e.g. placeholder not replaced yet).
  fallbackImage: "images/cards/_missing.png",
};

/* Expose everything to app.js */
window.STREAMERCARDS_CONFIG = { RARITIES, COLLECTIONS, SITE };