export const PUBLIC_GRADE_LABELS = {
  S: "核心影片",
  A: "重要影片",
  B: "延伸片目",
};

export const RELATED_FILM_IDS = new Set(["how-music-got-free-2024"]);

export const MATURE_CHINESE_TITLES = {
  "theremin-electronic-odyssey-1993": "特雷门：电子奥德赛",
  "sisters-with-transistors-2020": "晶体管姐妹",
  "the-sound-of-belgium-2012": "比利时之声",
};

export const ROUTES = [
  {
    id: "entry-path",
    label: "入门路径",
    kicker: "START",
    description: "从总览、乐器、声音实验、techno 和采样进入电子音乐纪录片。",
    scene: "Listening desk / 入门导览台",
    curatorialNote: "先建立电子音乐纪录片的基本坐标，再进入器物、舞池和人物线索。",
    featured: [
      "modulations-cinema-for-the-ear-1998",
      "theremin-electronic-odyssey-1993",
      "pump-up-the-volume-a-history-of-house-music-2001",
      "high-tech-soul-the-creation-of-techno-music-2006",
      "sisters-with-transistors-2020",
    ],
    main: ["modulations-cinema-for-the-ear-1998"],
    auxiliary: [
      "theremin-electronic-odyssey-1993",
      "pump-up-the-volume-a-history-of-house-music-2001",
      "high-tech-soul-the-creation-of-techno-music-2006",
      "sisters-with-transistors-2020",
    ],
  },
  {
    id: "machine-studio",
    label: "机器与录音室",
    kicker: "OSC",
    description: "电子乐器、合成器、磁带、声音实验室和工作室作为乐器的历史。",
    scene: "Patch bay / 机器与录音室",
    curatorialNote: "把乐器、磁带、广播工作室和模块合成器看作声音历史的生产现场。",
    featured: [
      "theremin-electronic-odyssey-1993",
      "the-alchemists-of-sound-2003",
      "moog-2004",
      "i-dream-of-wires-2014",
      "808-2015",
      "tones-drones-and-arpeggios-2018",
    ],
    main: [
      "theremin-electronic-odyssey-1993",
      "the-alchemists-of-sound-2003",
      "moog-2004",
      "what-the-future-sounded-like-2007",
      "i-dream-of-wires-2014",
      "808-2015",
      "tones-drones-and-arpeggios-2018",
      "the-rise-of-the-synths-2019",
    ],
    auxiliary: [],
  },
  {
    id: "dancefloor-city",
    label: "舞池与城市",
    kicker: "CLUB",
    description: "Disco、house、techno、rave、dub 和俱乐部社会史。",
    scene: "Night city circuit / 舞池与城市",
    curatorialNote: "从 disco、house、dub、rave 到中国场景，追踪舞池如何成为城市网络。",
    featured: [
      "pump-up-the-volume-a-history-of-house-music-2001",
      "maestro-2003",
      "dub-echoes-2008",
      "bassweight-a-dubstep-documentary-2010",
      "can-you-feel-it-how-dance-music-conquered-the-world-2018",
      "break-the-wall-2019",
    ],
    main: [
      "pump-up-the-volume-a-history-of-house-music-2001",
      "maestro-2003",
      "dub-echoes-2008",
      "bassweight-a-dubstep-documentary-2010",
      "never-stop-a-music-that-resists-2017",
      "can-you-feel-it-how-dance-music-conquered-the-world-2018",
      "everybody-in-the-place-2018",
      "break-the-wall-2019",
      "the-untold-history-of-disco-2022",
    ],
    auxiliary: [],
  },
  {
    id: "european-lines",
    label: "欧洲线索",
    kicker: "EU",
    description: "Krautrock、synth-pop、Belgian New Beat 和德国/欧洲电子身份。",
    scene: "Continental signal / 欧洲线索",
    curatorialNote: "把德国、英国、比利时和柏林的电子身份放在欧洲战后文化脉络中阅读。",
    featured: [
      "krautrock-the-rebirth-of-germany-2009",
      "synth-britannia-2009",
      "the-sound-of-belgium-2012",
      "if-i-think-of-germany-at-night-2017",
      "sound-of-berlin-2018",
    ],
    main: [
      "synth-britannia-2009",
      "krautrock-the-rebirth-of-germany-2009",
      "the-sound-of-belgium-2012",
      "if-i-think-of-germany-at-night-2017",
      "sound-of-berlin-2018",
    ],
    auxiliary: [],
  },
  {
    id: "women-pioneers",
    label: "女性先锋",
    kicker: "WOMEN",
    description: "女性电子音乐作者、声音实验和被遮蔽的技术谱系。",
    scene: "Recovered signals / 女性先锋",
    curatorialNote: "把被遮蔽的女性作曲家、工程师和声音实验者重新放回技术谱系。",
    featured: ["the-delian-mode-2009", "a-life-in-waves-2017", "sisters-with-transistors-2020"],
    main: ["the-delian-mode-2009", "a-life-in-waves-2017", "sisters-with-transistors-2020"],
    auxiliary: [],
  },
];

export const PUBLIC_TAGS_BY_FILM = {
  "theremin-electronic-odyssey-1993": ["Theremin", "电子乐器", "Robert Moog"],
  "modulations-cinema-for-the-ear-1998": ["电子音乐总览", "Rave"],
  "pump-up-the-volume-a-history-of-house-music-2001": ["House", "Chicago", "UK Rave"],
  "maestro-2003": ["Disco", "House", "NYC"],
  "the-alchemists-of-sound-2003": ["BBC Radiophonic Workshop", "磁带", "广播声音"],
  "moog-2004": ["Moog", "合成器", "Robert Moog"],
  "high-tech-soul-the-creation-of-techno-music-2006": ["Detroit", "Techno", "黑人电子音乐"],
  "what-the-future-sounded-like-2007": ["EMS", "VCS3", "声音实验"],
  "dub-echoes-2008": ["Dub", "Sound System", "Remix"],
  "synth-britannia-2009": ["Synth-pop", "Post-punk", "英国"],
  "the-delian-mode-2009": ["Delia Derbyshire", "BBC Radiophonic Workshop", "磁带"],
  "krautrock-the-rebirth-of-germany-2009": ["Krautrock", "Motorik", "德国"],
  "copyright-criminals-2009": ["采样", "版权", "Hip-hop"],
  "bassweight-a-dubstep-documentary-2010": ["Dubstep", "Bass", "Croydon"],
  "the-sound-of-belgium-2012": ["Belgian New Beat", "EBM", "俱乐部"],
  "i-dream-of-wires-2014": ["模块合成器", "Eurorack", "DIY"],
  "808-2015": ["鼓机", "Roland TR-808", "Electro"],
  "a-life-in-waves-2017": ["Suzanne Ciani", "Buchla", "声音设计"],
  "if-i-think-of-germany-at-night-2017": ["Berlin", "Techno", "德国"],
  "never-stop-a-music-that-resists-2017": ["Detroit", "Techno", "独立厂牌"],
  "can-you-feel-it-how-dance-music-conquered-the-world-2018": ["Dance Music", "Club", "EDM"],
  "everybody-in-the-place-2018": ["UK Rave", "Acid House", "社会史"],
  "tones-drones-and-arpeggios-2018": ["Minimalism", "Drone", "重复"],
  "sisters-with-transistors-2020": ["女性先锋", "合成器", "声音实验"],
  "the-rise-of-the-synths-2019": ["Synthwave", "复古未来主义", "John Carpenter"],
  "break-the-wall-2019": ["中国电子音乐", "场景史", "Club"],
  "sound-of-berlin-2018": ["Berlin", "Techno", "俱乐部"],
  "the-untold-history-of-disco-2022": ["Disco", "舞池文化", "酷儿文化"],
  "how-music-got-free-2024": ["媒介产业", "MP3", "版权"],
};

export const AVAILABILITY_TAGS = [
  { id: "has-watch", label: "有观看渠道" },
  { id: "free-watch", label: "免费可看" },
  { id: "bilibili-watch", label: "B站可看" },
  { id: "platform-library", label: "馆藏/平台" },
];

export function getPublicGradeLabel(gradeCode) {
  return PUBLIC_GRADE_LABELS[gradeCode] || "待归档";
}

export function getDisplayTitle(film) {
  return {
    primary: film?.original_title || film?.title || "Untitled",
    secondary: MATURE_CHINESE_TITLES[film?.id] || "",
  };
}

export function getCollectionVisibility(film) {
  if (!film?.id) return "hidden";
  if (RELATED_FILM_IDS.has(film.id)) return "related";
  if (film.grade_code === "B") return "extended";
  if (film.site_visibility === "core" && ["S", "A"].includes(film.grade_code) && film.poster?.path) return "main";
  return "hidden";
}

export function getFilmRoutes(filmOrId) {
  const id = typeof filmOrId === "string" ? filmOrId : filmOrId?.id;
  if (!id) return { main: [], auxiliary: [] };

  return {
    main: ROUTES.filter((route) => route.main.includes(id)).map((route) => route.id),
    auxiliary: ROUTES.filter((route) => route.auxiliary.includes(id)).map((route) => route.id),
  };
}

export function getPublicTags(film) {
  const routes = getFilmRoutes(film);
  const routeTags = routes.main
    .map((routeId) => ROUTES.find((route) => route.id === routeId)?.label)
    .filter(Boolean);
  const topicTags = PUBLIC_TAGS_BY_FILM[film?.id] || [];

  return unique([...routeTags, ...topicTags]).slice(0, 4);
}

export function getFilterTags() {
  const routeTags = ROUTES.map((route) => ({ id: route.id, label: route.label, group: "路线" }));
  const topicLabels = unique(Object.values(PUBLIC_TAGS_BY_FILM).flat()).sort((a, b) => a.localeCompare(b));
  const topicTags = topicLabels.map((label) => ({ id: `tag:${label}`, label, group: "主题" }));
  const availabilityTags = AVAILABILITY_TAGS.map((tag) => ({ ...tag, group: "观看" }));
  return [...routeTags, ...topicTags, ...availabilityTags];
}

export function prepareFilm(film) {
  const displayTitle = getDisplayTitle(film);
  const routes = getFilmRoutes(film);

  return {
    ...film,
    collectionVisibility: getCollectionVisibility(film),
    publicGradeLabel: getPublicGradeLabel(film?.grade_code),
    displayTitle,
    publicTags: getPublicTags(film),
    publicRoutes: routes,
  };
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

if (typeof globalThis !== "undefined") {
  globalThis.PresentationData = {
    PUBLIC_GRADE_LABELS,
    RELATED_FILM_IDS,
    MATURE_CHINESE_TITLES,
    ROUTES,
    PUBLIC_TAGS_BY_FILM,
    AVAILABILITY_TAGS,
    getPublicGradeLabel,
    getDisplayTitle,
    getCollectionVisibility,
    getFilmRoutes,
    getPublicTags,
    getFilterTags,
    prepareFilm,
  };
}
