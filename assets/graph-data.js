const CORE_PERSON_MIN_COUNT = 2;
const MAX_NODES_PER_PATH = 40;
const MAX_EDGES_PER_PATH = 90;

export const CURATED_PATHS = [
  {
    id: "machine-voices",
    title: "机器如何发声",
    kicker: "Instrument / signal / body",
    description: "从 theremin、磁带、合成器、鼓机和采样器进入电子声音的物质史。",
    terms: ["theremin", "synthesizer", "Moog synthesizer", "Roland TR-808", "drum machine", "sampler", "tape", "乐器", "合成器", "鼓机"],
    entityTypes: ["technology", "person", "genre", "city"],
  },
  {
    id: "studio-lab",
    title: "录音室如何成为乐器",
    kicker: "Tape / broadcast / lab",
    description: "广播工作室、磁带、声音实验和早期电子音乐机构形成的实验线路。",
    terms: ["BBC Radiophonic Workshop", "Delia Derbyshire", "Daphne Oram", "tape", "radiophonic", "声音实验", "声音实验室", "广播声音"],
    entityTypes: ["person", "technology", "genre", "city"],
  },
  {
    id: "dancefloor-formation",
    title: "舞池如何形成",
    kicker: "Club / city / body",
    description: "从纽约、芝加哥、底特律、disco、house 和 techno 进入俱乐部文化。",
    terms: ["New York", "Chicago", "Detroit", "disco", "house", "techno", "rave", "DJ", "俱乐部文化", "舞曲"],
    entityTypes: ["city", "genre", "technology", "person"],
  },
  {
    id: "germany-line",
    title: "德国线索",
    kicker: "Krautrock / synth-pop / Berlin",
    description: "Krautrock、合成器流行、柏林夜晚和欧洲电子身份。",
    terms: ["Germany", "德国", "Krautrock", "Synth-pop", "Berlin", "Düsseldorf", "Cologne", "德国 Techno", "战后德国"],
    entityTypes: ["city", "genre", "person", "technology"],
  },
  {
    id: "black-electronic-lineage",
    title: "黑人与酷儿舞曲谱系",
    kicker: "Dub / disco / house / techno",
    description: "Dub、声音系统、disco、house、Detroit techno 和采样文化的社会线路。",
    terms: ["Dub", "Kingston", "New York", "Chicago", "Detroit", "disco", "house", "techno", "hip-hop", "黑人电子音乐", "sound system", "采样版权"],
    entityTypes: ["city", "genre", "technology", "person"],
  },
  {
    id: "media-industry",
    title: "媒介与产业",
    kicker: "Sampling / MP3 / circulation",
    description: "采样、版权、MP3、文件分享和音乐产业结构变化。",
    terms: ["MP3", "sampling", "sampler", "file sharing", "internet distribution", "采样版权", "数字发行", "音乐产业"],
    entityTypes: ["technology", "genre", "person", "city"],
  },
];

export function buildGraphModel(documentaries) {
  const films = Array.isArray(documentaries) ? documentaries : [];
  const peopleCounts = countValues(films, "people");
  const byPath = {};

  CURATED_PATHS.forEach((path) => {
    byPath[path.id] = buildPathGraph(path, films, peopleCounts);
  });

  return {
    paths: CURATED_PATHS.map(({ id, title, kicker, description }) => ({ id, title, kicker, description })),
    byPath,
  };
}

function buildPathGraph(path, films, peopleCounts) {
  const nodes = new Map();
  const edges = new Map();
  const matchedFilms = films.filter((film) => filmMatchesPath(film, path)).slice(0, 16);

  matchedFilms.forEach((film) => {
    const filmNode = filmNodeFrom(film);
    nodes.set(filmNode.id, filmNode);

    path.entityTypes.forEach((type) => {
      const entities = entitiesForFilm(film, type, peopleCounts, path);
      entities.forEach((entity) => {
        if (nodes.size >= MAX_NODES_PER_PATH && !nodes.has(entity.id)) return;
        nodes.set(entity.id, entity);
        const edge = edgeFrom(filmNode.id, entity.id, type);
        edges.set(edge.id, edge);
      });
    });
  });

  const sortedNodes = [...nodes.values()].sort(compareNodes).slice(0, MAX_NODES_PER_PATH);
  const nodeIds = new Set(sortedNodes.map((node) => node.id));
  const sortedEdges = [...edges.values()]
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id))
    .slice(0, MAX_EDGES_PER_PATH);

  return {
    pathId: path.id,
    title: path.title,
    description: path.description,
    nodes: sortedNodes,
    edges: sortedEdges,
  };
}

function filmMatchesPath(film, path) {
  const haystack = searchableText(film).toLowerCase();
  return path.terms.some((term) => haystack.includes(String(term).toLowerCase()));
}

function filmNodeFrom(film) {
  const posterPath = film.poster?.path ? `assets/${film.poster.path}` : "";
  return {
    id: `film-${film.id}`,
    type: "film",
    label: film.title || film.original_title || "Untitled",
    subtitle: [film.year, film.grade_code, film.section].filter(Boolean).join(" / "),
    filmId: film.id,
    year: Number(film.sort_year || film.year) || null,
    gradeCode: film.grade_code || "",
    posterPath,
    posterAlt: film.poster?.alt || film.title || film.original_title || "Documentary poster",
    weight: film.grade_code === "S" ? 6 : 4,
  };
}

function entitiesForFilm(film, type, peopleCounts, path) {
  if (type === "city") return values(film.cities).map((value) => entityFrom("city", value, path));
  if (type === "genre") return values(film.genres).map((value) => entityFrom("genre", value, path));
  if (type === "technology") return values(film.technologies).map((value) => entityFrom("technology", value, path));
  if (type === "person") {
    return values(film.people)
      .filter((value) => peopleCounts.get(value) >= CORE_PERSON_MIN_COUNT || path.terms.includes(value))
      .slice(0, 8)
      .map((value) => entityFrom("person", value, path));
  }
  return [];
}

function entityFrom(type, value, path) {
  const seedBoost = path.terms.some((term) => String(term).toLowerCase() === String(value).toLowerCase()) ? 5 : 0;
  return {
    id: `${type}-${slug(value)}`,
    type,
    label: value,
    weight: (type === "city" ? 5 : type === "technology" ? 4 : 3) + seedBoost,
  };
}

function edgeFrom(source, target, entityType) {
  const typeByEntity = {
    city: "documents_city",
    genre: "belongs_to_genre",
    technology: "discusses_technology",
    person: "features_person",
  };
  return {
    id: `${source}__${target}`,
    source,
    target,
    type: typeByEntity[entityType] || "related_to",
    basis: "metadata",
    weight: entityType === "city" ? 5 : entityType === "person" ? 4 : 3,
  };
}

function compareNodes(a, b) {
  const typeOrder = { film: 0, city: 1, technology: 2, genre: 3, person: 4 };
  const weightDiff = b.weight - a.weight;
  if (weightDiff !== 0) return weightDiff;
  const typeDiff = (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
  if (typeDiff !== 0) return typeDiff;
  return a.label.localeCompare(b.label);
}

function searchableText(film) {
  return [
    film.title,
    film.original_title,
    film.section,
    film.summary,
    film.core_argument,
    ...values(film.people),
    ...values(film.themes),
    ...values(film.genres),
    ...values(film.regions),
    ...values(film.cities),
    ...values(film.technologies),
  ]
    .filter(Boolean)
    .join(" ");
}

function countValues(films, field) {
  const counts = new Map();
  films.forEach((film) => values(film[field]).forEach((value) => counts.set(value, (counts.get(value) || 0) + 1)));
  return counts;
}

function values(input) {
  return Array.isArray(input) ? input.filter(Boolean) : [];
}

function slug(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-|-$/g, "");
}

if (typeof globalThis !== "undefined") {
  globalThis.GraphData = { CURATED_PATHS, buildGraphModel };
}
