import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const scriptPath = resolve(projectRoot, "assets", "patch-cable-lab.js");

test("lab scene wires direct spatial controls", async () => {
  const source = await readFile(scriptPath, "utf8");

  assert.match(source, /pointerdown/);
  assert.match(source, /wheel/);
  assert.match(source, /dragState/);
});

test("selected film information is rendered as a stage overlay", async () => {
  const source = await readFile(scriptPath, "utf8");

  assert.match(source, /SceneFloatingDetail/);
  assert.match(source, /scene-detail/);
  assert.doesNotMatch(source, /h\(NodeDetail/);
});
