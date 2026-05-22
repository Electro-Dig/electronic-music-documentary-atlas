import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

test("film wall page loads its prototype assets", async () => {
  const html = await readFile(resolve(projectRoot, "film-wall.html"), "utf8");

  assert.match(html, /film-wall-root/);
  assert.match(html, /assets\/film-wall\.css/);
  assert.match(html, /assets\/film-wall\.js/);
});

test("film wall script includes spatial browsing interactions", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "film-wall.js"), "utf8");

  assert.match(source, /pointerdown/);
  assert.match(source, /wheel/);
  assert.match(source, /hoveredId/);
  assert.match(source, /selectedFilm/);
  assert.match(source, /FilmArchiveCard/);
  assert.match(source, /open-film-detail/);
  assert.match(source, /查看详细档案|鏌ョ湅璇︾粏妗ｆ/);
});

test("homepage wall only captures wheel zoom when hovering a poster", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "film-wall.js"), "utf8");

  assert.match(source, /function onWheel\(event\)[\s\S]*updatePointer\(event\)/);
  assert.match(source, /function onWheel\(event\)[\s\S]*const hit = pickFilm\(\)/);
  assert.match(source, /function onWheel\(event\)[\s\S]*if \(!hit\) return/);
  assert.match(source, /if \(!hit\) return[\s\S]*event\.preventDefault\(\)/);
});

test("homepage wall keeps touch scrolling available on mobile", async () => {
  const css = await readFile(resolve(projectRoot, "assets", "film-wall.css"), "utf8");

  assert.match(css, /\.film-wall-app--home \.wall-canvas\s*{[\s\S]*touch-action:\s*pan-y/);
});

test("homepage mounts the spatial film wall as first-screen hero", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");

  assert.match(html, /home-film-wall-root/);
  assert.match(html, /assets\/film-wall\.css/);
  assert.match(html, /assets\/film-wall\.js/);
});

test("homepage film wall keeps posters primary with light atlas styling", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
  const css = await readFile(resolve(projectRoot, "assets", "film-wall.css"), "utf8");

  assert.doesNotMatch(html, /A 类|A-list archive|A 类片库/);
  assert.match(html, /电子音乐纪录片地图/);
  assert.doesNotMatch(html, /重要电子音乐纪录片封面墙|浏览重要片库|拖动封面墙|继续向下进入/);
  assert.match(css, /\.home-wall-hero\s*{[\s\S]*var\(--paper\)/);
  assert.match(css, /--wall-block/);
  assert.match(css, /--home-edge/);
  assert.match(css, /\.home-wall-hero \.hero-panel\s*{[\s\S]*display:\s*none/);
  assert.match(css, /\.home-wall-hero h1\s*{[\s\S]*font-size:\s*clamp\(26px/);
  assert.match(css, /@media \(max-width: 860px\)[\s\S]*\.film-wall-app--home \.wall-filter-dock\s*{[\s\S]*display:\s*none/);
  assert.doesNotMatch(css, /repeating-linear-gradient/);
  assert.doesNotMatch(css, /background-size:\s*34px 34px/);
  assert.doesNotMatch(css, /\.home-wall-hero\s*{[\s\S]*linear-gradient\(90deg,\s*rgba\(24,\s*23,\s*20,\s*0\.04\) 1px/);
});

test("film wall script centralizes motion tuning for smoother feedback", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "film-wall.js"), "utf8");

  assert.match(source, /const MOTION/);
  assert.match(source, /panDamping/);
  assert.match(source, /zoomDamping/);
  assert.match(source, /scale\.setScalar/);
});

test("homepage film wall uses a wider initial camera than the standalone wall", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "film-wall.js"), "utf8");

  assert.match(source, /const SCENE_VIEW/);
  assert.match(source, /home:\s*{[\s\S]*initialZ:\s*25\.6/);
  assert.match(source, /h\(FilmWallScene,[\s\S]*variant/);
});
