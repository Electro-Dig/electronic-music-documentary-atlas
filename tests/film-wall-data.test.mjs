import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const modulePath = resolve(projectRoot, "assets", "film-wall-data.js");
const dataPath = resolve(projectRoot, "data", "documentaries.json");

async function loadWallData() {
  return import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
}

async function loadDocumentaries() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}

test("film wall model keeps main public documentaries with local posters", async () => {
  const { buildFilmWallModel } = await loadWallData();
  const documentaries = await loadDocumentaries();
  const model = buildFilmWallModel(documentaries, "all");

  assert.ok(model.films.length >= 20);
  assert.equal(model.films.every((film) => film.collectionVisibility === "main"), true);
  assert.equal(model.films.every((film) => film.posterPath.startsWith("assets/covers/")), true);
  assert.ok(model.films.some((film) => film.id === "sisters-with-transistors-2020"));
  assert.equal(model.films.some((film) => film.id === "how-music-got-free-2024"), false);
});

test("film wall filters return meaningful curated subsets", async () => {
  const { buildFilmWallModel } = await loadWallData();
  const documentaries = await loadDocumentaries();
  const women = buildFilmWallModel(documentaries, "women-pioneers");
  const dancefloor = buildFilmWallModel(documentaries, "dancefloor");

  assert.ok(women.films.some((film) => film.id === "sisters-with-transistors-2020"));
  assert.ok(women.films.some((film) => film.id === "a-life-in-waves-2017"));
  assert.ok(dancefloor.films.some((film) => film.id === "high-tech-soul-the-creation-of-techno-music-2006"));
  assert.ok(dancefloor.films.every((film) => film.wall.x !== undefined && film.wall.y !== undefined));
});

test("film wall filters expose counts for UI chips", async () => {
  const { buildFilmWallModel } = await loadWallData();
  const documentaries = await loadDocumentaries();
  const model = buildFilmWallModel(documentaries, "germany");
  const filter = model.filters.find((item) => item.id === "germany");

  assert.equal(model.activeFilter, "germany");
  assert.ok(filter.count >= model.films.length);
  assert.ok(model.filters.find((item) => item.id === "all").count >= 20);
});
