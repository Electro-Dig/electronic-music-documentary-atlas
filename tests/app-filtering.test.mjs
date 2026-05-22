import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

test("library filters use tag chips instead of database dropdowns", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");

  assert.match(html, /tag-chip-groups/);
  assert.match(html, /selected-tags/);
  assert.doesNotMatch(html, /id="grade-filter"|id="theme-filter"|id="region-filter"|id="watch-filter"/);
  assert.doesNotMatch(html, />等级<|>地区<|>观看状态</);
});

test("app filtering supports OR tag chips plus search", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");

  assert.match(source, /getFilterTags/);
  assert.match(source, /selectedTags:\s*new Set\(\)/);
  assert.match(source, /renderFilterTags/);
  assert.match(source, /tagsExpanded:\s*false/);
  assert.match(source, /hiddenTopicTags/);
  assert.match(source, /data-toggle-tags/);
  assert.match(source, /t\("filters\.expand",\s*{\s*count:\s*hiddenTopicTags\.length\s*}\)/);
  assert.match(source, /matchesSelectedTags/);
  assert.match(source, /selectedTags\.some/);
  assert.match(source, /searchableText\(film\)\.includes\(query\)/);
});
