import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

test("app routes use manual presentation routes instead of keyword matching", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");

  assert.match(source, /import\s*{[\s\S]*ROUTES[\s\S]*}\s*from\s*"\.\/presentation-data\.js"/);
  assert.doesNotMatch(source, /const routes\s*=\s*\[/);
  assert.doesNotMatch(source, /match:\s*\(film\)/);
  assert.match(source, /routeFilmIds/);
});

test("route cards render as exhibition chapters with poster plates", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.match(source, /class="route-card route-chapter[^"]*"/);
  assert.match(source, /route-card-plate/);
  assert.match(source, /route-poster-stack/);
  assert.match(source, /routeText\(route,\s*"curatorialNote"\)/);
  assert.match(styles, /\.route-card\.route-chapter/);
  assert.match(styles, /\.route-poster-stack/);
});

test("route section becomes an interactive exhibition stage instead of a static card grid", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.match(source, /route-gallery/);
  assert.match(source, /route-selector-rail/);
  assert.match(source, /route-stage/);
  assert.match(source, /renderRouteStage/);
  assert.match(source, /setActiveRoutePreview/);
  assert.match(source, /route-entry-button/);
  assert.match(styles, /\.route-gallery/);
  assert.match(styles, /\.route-selector-rail/);
  assert.match(styles, /\.route-stage/);
  assert.match(styles, /\.route-entry-button/);
});
