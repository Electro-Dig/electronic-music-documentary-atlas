import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const modulePath = resolve(projectRoot, "assets", "presentation-data.js");
const dataPath = resolve(projectRoot, "data", "documentaries.json");

async function loadPresentationData() {
  return import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
}

async function loadDocumentaries() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}

test("public grade labels hide internal S/A/B codes", async () => {
  const { getPublicGradeLabel } = await loadPresentationData();

  assert.equal(getPublicGradeLabel("S"), "核心影片");
  assert.equal(getPublicGradeLabel("A"), "重要影片");
  assert.equal(getPublicGradeLabel("B"), "延伸片目");
});

test("display titles prefer original title and only expose mature Chinese titles", async () => {
  const { getDisplayTitle } = await loadPresentationData();
  const documentaries = await loadDocumentaries();
  const sisters = documentaries.find((film) => film.id === "sisters-with-transistors-2020");
  const germany = documentaries.find((film) => film.id === "if-i-think-of-germany-at-night-2017");

  assert.deepEqual(getDisplayTitle(sisters), {
    primary: "Sisters with Transistors",
    secondary: "晶体管姐妹",
  });
  assert.deepEqual(getDisplayTitle(germany), {
    primary: "If I Think of Germany at Night / Denk ich an Deutschland in der Nacht",
    secondary: "",
  });
});

test("main collection excludes only explicitly related media-industry films", async () => {
  const { getCollectionVisibility, prepareFilm } = await loadPresentationData();
  const documentaries = await loadDocumentaries();
  const howMusicGotFree = documentaries.find((film) => film.id === "how-music-got-free-2024");
  const modulations = documentaries.find((film) => film.id === "modulations-cinema-for-the-ear-1998");
  const riseOfSynths = documentaries.find((film) => film.id === "the-rise-of-the-synths-2019");
  const untoldDisco = documentaries.find((film) => film.id === "the-untold-history-of-disco-2022");

  assert.equal(getCollectionVisibility(howMusicGotFree), "related");
  assert.equal(prepareFilm(howMusicGotFree).collectionVisibility, "related");
  assert.equal(getCollectionVisibility(modulations), "main");
  assert.equal(getCollectionVisibility(riseOfSynths), "main");
  assert.equal(getCollectionVisibility(untoldDisco), "main");
});

test("public tags are curated and capped at four", async () => {
  const { getPublicTags } = await loadPresentationData();
  const documentaries = await loadDocumentaries();
  const modulations = documentaries.find((film) => film.id === "modulations-cinema-for-the-ear-1998");
  const tags = getPublicTags(modulations);

  assert.ok(tags.includes("入门路径"));
  assert.equal(tags.includes("舞池与城市"), false);
  assert.ok(tags.length <= 4);
  assert.equal(tags.some((tag) => ["S", "A", "B", "美国"].includes(tag)), false);
});

test("manual route memberships allow at most one main and one auxiliary route per film", async () => {
  const { ROUTES, getFilmRoutes } = await loadPresentationData();
  const documentaries = await loadDocumentaries();
  const modulations = documentaries.find((film) => film.id === "modulations-cinema-for-the-ear-1998");
  const breakTheWall = documentaries.find((film) => film.id === "break-the-wall-2019");
  const riseOfSynths = documentaries.find((film) => film.id === "the-rise-of-the-synths-2019");
  const sisters = documentaries.find((film) => film.id === "sisters-with-transistors-2020");

  assert.ok(ROUTES.length >= 5);

  for (const film of documentaries) {
    const routes = getFilmRoutes(film);
    assert.ok(routes.main.length <= 1, `${film.id} has too many main routes`);
    assert.ok(routes.auxiliary.length <= 1, `${film.id} has too many auxiliary routes`);
  }

  assert.deepEqual(getFilmRoutes(modulations), {
    main: ["entry-path"],
    auxiliary: [],
  });
  assert.deepEqual(getFilmRoutes(breakTheWall), {
    main: ["dancefloor-city"],
    auxiliary: [],
  });
  assert.deepEqual(getFilmRoutes(riseOfSynths), {
    main: ["machine-studio"],
    auxiliary: [],
  });
  assert.deepEqual(getFilmRoutes(sisters), {
    main: ["women-pioneers"],
    auxiliary: ["entry-path"],
  });
});

test("routes carry exhibition chapter copy and representative films", async () => {
  const { ROUTES } = await loadPresentationData();

  for (const route of ROUTES) {
    const availableIds = new Set([...(route.main || []), ...(route.auxiliary || [])]);

    assert.match(route.scene || "", /\S/, `${route.id} needs an exhibition scene label`);
    assert.match(route.curatorialNote || "", /\S/, `${route.id} needs a curatorial note`);
    assert.ok(Array.isArray(route.featured), `${route.id} needs featured film ids`);
    assert.ok(route.featured.length >= 3, `${route.id} should show at least three representative films`);
    assert.ok(route.featured.length <= 6, `${route.id} should keep the chapter focused`);

    for (const filmId of route.featured) {
      assert.ok(availableIds.has(filmId), `${route.id} featured film ${filmId} is not in the route`);
    }
  }
});
