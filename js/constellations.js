/**
 * Star Quest - Constellation System & Celestial Sky Gallery
 * Features 14 authentic, meaningful constellations with real astronomy data,
 * star coordinates, line connections, kid-friendly lore, and an interactive
 * panoramic Night Sky Gallery where every unlocked constellation is present.
 */

const CONSTELLATIONS_CATALOG = [
  {
    id: 'lyra',
    name: 'Lyra',
    english: 'The Celestial Harp',
    icon: '🎵',
    color: '#38bdf8',
    glowColor: '#0284c7',
    bestStar: 'Vega (Sapphire blue super-star)',
    lore: "Vega in Lyra is one of the brightest jewels in the night sky! 14,000 years ago it was Earth's North Star, and in 12,000 years it will guide travelers again.",
    skyX: 0.48,
    skyY: 0.38,
    skyScale: 0.22,
    stars: [
      { x: 0.48, y: 0.15, name: 'Vega', mag: 1.0, primary: true, color: '#93c5fd' },
      { x: 0.68, y: 0.26, name: 'Epsilon Lyrae', mag: 0.6, color: '#ffffff' },
      { x: 0.38, y: 0.36, name: 'Zeta Lyrae', mag: 0.6, color: '#bae6fd' },
      { x: 0.64, y: 0.46, name: 'Delta Lyrae', mag: 0.6, color: '#fef08a' },
      { x: 0.34, y: 0.82, name: 'Sheliak', mag: 0.7, color: '#e0f2fe' },
      { x: 0.60, y: 0.86, name: 'Sulafat', mag: 0.7, color: '#e0f2fe' }
    ],
    lines: [
      [0, 1], [0, 2], [1, 2],
      [1, 3], [2, 3], [3, 5], [5, 4], [4, 2]
    ]
  },
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    english: 'The Great Bear & Big Dipper',
    icon: '🐻',
    color: '#ffd166',
    glowColor: '#f59e0b',
    bestStar: 'Dubhe & Merak (The Pointers)',
    lore: "The two outer stars in the Big Dipper's bowl point straight to Polaris, the North Star! Explorers have used this secret pointer for thousands of years.",
    skyX: 0.15,
    skyY: 0.24,
    skyScale: 0.26,
    stars: [
      { x: 0.62, y: 0.38, name: 'Dubhe', mag: 0.9, primary: true, color: '#fef08a' },
      { x: 0.60, y: 0.62, name: 'Merak', mag: 0.8, color: '#ffffff' },
      { x: 0.44, y: 0.64, name: 'Phecda', mag: 0.7, color: '#ffffff' },
      { x: 0.46, y: 0.40, name: 'Megrez', mag: 0.6, color: '#ffffff' },
      { x: 0.32, y: 0.35, name: 'Alioth', mag: 0.8, color: '#ffffff' },
      { x: 0.20, y: 0.28, name: 'Mizar', mag: 0.8, color: '#bae6fd' },
      { x: 0.08, y: 0.32, name: 'Alkaid', mag: 0.8, color: '#93c5fd' },
      { x: 0.86, y: 0.24, name: 'Muscida', mag: 0.6, color: '#ffffff' },
      { x: 0.80, y: 0.78, name: 'Tania', mag: 0.5, color: '#ffffff' },
      { x: 0.82, y: 0.48, name: 'Talitha', mag: 0.6, color: '#ffffff' },
      { x: 0.36, y: 0.88, name: 'Alula', mag: 0.5, color: '#ffffff' }
    ],
    lines: [
      [6, 5], [5, 4], [4, 3],
      [3, 0], [0, 1], [1, 2], [2, 3],
      [0, 7], [3, 7], [7, 9],
      [1, 8], [2, 10]
    ]
  },
  {
    id: 'orion',
    name: 'Orion',
    english: 'The Cosmic Hunter',
    icon: '🏹',
    color: '#f472b6',
    glowColor: '#db2777',
    bestStar: 'Betelgeuse & Rigel',
    lore: "Betelgeuse is a glowing red supergiant so vast that 1,000 suns could fit across it! Across from it shines Rigel, with the glowing stellar nursery of Orion's Sword hanging from his belt.",
    skyX: 0.50,
    skyY: 0.68,
    skyScale: 0.26,
    stars: [
      { x: 0.28, y: 0.22, name: 'Betelgeuse', mag: 1.0, primary: true, color: '#fb923c' },
      { x: 0.72, y: 0.24, name: 'Bellatrix', mag: 0.8, color: '#bae6fd' },
      { x: 0.50, y: 0.12, name: 'Meissa', mag: 0.6, color: '#ffffff' },
      { x: 0.40, y: 0.48, name: 'Alnitak', mag: 0.8, color: '#ffffff' },
      { x: 0.50, y: 0.47, name: 'Alnilam', mag: 0.8, color: '#ffffff' },
      { x: 0.60, y: 0.46, name: 'Mintaka', mag: 0.8, color: '#ffffff' },
      { x: 0.32, y: 0.82, name: 'Saiph', mag: 0.8, color: '#ffffff' },
      { x: 0.70, y: 0.80, name: 'Rigel', mag: 1.0, primary: true, color: '#93c5fd' },
      { x: 0.88, y: 0.34, name: 'Tabit', mag: 0.5, color: '#ffffff' },
      { x: 0.86, y: 0.50, name: 'Pi Orionis', mag: 0.5, color: '#ffffff' },
      { x: 0.20, y: 0.06, name: 'Chi Orionis', mag: 0.5, color: '#ffffff' },
      { x: 0.49, y: 0.56, name: 'Theta Ori (M42)', mag: 0.7, primary: true, color: '#f472b6' },
      { x: 0.48, y: 0.64, name: 'Hatysa', mag: 0.6, color: '#bae6fd' }
    ],
    lines: [
      [0, 2], [2, 1], [0, 1],
      [0, 10],
      [0, 3], [1, 5],
      [3, 4], [4, 5],
      [4, 11], [11, 12],
      [3, 6], [5, 7], [6, 7],
      [1, 8], [8, 9]
    ]
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    english: 'The Star Queen',
    icon: '👑',
    color: '#a78bfa',
    glowColor: '#7c3aed',
    bestStar: 'Schedar (The Royal Heart)',
    lore: "Cassiopeia circles the North Star all year round like a sparkling crown or the cosmic letter 'W' resting right in the middle of the Milky Way!",
    skyX: 0.75,
    skyY: 0.18,
    skyScale: 0.22,
    stars: [
      { x: 0.12, y: 0.56, name: 'Caph', mag: 0.8, color: '#fef08a' },
      { x: 0.32, y: 0.72, name: 'Schedar', mag: 0.9, primary: true, color: '#fed7aa' },
      { x: 0.50, y: 0.38, name: 'Navi', mag: 0.9, color: '#93c5fd' },
      { x: 0.72, y: 0.62, name: 'Ruchbah', mag: 0.8, color: '#ffffff' },
      { x: 0.88, y: 0.34, name: 'Segin', mag: 0.7, color: '#ffffff' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4]
    ]
  },
  {
    id: 'cygnus',
    name: 'Cygnus',
    english: 'The Northern Swan',
    icon: '🦢',
    color: '#06d6a0',
    glowColor: '#059669',
    bestStar: 'Deneb & Albireo',
    lore: "Deneb sits at the tail of the swan soaring down the Milky Way. At its beak shines Albireo: two dancing stars, one golden topaz and one sapphire blue!",
    skyX: 0.65,
    skyY: 0.38,
    skyScale: 0.24,
    stars: [
      { x: 0.50, y: 0.12, name: 'Deneb', mag: 1.0, primary: true, color: '#ffffff' },
      { x: 0.50, y: 0.45, name: 'Sadr', mag: 0.8, color: '#fef08a' },
      { x: 0.50, y: 0.88, name: 'Albireo', mag: 0.8, primary: true, color: '#fbbf24' },
      { x: 0.20, y: 0.38, name: 'Gienah', mag: 0.8, color: '#ffffff' },
      { x: 0.06, y: 0.28, name: 'Zeta Cygni', mag: 0.6, color: '#bae6fd' },
      { x: 0.80, y: 0.40, name: 'Fawaris', mag: 0.8, color: '#ffffff' },
      { x: 0.94, y: 0.32, name: 'Iota Cygni', mag: 0.6, color: '#bae6fd' }
    ],
    lines: [
      [0, 1], [1, 2], [4, 3], [3, 1], [1, 5], [5, 6]
    ]
  },
  {
    id: 'leo',
    name: 'Leo',
    english: 'The Cosmic Lion',
    icon: '🦁',
    color: '#fbbf24',
    glowColor: '#d97706',
    bestStar: 'Regulus (Heart of the Lion)',
    lore: "Regulus is known as the 'Little King' star. Leo heralds the arrival of springtime in the night sky with its backward question-mark mane!",
    skyX: 0.14,
    skyY: 0.56,
    skyScale: 0.25,
    stars: [
      { x: 0.35, y: 0.76, name: 'Regulus', mag: 1.0, primary: true, color: '#bae6fd' },
      { x: 0.36, y: 0.54, name: 'Eta Leonis', mag: 0.7, color: '#ffffff' },
      { x: 0.45, y: 0.40, name: 'Algieba', mag: 0.8, color: '#fed7aa' },
      { x: 0.42, y: 0.24, name: 'Adhafera', mag: 0.7, color: '#ffffff' },
      { x: 0.55, y: 0.16, name: 'Ras Elased', mag: 0.7, color: '#fef08a' },
      { x: 0.64, y: 0.26, name: 'Alterf', mag: 0.6, color: '#ffffff' },
      { x: 0.72, y: 0.38, name: 'Zosma', mag: 0.8, color: '#ffffff' },
      { x: 0.68, y: 0.68, name: 'Chertan', mag: 0.7, color: '#ffffff' },
      { x: 0.90, y: 0.48, name: 'Denebola', mag: 0.8, color: '#93c5fd' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
      [2, 6], [6, 8], [8, 7], [7, 6], [7, 0]
    ]
  },
  {
    id: 'pegasus',
    name: 'Pegasus',
    english: 'The Winged Horse',
    icon: '🐴',
    color: '#c084fc',
    glowColor: '#9333ea',
    bestStar: 'Markab & Scheat',
    lore: "The Great Square of Pegasus is so vast that inside its cosmic starry frame, astronomers have discovered thousands of distant mystery galaxies!",
    skyX: 0.88,
    skyY: 0.38,
    skyScale: 0.24,
    stars: [
      { x: 0.35, y: 0.65, name: 'Markab', mag: 0.9, primary: true, color: '#bae6fd' },
      { x: 0.35, y: 0.30, name: 'Scheat', mag: 0.9, color: '#fed7aa' },
      { x: 0.68, y: 0.30, name: 'Alpheratz', mag: 0.8, color: '#ffffff' },
      { x: 0.68, y: 0.65, name: 'Algenib', mag: 0.8, color: '#ffffff' },
      { x: 0.20, y: 0.50, name: 'Homam', mag: 0.6, color: '#ffffff' },
      { x: 0.12, y: 0.40, name: 'Biham', mag: 0.6, color: '#ffffff' },
      { x: 0.04, y: 0.28, name: 'Enif', mag: 0.8, color: '#fed7aa' },
      { x: 0.25, y: 0.16, name: 'Matar', mag: 0.6, color: '#ffffff' },
      { x: 0.15, y: 0.06, name: 'Pi Pegasi', mag: 0.5, color: '#ffffff' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [0, 4], [4, 5], [5, 6],
      [1, 7], [7, 8]
    ]
  },
  {
    id: 'canis-major',
    name: 'Canis Major',
    english: 'The Great Dog',
    icon: '🐕',
    color: '#00f5d4',
    glowColor: '#0d9488',
    bestStar: 'Sirius (The Brightest Star in the Sky!)',
    lore: "Sirius is the brightest star in the entire night sky! It shines more than 20 times brighter than our Sun and glitters with vibrant rainbow sparkles.",
    skyX: 0.52,
    skyY: 0.90,
    skyScale: 0.22,
    stars: [
      { x: 0.45, y: 0.22, name: 'Sirius', mag: 1.2, primary: true, color: '#e0f2fe' },
      { x: 0.25, y: 0.26, name: 'Murzim', mag: 0.8, color: '#bae6fd' },
      { x: 0.56, y: 0.14, name: 'Muliphein', mag: 0.6, color: '#ffffff' },
      { x: 0.50, y: 0.58, name: 'Wezen', mag: 0.8, color: '#fed7aa' },
      { x: 0.38, y: 0.78, name: 'Adhara', mag: 0.9, color: '#bae6fd' },
      { x: 0.28, y: 0.90, name: 'Furud', mag: 0.6, color: '#ffffff' },
      { x: 0.68, y: 0.70, name: 'Aludra', mag: 0.7, color: '#93c5fd' }
    ],
    lines: [
      [1, 0], [0, 2], [0, 3], [3, 4], [4, 5], [3, 6]
    ]
  },
  {
    id: 'monoceros',
    name: 'Monoceros',
    english: 'The Magical Unicorn',
    icon: '🦄',
    color: '#f43f5e',
    glowColor: '#be123c',
    bestStar: 'Beta Monocerotis (Triple Star)',
    lore: "The Unicorn gallops quietly right beside Orion! Its chest star Beta Monocerotis is a wondrous trio of three sparkling blue-white stars dancing together.",
    skyX: 0.68,
    skyY: 0.70,
    skyScale: 0.22,
    stars: [
      { x: 0.48, y: 0.08, name: 'S Monocerotis', mag: 0.8, primary: true, color: '#fed7aa' },
      { x: 0.52, y: 0.26, name: 'Epsilon Mon', mag: 0.7, color: '#ffffff' },
      { x: 0.44, y: 0.44, name: 'Alpha Mon', mag: 0.7, color: '#fed7aa' },
      { x: 0.28, y: 0.60, name: 'Beta Mon', mag: 0.9, color: '#bae6fd' },
      { x: 0.18, y: 0.86, name: 'Delta Mon', mag: 0.6, color: '#ffffff' },
      { x: 0.66, y: 0.50, name: 'Gamma Mon', mag: 0.7, color: '#fed7aa' },
      { x: 0.80, y: 0.64, name: 'Zeta Mon', mag: 0.6, color: '#ffffff' },
      { x: 0.72, y: 0.88, name: '13 Monocerotis', mag: 0.6, color: '#ffffff' },
      { x: 0.92, y: 0.58, name: "Plaskett's Star", mag: 0.6, color: '#f472b6' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [2, 5], [5, 6], [6, 8],
      [3, 4], [6, 7]
    ]
  },
  {
    id: 'taurus',
    name: 'Taurus',
    english: 'The Celestial Bull',
    icon: '🐂',
    color: '#f97316',
    glowColor: '#c2410c',
    bestStar: 'Aldebaran (Giant Orange Eye)',
    lore: "Aldebaran is a giant glowing orange eye staring across the galaxy! Resting on the bull's shoulder is the Pleiades cluster, known as the Seven Sisters.",
    skyX: 0.32,
    skyY: 0.62,
    skyScale: 0.24,
    stars: [
      { x: 0.42, y: 0.50, name: 'Aldebaran', mag: 1.1, primary: true, color: '#fb923c' },
      { x: 0.48, y: 0.38, name: 'Ain', mag: 0.7, color: '#fed7aa' },
      { x: 0.34, y: 0.42, name: 'Hyadum', mag: 0.7, color: '#ffffff' },
      { x: 0.74, y: 0.16, name: 'Elnath', mag: 0.8, color: '#93c5fd' },
      { x: 0.70, y: 0.46, name: 'Tianguan', mag: 0.7, color: '#ffffff' },
      { x: 0.14, y: 0.24, name: 'Pleiades (M45)', mag: 0.9, color: '#bae6fd' },
      { x: 0.28, y: 0.66, name: 'Lambda Tauri', mag: 0.6, color: '#ffffff' },
      { x: 0.18, y: 0.86, name: 'Xi Tauri', mag: 0.5, color: '#ffffff' }
    ],
    lines: [
      [2, 0], [0, 1], [1, 2], [1, 3], [0, 4], [0, 6], [6, 7], [6, 5]
    ]
  },
  {
    id: 'ursa-minor',
    name: 'Ursa Minor',
    english: 'The Little Bear & North Star',
    icon: '🌟',
    color: '#38bdf8',
    glowColor: '#0284c7',
    bestStar: 'Polaris (The North Star)',
    lore: "Polaris sits right over Earth's North Pole. While the rest of the night sky slowly wheels in a circle, Polaris stands faithfully in place!",
    skyX: 0.50,
    skyY: 0.16,
    skyScale: 0.20,
    stars: [
      { x: 0.15, y: 0.20, name: 'Polaris', mag: 1.1, primary: true, color: '#ffffff' },
      { x: 0.30, y: 0.30, name: 'Yildun', mag: 0.6, color: '#ffffff' },
      { x: 0.44, y: 0.36, name: 'Urodelus', mag: 0.6, color: '#ffffff' },
      { x: 0.58, y: 0.42, name: 'Ahfa', mag: 0.6, color: '#ffffff' },
      { x: 0.76, y: 0.34, name: 'Pherkad', mag: 0.7, color: '#bae6fd' },
      { x: 0.82, y: 0.56, name: 'Kochab', mag: 0.9, primary: true, color: '#fed7aa' },
      { x: 0.64, y: 0.62, name: 'Anwar', mag: 0.6, color: '#ffffff' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]
    ]
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    english: 'The Starlight Firebird',
    icon: '🔥',
    color: '#e11d48',
    glowColor: '#9f1239',
    bestStar: 'Ankaa (The Blazing Crown)',
    lore: "The mythic Phoenix represents courage and glowing rebirth! Its wings stretch wide across the southern starlight in fiery golden sparks.",
    skyX: 0.84,
    skyY: 0.80,
    skyScale: 0.22,
    stars: [
      { x: 0.50, y: 0.16, name: 'Ankaa', mag: 1.0, primary: true, color: '#fed7aa' },
      { x: 0.50, y: 0.44, name: 'Beta Phoenicis', mag: 0.7, color: '#fef08a' },
      { x: 0.12, y: 0.30, name: 'Wurren', mag: 0.7, color: '#fca5a5' },
      { x: 0.30, y: 0.40, name: 'Gamma Phoenicis', mag: 0.6, color: '#ffffff' },
      { x: 0.88, y: 0.30, name: 'Epsilon Phoenicis', mag: 0.7, color: '#fca5a5' },
      { x: 0.70, y: 0.40, name: 'Delta Phoenicis', mag: 0.6, color: '#ffffff' },
      { x: 0.40, y: 0.86, name: 'Eta Phoenicis', mag: 0.6, color: '#fca5a5' },
      { x: 0.60, y: 0.86, name: 'Psi Phoenicis', mag: 0.6, color: '#fca5a5' }
    ],
    lines: [
      [0, 1], [2, 3], [3, 1], [1, 5], [5, 4], [1, 6], [1, 7]
    ]
  },
  {
    id: 'draco',
    name: 'Draco',
    english: 'The Cosmic Dragon',
    icon: '🐉',
    color: '#10b981',
    glowColor: '#047857',
    bestStar: 'Thuban & Eltanin',
    lore: "Draco winds gracefully between Ursa Major and Ursa Minor. 4,500 years ago, its star Thuban was the North Star when the Great Pyramids were built!",
    skyX: 0.32,
    skyY: 0.20,
    skyScale: 0.24,
    stars: [
      { x: 0.84, y: 0.16, name: 'Eltanin', mag: 0.9, primary: true, color: '#fed7aa' },
      { x: 0.76, y: 0.14, name: 'Rastaban', mag: 0.8, color: '#fef08a' },
      { x: 0.72, y: 0.24, name: 'Grumium', mag: 0.6, color: '#ffffff' },
      { x: 0.82, y: 0.28, name: 'Kuma', mag: 0.6, color: '#ffffff' },
      { x: 0.62, y: 0.30, name: 'Tyl', mag: 0.6, color: '#ffffff' },
      { x: 0.48, y: 0.28, name: 'Aldhibah', mag: 0.6, color: '#ffffff' },
      { x: 0.36, y: 0.38, name: 'Edasich', mag: 0.7, color: '#fed7aa' },
      { x: 0.26, y: 0.50, name: 'Giausar', mag: 0.6, color: '#ffffff' },
      { x: 0.20, y: 0.68, name: 'Thuban', mag: 0.8, primary: true, color: '#bae6fd' },
      { x: 0.10, y: 0.82, name: 'Gianfar', mag: 0.6, color: '#ffffff' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [2, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9]
    ]
  },
  {
    id: 'delphinus',
    name: 'Delphinus',
    english: 'The Cosmic Dolphin',
    icon: '🐬',
    color: '#06b6d4',
    glowColor: '#0891b2',
    bestStar: 'Rotanev & Sualocin',
    lore: "Delphinus honors the magical dolphin who saved the poet-musician Arion! Its stars Rotanev and Sualocin are playful spellings of astronomer Nicolaus Venator.",
    skyX: 0.78,
    skyY: 0.52,
    skyScale: 0.16,
    stars: [
      { x: 0.44, y: 0.34, name: 'Rotanev', mag: 0.8, color: '#ffffff' },
      { x: 0.60, y: 0.28, name: 'Sualocin', mag: 0.8, primary: true, color: '#bae6fd' },
      { x: 0.62, y: 0.50, name: 'Delta Del', mag: 0.7, color: '#ffffff' },
      { x: 0.44, y: 0.54, name: 'Gamma Del', mag: 0.7, color: '#fed7aa' },
      { x: 0.30, y: 0.74, name: 'Deneb Dulfim', mag: 0.7, color: '#ffffff' },
      { x: 0.16, y: 0.86, name: 'Zeta Delphini', mag: 0.5, color: '#bae6fd' }
    ],
    lines: [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [3, 4], [4, 5]
    ]
  }
];

class ConstellationManager {
  constructor() {
    this.storageKey = 'lyra_unlocked_constellations_v2';
    this.historyKey = 'lyra_constellation_history_v2';
    this.catalog = CONSTELLATIONS_CATALOG;
    this.unlockedIds = this.loadUnlocked();
    this.history = this.loadHistory();
    this.selectedId = this.unlockedIds[0] || 'lyra';

    // Sky viewport pan and zoom
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.viewMode = 'sky'; // 'sky' | 'cards'

    // Ambient stars in the celestial dome
    this.ambientStars = this.generateAmbientStars(180);
  }

  generateAmbientStars(count) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.04 + 0.015,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
    return list;
  }

  loadUnlocked() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.storageKey));
      if (Array.isArray(saved) && saved.length > 0) {
        return saved;
      }
    } catch (e) {}

    // Migration from old lyra_constellation_days if available
    const oldDays = parseInt(localStorage.getItem('lyra_constellation_days') || '1', 10);
    const count = Math.max(1, Math.min(oldDays, this.catalog.length));
    const initial = [];
    for (let i = 0; i < count; i++) {
      initial.push(this.catalog[i].id);
    }
    this.saveUnlocked(initial);
    return initial;
  }

  saveUnlocked(ids) {
    this.unlockedIds = ids;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
      // Keep old key in sync for any legacy display
      localStorage.setItem('lyra_constellation_days', ids.length);
    } catch (e) {}
  }

  loadHistory() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.historyKey));
      if (Array.isArray(saved)) return saved;
    } catch (e) {}
    return [];
  }

  saveHistory(item) {
    this.history.unshift(item);
    try {
      localStorage.setItem(this.historyKey, JSON.stringify(this.history.slice(0, 50)));
    } catch (e) {}
  }

  getUnlocked() {
    return this.catalog.filter(c => this.unlockedIds.includes(c.id));
  }

  isUnlocked(id) {
    return this.unlockedIds.includes(id);
  }

  getConstellation(id) {
    return this.catalog.find(c => c.id === id) || this.catalog[0];
  }

  getLatest() {
    const lastId = this.unlockedIds[this.unlockedIds.length - 1];
    return this.getConstellation(lastId) || this.catalog[0];
  }

  /**
   * Called when a quest is completed!
   * Unlocks the next constellation, or re-forges the current one with star power.
   */
  forgeNextConstellation() {
    let nextConstellation = null;
    let isNew = false;

    // Find the first locked constellation in the catalog
    for (const c of this.catalog) {
      if (!this.unlockedIds.includes(c.id)) {
        nextConstellation = c;
        isNew = true;
        break;
      }
    }

    if (nextConstellation) {
      const updated = [...this.unlockedIds, nextConstellation.id];
      this.saveUnlocked(updated);
    } else {
      // All unlocked! Re-forge the latest or cycle
      const cycleIndex = (this.history.length) % this.catalog.length;
      nextConstellation = this.catalog[cycleIndex] || this.catalog[0];
      isNew = false;
    }

    this.selectedId = nextConstellation.id;

    const historyEntry = {
      id: nextConstellation.id,
      name: nextConstellation.name,
      date: typeof localDateStr === 'function' ? localDateStr() : new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      isNew
    };
    this.saveHistory(historyEntry);

    return {
      constellation: nextConstellation,
      isNew,
      totalUnlocked: this.unlockedIds.length,
      totalCatalog: this.catalog.length
    };
  }

  // =========================================================================
  // Rendering: Single Constellation (Close-up & Animation)
  // =========================================================================

  drawSingleConstellation(canvas, constellation, progress = 1.0, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Deep space gradient
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.65);
    bgGrad.addColorStop(0, '#1a0b38');
    bgGrad.addColorStop(0.65, '#0b0220');
    bgGrad.addColorStop(1, '#050110');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Nebula dust glow
    const nebGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 10, w * 0.5, h * 0.5, w * 0.45);
    nebGrad.addColorStop(0, `${constellation.color}25`);
    nebGrad.addColorStop(0.7, `${constellation.glowColor}10`);
    nebGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, w, h);

    // Ambient twinkling stars
    const now = Date.now() * 0.002;
    for (let i = 0; i < 35; i++) {
      const sx = ((Math.sin(i * 127 + 1) * 0.5 + 0.5) * w);
      const sy = ((Math.cos(i * 311 + 3) * 0.5 + 0.5) * h);
      const alpha = 0.2 + 0.25 * Math.sin(now + i);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    const pad = Math.min(w, h) * 0.15;
    const drawW = w - pad * 2;
    const drawH = h - pad * 2;

    const toX = (nx) => pad + nx * drawW;
    const toY = (ny) => pad + ny * drawH;

    const totalLines = constellation.lines.length;
    const totalStars = constellation.stars.length;

    // Draw lines based on progress
    const lineProgress = Math.min(1.0, progress * 1.15);
    const linesToDraw = Math.floor(lineProgress * totalLines);
    const partialLineRatio = (lineProgress * totalLines) - linesToDraw;

    ctx.save();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = constellation.color;
    ctx.shadowColor = constellation.color;
    ctx.shadowBlur = 12;

    for (let i = 0; i < linesToDraw; i++) {
      const [aIdx, bIdx] = constellation.lines[i];
      const ptA = constellation.stars[aIdx];
      const ptB = constellation.stars[bIdx];
      ctx.beginPath();
      ctx.moveTo(toX(ptA.x), toY(ptA.y));
      ctx.lineTo(toX(ptB.x), toY(ptB.y));
      ctx.stroke();
    }

    if (linesToDraw < totalLines && partialLineRatio > 0.01) {
      const [aIdx, bIdx] = constellation.lines[linesToDraw];
      const ptA = constellation.stars[aIdx];
      const ptB = constellation.stars[bIdx];
      const currX = toX(ptA.x) + (toX(ptB.x) - toX(ptA.x)) * partialLineRatio;
      const currY = toY(ptA.y) + (toY(ptB.y) - toY(ptA.y)) * partialLineRatio;
      ctx.beginPath();
      ctx.moveTo(toX(ptA.x), toY(ptA.y));
      ctx.lineTo(currX, currY);
      ctx.stroke();
    }
    ctx.restore();

    // Draw stars
    const starsProgress = Math.min(1.0, progress * 1.3);
    const starsToDraw = Math.floor(starsProgress * totalStars);

    constellation.stars.forEach((star, idx) => {
      if (idx > starsToDraw) return;

      const sx = toX(star.x);
      const sy = toY(star.y);
      const isPrimary = !!star.primary;
      const baseRadius = (isPrimary ? 6.5 : 4.5) * (star.mag || 1);

      // Star halo
      ctx.save();
      const haloGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, baseRadius * 3);
      haloGrad.addColorStop(0, star.color || '#fff');
      haloGrad.addColorStop(0.4, `${constellation.color}90`);
      haloGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(sx, sy, baseRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core star
      ctx.beginPath();
      ctx.arc(sx, sy, baseRadius, 0, Math.PI * 2);
      ctx.fillStyle = star.color || '#ffffff';
      ctx.shadowColor = star.color || constellation.color;
      ctx.shadowBlur = isPrimary ? 16 : 8;
      ctx.fill();

      // Diamond sparkle flare for primary stars
      if (isPrimary) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx - baseRadius * 2.2, sy);
        ctx.lineTo(sx + baseRadius * 2.2, sy);
        ctx.moveTo(sx, sy - baseRadius * 2.2);
        ctx.lineTo(sx, sy + baseRadius * 2.2);
        ctx.stroke();
      }

      // Star label if requested or for primary star
      if (options.showStarNames || isPrimary) {
        ctx.font = '700 11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'left';
        ctx.fillText(star.name, sx + baseRadius + 4, sy + 4);
      }
      ctx.restore();
    });
  }

  // =========================================================================
  // Rendering: Panoramic Sky Gallery Dome (All Present Together)
  // =========================================================================

  drawSkyGallery(canvas, options = {}) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Deep space celestial background
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 50, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    bgGrad.addColorStop(0, '#15082e');
    bgGrad.addColorStop(0.5, '#0c041f');
    bgGrad.addColorStop(0.85, '#050112');
    bgGrad.addColorStop(1, '#020008');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Milky Way celestial river dust band across the sky
    ctx.save();
    ctx.rotate(-0.25);
    const mwGrad = ctx.createLinearGradient(0, h * 0.2, w * 1.2, h * 0.8);
    mwGrad.addColorStop(0, 'rgba(56, 189, 248, 0.0)');
    mwGrad.addColorStop(0.4, 'rgba(244, 114, 182, 0.08)');
    mwGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.12)');
    mwGrad.addColorStop(0.6, 'rgba(0, 245, 212, 0.07)');
    mwGrad.addColorStop(1, 'rgba(255, 209, 102, 0.0)');
    ctx.fillStyle = mwGrad;
    ctx.fillRect(-w * 0.3, -h * 0.2, w * 1.6, h * 1.5);
    ctx.restore();

    // Ambient stars in background
    const nowTime = Date.now() * 0.0015;
    this.ambientStars.forEach(s => {
      const alpha = s.alpha * (0.6 + 0.4 * Math.sin(nowTime * 2 + s.twinklePhase));
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
      ctx.fillRect(s.x * w, s.y * h, s.size, s.size);
    });

    // Apply pan and zoom transforms
    ctx.save();
    ctx.translate(this.panX, this.panY);
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-w * 0.5, -h * 0.5);

    // Draw all constellations in their celestial regions
    this.catalog.forEach(constellation => {
      const isUnlocked = this.unlockedIds.includes(constellation.id);
      const isSelected = constellation.id === this.selectedId;

      this.renderSkyConstellation(ctx, constellation, w, h, isUnlocked, isSelected);
    });

    ctx.restore();
  }

  renderSkyConstellation(ctx, constellation, canvasW, canvasH, isUnlocked, isSelected) {
    const cx = constellation.skyX * canvasW;
    const cy = constellation.skyY * canvasH;
    const scale = constellation.skyScale * Math.min(canvasW, canvasH);

    const toSkyCoord = (pt) => ({
      x: cx + (pt.x - 0.5) * scale,
      y: cy + (pt.y - 0.5) * scale
    });

    // If unlocked and selected, draw spotlight nebula halo
    if (isUnlocked && isSelected) {
      ctx.save();
      const spotGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, scale * 0.85);
      spotGrad.addColorStop(0, `${constellation.color}35`);
      spotGrad.addColorStop(0.5, `${constellation.glowColor}18`);
      spotGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing starlight ring
      const pulse = 1 + 0.06 * Math.sin(Date.now() * 0.004);
      ctx.strokeStyle = `${constellation.color}50`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, scale * 0.7 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Draw constellation lines
    ctx.save();
    if (isUnlocked) {
      ctx.lineWidth = isSelected ? 2.2 : 1.6;
      ctx.strokeStyle = isSelected ? constellation.color : `${constellation.color}aa`;
      ctx.shadowColor = constellation.color;
      ctx.shadowBlur = isSelected ? 12 : 6;
    } else {
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.shadowBlur = 0;
    }

    constellation.lines.forEach(([aIdx, bIdx]) => {
      const ptA = toSkyCoord(constellation.stars[aIdx]);
      const ptB = toSkyCoord(constellation.stars[bIdx]);
      ctx.beginPath();
      ctx.moveTo(ptA.x, ptA.y);
      ctx.lineTo(ptB.x, ptB.y);
      ctx.stroke();
    });
    ctx.restore();

    // Draw stars
    constellation.stars.forEach(star => {
      const { x, y } = toSkyCoord(star);
      const isPrimary = !!star.primary;
      const baseR = (isPrimary ? 4.8 : 3.2) * (star.mag || 1);

      ctx.save();
      if (isUnlocked) {
        // Glowing halo
        ctx.beginPath();
        ctx.arc(x, y, baseR * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color || constellation.color}40`;
        ctx.fill();

        // Star core
        ctx.beginPath();
        ctx.arc(x, y, baseR, 0, Math.PI * 2);
        ctx.fillStyle = star.color || '#ffffff';
        ctx.shadowColor = star.color || constellation.color;
        ctx.shadowBlur = isSelected ? 14 : 7;
        ctx.fill();

        if (isPrimary && isSelected) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x - baseR * 1.8, y);
          ctx.lineTo(x + baseR * 1.8, y);
          ctx.moveTo(x, y - baseR * 1.8);
          ctx.lineTo(x, y + baseR * 1.8);
          ctx.stroke();
        }
      } else {
        // Dim locked star whisper
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
      }
      ctx.restore();
    });

    // Constellation Title Badge in the Sky
    ctx.save();
    const labelY = cy + scale * 0.52 + 10;
    ctx.font = isSelected ? '700 13px system-ui, sans-serif' : '600 11px system-ui, sans-serif';
    ctx.textAlign = 'center';

    if (isUnlocked) {
      // Glow pill background for label
      const labelText = `${constellation.icon} ${constellation.name}`;
      const metrics = ctx.measureText(labelText);
      const pillW = metrics.width + 16;
      const pillH = 20;

      ctx.fillStyle = isSelected ? 'rgba(28, 10, 48, 0.85)' : 'rgba(12, 4, 25, 0.65)';
      ctx.strokeStyle = isSelected ? constellation.color : 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = isSelected ? 1.5 : 1;
      ctx.beginPath();
      ctx.roundRect(cx - pillW / 2, labelY - pillH / 2, pillW, pillH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
      ctx.shadowColor = constellation.color;
      ctx.shadowBlur = isSelected ? 8 : 0;
      ctx.fillText(labelText, cx, labelY + 4);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillText(`🔒 ${constellation.name}`, cx, labelY + 4);
    }
    ctx.restore();
  }

  // =========================================================================
  // Hit Detection for Interactive Sky Clicking & Tapping
  // =========================================================================

  hitTest(screenX, screenY, canvasW, canvasH) {
    // Inverse transform
    const ox = screenX - this.panX;
    const oy = screenY - this.panY;
    const midX = canvasW * 0.5;
    const midY = canvasH * 0.5;
    const worldX = (ox - midX) / this.zoom + midX;
    const worldY = (oy - midY) / this.zoom + midY;

    for (const constellation of this.catalog) {
      const cx = constellation.skyX * canvasW;
      const cy = constellation.skyY * canvasH;
      const radius = constellation.skyScale * Math.min(canvasW, canvasH) * 0.75;

      const dist = Math.hypot(worldX - cx, worldY - cy);
      if (dist <= radius) {
        return constellation;
      }
    }
    return null;
  }

  // Smoothly center on a specific constellation in the sky
  centerOnConstellation(constellationId, canvasW, canvasH) {
    const c = this.getConstellation(constellationId);
    if (!c) return;
    this.selectedId = c.id;
    const targetCenterX = c.skyX * canvasW;
    const targetCenterY = c.skyY * canvasH;

    // Pan so target is at the canvas center
    this.panX = (canvasW * 0.5 - targetCenterX) * this.zoom;
    this.panY = (canvasH * 0.5 - targetCenterY) * this.zoom;
  }

  resetSkyView() {
    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;
  }

  // =========================================================================
  // Save High-Resolution Personal Sky Snapshot
  // =========================================================================

  async saveSkySnapshot(playerName = 'Player') {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 1600;
    exportCanvas.height = 1000;
    const ctx = exportCanvas.getContext('2d');

    // Reset pan/zoom for clean export
    const prevPanX = this.panX;
    const prevPanY = this.panY;
    const prevZoom = this.zoom;

    this.panX = 0;
    this.panY = 0;
    this.zoom = 1.0;

    this.drawSkyGallery(exportCanvas);

    // Restore viewport state
    this.panX = prevPanX;
    this.panY = prevPanY;
    this.zoom = prevZoom;

    // Add decorative celestial border and title banner
    ctx.save();
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, 1568, 968);

    // Corner celestial stars
    const drawCornerStar = (x, y) => {
      ctx.fillStyle = '#ffd166';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCornerStar(24, 24);
    drawCornerStar(1576, 24);
    drawCornerStar(24, 976);
    drawCornerStar(1576, 976);

    // Title banner
    ctx.fillStyle = 'rgba(15, 6, 32, 0.85)';
    ctx.fillRect(40, 36, 520, 70);
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 36, 520, 70);

    ctx.font = '700 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffd166';
    ctx.fillText(`🌌 ${playerName}'s Celestial Sky`, 58, 72);

    ctx.font = '600 14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText(`${this.unlockedIds.length} of ${this.catalog.length} Constellations Shining ✨`, 58, 94);

    ctx.restore();

    // Export image blob
    return new Promise(resolve => {
      exportCanvas.toBlob(blob => {
        if (!blob) return resolve(false);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = (playerName || 'Player').toLowerCase().replace(/[^a-z0-9]/g, '-');
        a.download = `${cleanName}-night-sky-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 3000);
        resolve(true);
      }, 'image/png');
    });
  }
}

// Global instance
window.constellationManager = new ConstellationManager();
