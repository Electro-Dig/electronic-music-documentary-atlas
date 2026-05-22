(function (root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.TimelineData = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : undefined, function () {
  const UNKNOWN_LANE_ID = "context";

  const TIMELINE_LANES = [
    {
      id: "machines",
      label: "Machines and Instruments",
      match: (film) =>
        textHas(film.section, ["起源/乐器", "乐器/人物", "合成器", "鼓机"]) ||
        hasAny(film.themes, ["乐器史", "合成器", "模块合成器", "鼓机", "技术想象", "技术与音乐想象"]) ||
        hasAny(film.technologies, [
          "theremin",
          "synthesizer",
          "Moog synthesizer",
          "drum machine",
          "Roland TR-808",
          "modular synthesizer",
          "Buchla synthesizer",
          "EMS Synthi",
          "VCS3",
          "oscillator",
          "arpeggiator",
        ]),
    },
    {
      id: "sound-lab",
      label: "Studios and Sound Labs",
      match: (film) =>
        textHas(film.section, ["声音实验室", "Minimalism"]) ||
        hasAny(film.themes, [
          "BBC Radiophonic Workshop",
          "声音实验室",
          "声音实验",
          "广播声音",
          "Minimalism",
          "当代作曲",
          "重复与电子音乐",
          "未来声音",
        ]) ||
        hasAny(film.genres, ["experimental", "radiophonic", "minimalism", "contemporary classical"]) ||
        hasAny(film.technologies, ["tape", "computer music", "radiophonic sound"]),
    },
    {
      id: "dancefloor",
      label: "Dancefloor Networks",
      match: (film) =>
        textHas(film.section, [
          "House",
          "Disco",
          "Techno",
          "Rave",
          "Dubstep",
          "Dance Music",
          "Belgian New Beat",
          "Germany Techno",
          "Detroit Techno",
        ]) ||
        hasAny(film.themes, [
          "俱乐部文化",
          "House 史",
          "House 起源",
          "Detroit Techno",
          "德国 Techno",
          "Rave",
          "舞曲传播",
          "舞曲总览",
          "欧洲舞曲",
          "低频文化",
          "英国地下音乐",
        ]) ||
        hasAny(film.genres, [
          "disco",
          "house",
          "techno",
          "rave",
          "acid house",
          "dance music",
          "garage",
          "dubstep",
          "bass music",
          "new beat",
          "electronic body music",
          "minimal techno",
        ]) ||
        hasAny(film.technologies, ["DJ", "sequencer", "sound system", "sub-bass"]),
    },
    {
      id: "black-electronic",
      label: "Black Electronic Lineages",
      match: (film) =>
        textHas(film.section, ["Detroit Techno", "Dub", "采样/版权"]) ||
        hasAny(film.themes, ["黑人电子音乐", "抵抗音乐", "采样版权", "Dub", "声音系统", "混音文化"]) ||
        hasAny(film.genres, ["dub", "reggae", "hip-hop", "sample-based music"]),
    },
    {
      id: "women-pioneers",
      label: "Women Pioneers",
      match: (film) => textHas(film.section, ["女性先驱"]) || hasAny(film.themes, ["女性先锋", "技术与性别"]),
    },
    {
      id: "germany",
      label: "Germany and Europe",
      match: (film) =>
        textHas(film.section, ["Germany Techno", "Krautrock", "Synth-pop", "Belgian New Beat"]) ||
        hasAny(film.regions, ["德国", "欧洲", "比利时"]) ||
        hasAny(film.themes, ["德国 Techno", "Krautrock", "Synth-pop", "Belgian New Beat", "战后德国", "欧洲舞曲"]) ||
        hasAny(film.genres, ["krautrock", "synth-pop", "new beat", "electronic body music"]),
    },
    {
      id: "media-industry",
      label: "Media and Industry",
      match: (film) =>
        textHas(film.section, ["MP3/产业", "采样/版权"]) ||
        hasAny(film.themes, ["音乐产业", "法律与技术", "数字发行", "MP3", "采样版权"]) ||
        hasAny(film.genres, ["music industry", "sample-based music"]) ||
        hasAny(film.technologies, ["MP3", "file sharing", "internet distribution", "sampling"]),
    },
    {
      id: UNKNOWN_LANE_ID,
      label: "Context",
      match: () => false,
    },
  ];

  const WATCH_ACCESS_ORDER = ["free", "subscription", "rental", "purchase", "event_only", "unknown"];

  function inferTimelineLanes(film) {
    const laneIds = TIMELINE_LANES.filter((lane) => lane.id !== UNKNOWN_LANE_ID && lane.match(film || {})).map(
      (lane) => lane.id,
    );

    return laneIds.length > 0 ? laneIds : [UNKNOWN_LANE_ID];
  }

  function buildTimelineItems(documentaries) {
    if (!Array.isArray(documentaries)) return [];

    return documentaries.map((film) => ({
      id: film.id,
      title: film.title || film.original_title || "",
      original_title: film.original_title || "",
      year: film.year || "",
      section: film.section || "",
      coverage: buildReleaseYearCoverage(film),
      laneIds: inferTimelineLanes(film),
      watchAccess: summarizeWatchAccess(film.watch_channels),
      gradeCode: film.grade_code || "",
    }));
  }

  function buildReleaseYearCoverage(film) {
    const sourcePeriods = Array.isArray(film?.periods)
      ? film.periods.filter((period) => typeof period === "string")
      : [];
    const releaseYear = parseYear(film?.sort_year ?? film?.year);
    return {
      start: releaseYear,
      end: releaseYear,
      periods: sourcePeriods,
      basis: "release_year",
    };
  }

  function summarizeWatchAccess(channels) {
    const safeChannels = Array.isArray(channels) ? channels : [];
    const types = unique(
      safeChannels.map((channel) => channel?.access_type || "unknown").map((type) => (type.trim ? type.trim() : type)),
    ).sort(compareWatchAccess);

    const normalizedTypes = types.length > 0 ? types : ["unknown"];

    return {
      primary: normalizedTypes[0],
      types: normalizedTypes,
      hasFree: normalizedTypes.includes("free"),
      channelCount: safeChannels.length,
    };
  }

  function hasAny(values, expectedValues) {
    if (!Array.isArray(values)) return false;
    const valueSet = new Set(values);
    return expectedValues.some((expected) => valueSet.has(expected));
  }

  function textHas(value, snippets) {
    if (typeof value !== "string") return false;
    return snippets.some((snippet) => value.includes(snippet));
  }

  function parseYear(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const match = value.match(/\d{4}/);
      return match ? Number(match[0]) : null;
    }
    return null;
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function compareWatchAccess(left, right) {
    const leftIndex = WATCH_ACCESS_ORDER.includes(left) ? WATCH_ACCESS_ORDER.indexOf(left) : WATCH_ACCESS_ORDER.length;
    const rightIndex = WATCH_ACCESS_ORDER.includes(right) ? WATCH_ACCESS_ORDER.indexOf(right) : WATCH_ACCESS_ORDER.length;

    if (leftIndex !== rightIndex) return leftIndex - rightIndex;
    return left.localeCompare(right);
  }

  return {
    TIMELINE_LANES,
    buildTimelineItems,
    inferTimelineLanes,
  };
});
