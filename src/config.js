/**
 * GLOSSÉ Brand Configuration
 * Centralized settings for brand identity, shades, ingredients, and copy.
 */

export const BRAND_CONFIG = {
  name: "GLOSSÉ",
  namePronunciation: "glos-SAY",
  tagline: "Liquid Glass. Pure Radiance.",
  subtitle: "Cushion-glide lip glaze infused with botanical peptides and multi-dimensional starlight glitter.",
  currency: "$",
  defaultShadeId: "wine-starlight", // Hero default shade is now deep Wine Red

  theme: {
    pearlyPink: "#FFD1DC",
    milkyPeach: "#FFE5D9",
    softLilac: "#E8D7F1",
    champagneGold: "#F5E6CA",
    wineRed: "#5C0C25",
    deepBerry: "#3B0718",
    darkAccent: "#140309",
    glassBorder: "rgba(255, 255, 255, 0.45)",
    glassBg: "rgba(255, 255, 255, 0.22)"
  },

  shades: [
    {
      id: "wine-starlight",
      name: "Cabernet Glaze",
      toneName: "Deep Bordeaux Wine Red",
      hex: "#5C0C25",
      liquidHex: "#52091F",
      glitterColor: "#FFC2D1",
      sheenColor: "#99183C",
      price: 28,
      badge: "Signature Hero",
      finish: "Vinous Diamond Lacquer",
      opacity: 0.92,
      ior: 1.50,
      image: "/images/04_prismatic_ruby_lips.png",
      description: "A decadent, ultra-rich bordeaux wine red dripping with starlit diamond micro-pearls. Unapologetically deep, glassy, and intensely reflective."
    },
    {
      id: "rose-quartz",
      name: "Rose Quartz",
      toneName: "Pearly Petal Pink",
      hex: "#E57599",
      liquidHex: "#E0688F",
      glitterColor: "#FFF0F5",
      sheenColor: "#FFC2D1",
      price: 28,
      badge: "Bestseller",
      finish: "Diamond Prism Glaze",
      opacity: 0.72,
      ior: 1.44,
      image: "/images/02_model_holding_gloss.png",
      description: "A celestial baby petal pink laced with iridescent crushed diamond micro-pearls that catch every beam of ambient light."
    },
    {
      id: "peach-fizz",
      name: "Peach Fizz",
      toneName: "Warm Nectar Champagne",
      hex: "#F28C68",
      liquidHex: "#E87A54",
      glitterColor: "#FFE4B5",
      sheenColor: "#FFD1B3",
      price: 28,
      badge: "Trending",
      finish: "Golden Hour Glow",
      opacity: 0.75,
      ior: 1.45,
      image: "/images/03_wand_applicator_lips.png",
      description: "Sun-drenched milky peach loaded with champagne gold sparkles for an effortlessly juicy, warm glass pout."
    },
    {
      id: "berry-bloom",
      name: "Berry Bloom",
      toneName: "Crushed Raspberry Nectar",
      hex: "#8A184A",
      liquidHex: "#801242",
      glitterColor: "#F3A9DE",
      sheenColor: "#C94277",
      price: 28,
      badge: "Iconic",
      finish: "High-Pigment Lacquer",
      opacity: 0.85,
      ior: 1.48,
      image: "/images/04_prismatic_ruby_lips.png",
      description: "A sultry rich boysenberry glaze bursting with prismatic ruby sparkles. High-drama contrast with glassy mirror shine."
    },
    {
      id: "lilac-dream",
      name: "Lilac Dream",
      toneName: "Holographic Lavender",
      hex: "#B185DB",
      liquidHex: "#A270D0",
      glitterColor: "#EADBF9",
      sheenColor: "#D6B8F6",
      price: 28,
      badge: "New",
      finish: "Opal Hologram",
      opacity: 0.70,
      ior: 1.43,
      image: "/images/05_holographic_sparkle_pout.png",
      description: "Dreamy Y2K ethereal lilac laced with multi-chrome pearl shifts from crystalline violet to sky blue starlight."
    },
    {
      id: "gold-rush",
      name: "Gold Rush",
      toneName: "Liquid Champagne Honey",
      hex: "#D4AF37",
      liquidHex: "#C9A028",
      glitterColor: "#FFF8DC",
      sheenColor: "#F4E3A1",
      price: 28,
      badge: "Limited Edition",
      finish: "Molten 24K Sparkle",
      opacity: 0.68,
      ior: 1.46,
      image: "/images/07_five_shades_collection.png",
      description: "Decadent pure golden nectar floating with starlit micro-flakes. Wear alone or layer over any lip color for liquid gold reflections."
    },
    {
      id: "clear-glaze",
      name: "Clear Glaze",
      toneName: "Crystal Mirror Glass",
      hex: "#EAF6FF",
      liquidHex: "#D5EDFD",
      glitterColor: "#FFFFFF",
      sheenColor: "#FFFFFF",
      price: 26,
      badge: "Essential",
      finish: "Mirror Wet-Look",
      opacity: 0.35,
      ior: 1.50,
      image: "/images/01_kiko_style_tube.png",
      description: "The holy-grail clear lip gloss. Non-sticky cushion formula that delivers vinyl wet reflections and 12-hour barrier repair."
    }
  ],

  ingredients: [
    {
      id: "jojoba",
      name: "Golden Jojoba Elixir",
      type: "Deep Lipid Lock",
      icon: "💧",
      color: "#E5A93C",
      description: "Biocompatible cold-pressed oil that mimics natural skin lipids to heal barrier cracking and seal in mirror moisture."
    },
    {
      id: "shea",
      name: "Whipped Wild Shea",
      type: "Cushion Comfort",
      icon: "✨",
      color: "#F5EAD4",
      description: "Ethically harvested African shea butter delivers a pillow-soft cushion feel without a trace of tackiness."
    },
    {
      id: "vit-e",
      name: "Vitamin E Acetate",
      type: "Antioxidant Shield",
      icon: "🌸",
      color: "#F37E96",
      description: "Potent free-radical neutralizing shield that keeps lips plump, smooth, and protected from environmental dryness."
    },
    {
      id: "pearls",
      name: "Crushed Mica Pearls",
      type: "Starlight Refraction",
      icon: "💎",
      color: "#D8C7F8",
      description: "Micro-milled optical prisms suspended evenly to scatter ambient light into a soft-focus holographic wet sheen."
    }
  ],

  stats: [
    { value: 340, suffix: "%", label: "Instant Lip Hydration Surge" },
    { value: 12, suffix: "H", label: "Cushion Non-Sticky Glass Wear" },
    { value: 100, suffix: "%", label: "Vegan, Cruelty-Free & Clean" },
    { value: 96, suffix: "%", label: "Tested Agreed Lips Look Visibly Plumper" }
  ],

  lookbook: [
    {
      id: 1,
      title: "Signature Bordeaux Glaze",
      shade: "Cabernet Glaze",
      category: "Campaign",
      image: "/images/02_model_holding_gloss.png",
      aspect: "portrait"
    },
    {
      id: 2,
      title: "Starlight Wand Drench",
      shade: "Peach Fizz",
      category: "Macro Focus",
      image: "/images/03_wand_applicator_lips.png",
      aspect: "landscape"
    },
    {
      id: 3,
      title: "Prismatic Ruby Flare",
      shade: "Berry Bloom",
      category: "Editorial",
      image: "/images/04_prismatic_ruby_lips.png",
      aspect: "portrait"
    },
    {
      id: 4,
      title: "Ethereal Opal Pout",
      shade: "Lilac Dream",
      category: "High Glam",
      image: "/images/05_holographic_sparkle_pout.png",
      aspect: "landscape"
    },
    {
      id: 5,
      title: "Duo-Chrome Flacon Bite",
      shade: "Rose Quartz",
      category: "Runway",
      image: "/images/06_lip_bite_duochrome.png",
      aspect: "portrait"
    },
    {
      id: 6,
      title: "The 5-Tone Starlight Wardrobe",
      shade: "Full Collection",
      category: "Collector Set",
      image: "/images/07_five_shades_collection.png",
      aspect: "landscape"
    }
  ]
};
