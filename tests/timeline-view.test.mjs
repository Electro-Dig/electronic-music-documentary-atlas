import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { renderSignalTimeline } from "../assets/timeline-view.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

function createRoot() {
  return {
    innerHTML: "",
    addEventListener() {},
    removeEventListener() {},
    contains() {
      return true;
    },
  };
}

test("release index renders each film once without lane rows", () => {
  const root = createRoot();
  const items = [
    { id: "a", title: "A", year: "1998", gradeCode: "S", watchAccess: { primary: "free" } },
    { id: "b", title: "B", year: "1998", gradeCode: "A", watchAccess: { primary: "unknown" } },
    { id: "c", title: "C", year: "2020", gradeCode: "S", watchAccess: { primary: "subscription" } },
  ];

  renderSignalTimeline(root, items, { title: "发行年份索引" });

  assert.equal((root.innerHTML.match(/data-st-id=/g) || []).length, items.length);
  assert.equal((root.innerHTML.match(/st-year-band/g) || []).length, 2);
  assert.equal(root.innerHTML.includes("st-year-stream"), true);
  assert.equal(root.innerHTML.includes("st-year-rail"), true);
  assert.equal(root.innerHTML.includes("st-lane"), false);
  assert.equal(root.innerHTML.includes("1998"), true);
  assert.equal(root.innerHTML.includes("2020"), true);
});

test("release index uses compact color-block stream without paper grid texture", async () => {
  const css = await readFile(resolve(projectRoot, "assets", "timeline-view.css"), "utf8");

  assert.match(css, /\.st-year-stream/);
  assert.match(css, /\.st-year-band/);
  assert.match(css, /\.st-year-rail/);
  assert.match(css, /\.st-event-card/);
  assert.doesNotMatch(css, /background-size:\s*18px 18px/);
  assert.doesNotMatch(css, /linear-gradient\(90deg,\s*rgba\(24,\s*23,\s*20,\s*0\.035\)\s*1px/);
});

test("release index is no longer a top-level navigation target", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");

  assert.equal(html.includes('href="#timeline"'), false);
  assert.equal(html.includes("年份索引</a>"), false);
});
