import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const modulePath = resolve(projectRoot, "assets", "timeline-data.js");
const dataPath = resolve(projectRoot, "data", "documentaries.json");

async function loadTimelineData() {
  assert.equal(
    existsSync(modulePath),
    true,
    "assets/timeline-data.js should provide timeline data helpers",
  );

  const loaded = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
  return loaded.default ?? loaded;
}

async function loadDocumentaries() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}

test("inferTimelineLanes returns stable lanes from section, themes, genres, and technologies", async () => {
  const { inferTimelineLanes } = await loadTimelineData();

  assert.deepEqual(
    inferTimelineLanes({
      section: "Detroit Techno",
      themes: ["黑人电子音乐", "城市工业史"],
      genres: ["techno", "electro"],
      technologies: ["synthesizer", "drum machine"],
    }),
    ["machines", "dancefloor", "black-electronic"],
  );

  assert.deepEqual(
    inferTimelineLanes({
      section: "MP3/产业",
      themes: ["数字发行", "音乐产业"],
      genres: ["music industry"],
      technologies: ["MP3", "file sharing"],
    }),
    ["media-industry"],
  );

  assert.deepEqual(
    inferTimelineLanes({
      section: "Krautrock",
      themes: ["Krautrock", "战后德国"],
      genres: ["krautrock"],
      regions: ["德国"],
      technologies: ["synthesizer"],
    }),
    ["machines", "germany"],
  );

  assert.deepEqual(
    inferTimelineLanes({
      section: "女性先驱/短片",
      themes: ["女性先锋", "BBC Radiophonic Workshop", "声音实验"],
      genres: ["experimental", "radiophonic"],
      technologies: ["tape", "oscillator"],
    }),
    ["machines", "sound-lab", "women-pioneers"],
  );
});

test("buildTimelineItems maps documentaries into release-year records without inferred coverage spans", async () => {
  const { buildTimelineItems } = await loadTimelineData();
  const documentaries = await loadDocumentaries();

  const items = buildTimelineItems(documentaries);
  const byId = new Map(items.map((item) => [item.id, item]));

  assert.equal(items.length, documentaries.length);
  assert.deepEqual(
    Object.keys(byId.get("theremin-electronic-odyssey-1993")).sort(),
    ["coverage", "gradeCode", "id", "laneIds", "original_title", "section", "title", "watchAccess", "year"].sort(),
  );

  assert.deepEqual(byId.get("theremin-electronic-odyssey-1993"), {
    id: "theremin-electronic-odyssey-1993",
    title: "特雷门：电子奥德赛",
    original_title: "Theremin: An Electronic Odyssey",
    year: "1993",
    section: "起源/乐器",
    coverage: {
      start: 1993,
      end: 1993,
      periods: ["1920s-1940s", "1990s"],
      basis: "release_year",
    },
    laneIds: ["machines"],
    watchAccess: {
      primary: "free",
      types: ["free"],
      hasFree: true,
      channelCount: 1,
    },
    gradeCode: "S",
  });

  assert.deepEqual(byId.get("high-tech-soul-the-creation-of-techno-music-2006").laneIds, [
    "machines",
    "dancefloor",
    "black-electronic",
  ]);
  assert.deepEqual(byId.get("modulations-cinema-for-the-ear-1998").coverage, {
    start: 1998,
    end: 1998,
    periods: ["1960s", "1970s", "1980s", "1990s"],
    basis: "release_year",
  });
  assert.deepEqual(byId.get("sisters-with-transistors-2020").coverage, {
    start: 2020,
    end: 2020,
    periods: ["1950s-1960s", "1970s", "2020s"],
    basis: "release_year",
  });
  assert.ok(byId.get("krautrock-the-rebirth-of-germany-2009").laneIds.includes("germany"));
  assert.deepEqual(byId.get("pump-up-the-volume-a-history-of-house-music-2001").watchAccess, {
    primary: "free",
    types: ["free"],
    hasFree: true,
    channelCount: 1,
  });
});
