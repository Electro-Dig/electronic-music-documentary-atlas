import { getCollectionVisibility, getDisplayTitle, getPublicGradeLabel, getPublicTags } from "./presentation-data.js";

export const WALL_FILTERS = [
  {
    id: "all",
    label: "全部重要",
    kicker: "ALL",
    terms: [],
  },
  {
    id: "instruments",
    label: "机器发声",
    kicker: "OSC",
    terms: ["theremin", "Moog", "synthesizer", "合成器", "鼓机", "808", "乐器"],
  },
  {
    id: "studio",
    label: "录音室实验",
    kicker: "LAB",
    terms: ["BBC Radiophonic Workshop", "声音实验", "磁带", "tape", "radiophonic", "Delia Derbyshire"],
  },
  {
    id: "dancefloor",
    label: "舞池与城市",
    kicker: "CLUB",
    terms: ["disco", "house", "techno", "rave", "Detroit", "Chicago", "New York", "俱乐部", "舞曲"],
  },
  {
    id: "germany",
    label: "德国线索",
    kicker: "DE",
    terms: ["Germany", "德国", "Berlin", "Düsseldorf", "Krautrock", "Synth-pop", "Germany Techno"],
  },
  {
    id: "women-pioneers",
    label: "女性先锋",
    kicker: "WOMEN",
    terms: ["女性先驱", "女性先锋", "Delia Derbyshire", "Daphne Oram", "Suzanne Ciani", "Bebe Barron"],
  },
  {
    id: "media-industry",
    label: "媒介产业",
    kicker: "MEDIA",
    terms: ["MP3", "sampling", "采样", "版权", "file sharing", "数字发行", "音乐产业"],
  },
];

export function buildFilmWallModel(documentaries, activeFilter = "all") {
  const coreFilms = (Array.isArray(documentaries) ? documentaries : [])
    .filter(isCoreFilm)
    .map(normalizeFilm)
    .sort(compareFilms);
  const active = WALL_FILTERS.some((filter) => filter.id === activeFilter) ? activeFilter : "all";
  const filters = WALL_FILTERS.map((filter) => ({
    ...filter,
    count: coreFilms.filter((film) => matchesFilter(film, filter)).length,
  }));
  const films = coreFilms.filter((film) => matchesFilter(film, WALL_FILTERS.find((filter) => filter.id === active))).map(withWallPosition);

  return {
    activeFilter: active,
    filters,
    films,
  };
}

function isCoreFilm(film) {
  return getCollectionVisibility(film) === "main" && Boolean(film.poster?.path);
}

function normalizeFilm(film) {
  const channels = Array.isArray(film.watch_channels) ? film.watch_channels : [];
  const displayTitle = getDisplayTitle(film);
  return {
    id: film.id,
    title: displayTitle.primary,
    secondaryTitle: displayTitle.secondary,
    originalTitle: film.original_title || "",
    year: film.year || "",
    sortYear: Number(film.sort_year || film.year) || 9999,
    gradeCode: film.grade_code || "",
    publicGradeLabel: getPublicGradeLabel(film.grade_code),
    collectionVisibility: getCollectionVisibility(film),
    publicTags: getPublicTags(film),
    section: film.section || "",
    directors: values(film.directors),
    directorLine: values(film.directors).join(" / "),
    themes: values(film.themes),
    genres: values(film.genres),
    regions: values(film.regions),
    cities: values(film.cities),
    people: values(film.people),
    technologies: values(film.technologies),
    summary: film.summary || film.core_argument || "",
    posterPath: `assets/${film.poster.path}`,
    posterAlt: film.poster.alt || film.title || film.original_title || "Documentary poster",
    watch: watchStatus(channels),
    sourceCount: values(film.sources).length,
  };
}

function withWallPosition(film, index, films) {
  const columns = Math.max(4, Math.min(7, Math.ceil(Math.sqrt(films.length * 1.28))));
  const rows = Math.ceil(films.length / columns);
  const col = index % columns;
  const row = Math.floor(index / columns);
  const rowOffset = row % 2 === 0 ? 0 : 0.46;
  const centerX = (columns - 1) / 2;
  const centerY = (rows - 1) / 2;

  return {
    ...film,
    wall: {
      x: (col - centerX + rowOffset) * 3.35,
      y: (centerY - row) * 4.85,
      z: Math.sin(index * 1.41) * 0.55 + Math.cos(row * 0.83) * 0.24,
      tilt: Math.sin(index * 0.91) * 0.075,
      scale: film.gradeCode === "S" ? 1 : 0.92,
      order: index,
    },
  };
}

function matchesFilter(film, filter) {
  if (!filter || filter.id === "all") return true;
  const haystack = searchableText(film);
  return filter.terms.some((term) => haystack.includes(String(term).toLowerCase()));
}

function searchableText(film) {
  return [
    film.title,
    film.originalTitle,
    film.section,
    film.summary,
    film.directorLine,
    ...film.themes,
    ...film.genres,
    ...film.regions,
    ...film.cities,
    ...film.people,
    ...film.technologies,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function compareFilms(a, b) {
  const grade = (b.gradeCode === "S") - (a.gradeCode === "S");
  if (grade !== 0) return grade;
  return a.sortYear - b.sortYear || a.title.localeCompare(b.title);
}

function watchStatus(channels) {
  if (channels.some((channel) => channel.access_type === "free")) return { type: "free", label: "免费" };
  if (channels.some((channel) => channel.access_type === "library")) return { type: "library", label: "馆藏" };
  if (channels.some((channel) => ["subscription", "rental", "purchase"].includes(channel.access_type))) {
    return { type: "vod", label: "点播" };
  }
  if (channels.some((channel) => channel.access_type === "event_only")) return { type: "event", label: "授权" };
  return { type: "unknown", label: "待核" };
}

function values(input) {
  return Array.isArray(input) ? input.filter(Boolean) : [];
}

if (typeof globalThis !== "undefined") {
  globalThis.FilmWallData = { WALL_FILTERS, buildFilmWallModel };
}
