import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const modulePath = resolve(projectRoot, "assets", "graph-data.js");
const dataPath = resolve(projectRoot, "data", "documentaries.json");

async function loadGraphData() {
  const loaded = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`);
  return loaded.default ?? loaded;
}

async function loadDocumentaries() {
  return JSON.parse(await readFile(dataPath, "utf8"));
}

test("buildGraphModel creates bounded curated path subgraphs", async () => {
  const { buildGraphModel } = await loadGraphData();
  const documentaries = await loadDocumentaries();
  const model = buildGraphModel(documentaries);

  assert.ok(model.paths.length >= 5);
  assert.ok(model.byPath["dancefloor-formation"]);
  assert.ok(model.byPath["machine-voices"]);

  for (const path of model.paths) {
    const graph = model.byPath[path.id];
    assert.ok(graph.nodes.length <= 40, `${path.id} should stay readable`);
    assert.ok(graph.edges.length <= 90, `${path.id} should stay bounded`);
    assert.equal(graph.nodes.some((node) => node.type === "platform"), false);
  }
});

test("dancefloor path links films to cities, genres, and repeated people", async () => {
  const { buildGraphModel } = await loadGraphData();
  const documentaries = await loadDocumentaries();
  const graph = buildGraphModel(documentaries).byPath["dancefloor-formation"];
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));

  assert.ok(nodes.has("film-pump-up-the-volume-a-history-of-house-music-2001"));
  assert.ok(nodes.has("city-detroit"));
  assert.ok(nodes.has("city-chicago"));
  assert.ok(nodes.has("genre-house"));
  assert.ok(nodes.has("genre-techno"));

  const connected = graph.edges.some(
    (edge) => edge.source === "film-high-tech-soul-the-creation-of-techno-music-2006" && edge.target === "city-detroit",
  );
  assert.equal(connected, true);
});

test("film nodes carry local poster paths for cover-card rendering", async () => {
  const { buildGraphModel } = await loadGraphData();
  const documentaries = await loadDocumentaries();
  const graph = buildGraphModel(documentaries).byPath["dancefloor-formation"];
  const film = graph.nodes.find((node) => node.id === "film-pump-up-the-volume-a-history-of-house-music-2001");

  assert.equal(film?.type, "film");
  assert.match(film.posterPath, /^assets\/covers\//);
  assert.ok(film.posterAlt);
});

test("graph edges connect existing nodes and carry evidence basis", async () => {
  const { buildGraphModel } = await loadGraphData();
  const documentaries = await loadDocumentaries();
  const model = buildGraphModel(documentaries);

  Object.values(model.byPath).forEach((graph) => {
    const ids = new Set(graph.nodes.map((node) => node.id));
    graph.edges.forEach((edge) => {
      assert.ok(ids.has(edge.source), `missing source ${edge.source}`);
      assert.ok(ids.has(edge.target), `missing target ${edge.target}`);
      assert.ok(edge.type);
      assert.ok(edge.basis);
    });
  });
});
