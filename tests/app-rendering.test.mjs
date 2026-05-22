import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

test("film cards render original-title-first public metadata", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");

  assert.match(source, /film\.displayTitle\.primary/);
  assert.match(source, /film\.displayTitle\.secondary/);
  assert.match(source, /film\.publicTags\s*\|\|/);
  assert.match(source, /\.slice\(0,\s*3\)/);
  assert.match(source, /class="film-card film-tile"/);
  assert.match(source, /class="film-tile-button"/);
  assert.match(source, /class="tile-caption"/);
  assert.match(source, /class="tile-detail-cue"/);
  assert.doesNotMatch(source, /class="grade-badge"/);
  assert.doesNotMatch(source, /film\.grade_code\s*\|\|/);
});

test("film detail dialog is a simplified public dossier", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");

  assert.match(source, /class="dialog-layout dialog-dossier dialog-exhibit"/);
  assert.match(source, /class="[^"]*dialog-hero-panel/);
  assert.match(source, /class="[^"]*dialog-story-panel/);
  assert.match(source, /class="dialog-signal-bar"/);
  assert.match(source, /class="dialog-head"/);
  assert.match(source, /class="dialog-facts"/);
  assert.match(source, /class="dialog-info-grid"/);
  assert.match(source, /class="dialog-lede"/);
  assert.match(source, /class="source-list compact"/);
  assert.match(source, /t\("dialog\.summaryTitle"\)/);
  assert.match(source, /t\("dialog\.watchTitle"\)/);
  assert.match(source, /t\("dialog\.sourceTitle"\)/);
  assert.match(source, /t\("dialog\.noWatch"\)/);
  assert.doesNotMatch(source, /核心论点|策展定位|观看说明|备注/);
  assert.doesNotMatch(source, /channel\.note/);
});

test("visual theme moves from paper archive to light electronic lab", async () => {
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.doesNotMatch(styles, /--paper:\s*#f5f0e6/);
  assert.doesNotMatch(styles, /--paper-deep:\s*#ebe1d0/);
  assert.doesNotMatch(styles, /--card:\s*#fffaf0/);
  assert.match(styles, /--lab-glow/);
  assert.match(styles, /--grid-line/);
  assert.match(styles, /\.dialog-exhibit/);
  assert.match(styles, /linear-gradient\(90deg,\s*var\(--signal\)/);
});

test("major page panels use solid color-block treatment instead of glass", async () => {
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.match(styles, /--panel-surface/);
  assert.match(styles, /--panel-block/);
  assert.match(styles, /--panel-accent/);
  assert.match(styles, /--lab-border/);
  assert.match(styles, /\.hero-panel,[\s\S]*\.filters,[\s\S]*\.route-gallery,[\s\S]*\.library-curation-panel,[\s\S]*\.supplement-section,[\s\S]*\.method-grid/);
  assert.match(styles, /background:\s*var\(--panel-surface\)/);
  assert.match(styles, /border-color:\s*var\(--lab-border\)/);
  assert.match(styles, /\.hero-panel::after,[\s\S]*background:\s*var\(--panel-accent\)/);
  assert.doesNotMatch(styles, /--panel-glass/);
  assert.doesNotMatch(styles, /--scanline/);
  assert.doesNotMatch(styles, /backdrop-filter:\s*blur\(12px\)/);
  assert.doesNotMatch(styles, /linear-gradient\(90deg,\s*var\(--grid-line\)/);
  assert.doesNotMatch(styles, /background-size:\s*34px 34px/);
});

test("watch channels expose display label, source kind, and subtitle fields", async () => {
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");

  assert.match(source, /class="watch-card"/);
  assert.match(source, /channel\.display_label/);
  assert.match(source, /channel\.source_kind/);
  assert.match(source, /channel\.subtitle/);
  assert.match(source, /watchChannelLabel\(channel\)/);
  assert.match(source, /watchChannelMeta\(channel\)/);
  assert.match(source, /shouldShowSubtitle = !channel\.source_kind/);
  assert.match(source, /t\(`sourceType\.\$\{type\}`/);
  assert.match(source, /sourceTypeLabel\(source\.type\)/);
});

test("library renders as a contact-sheet explorer rather than dense database cards", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.match(html, /library-explorer/);
  assert.match(html, /library-curation-panel/);
  assert.match(html, /film-contact-sheet/);
  assert.match(source, /class="film-card film-tile"/);
  assert.match(source, /class="film-tile-button"/);
  assert.match(source, /data-density/);
  assert.match(styles, /\.library-explorer\s*{[^}]*grid-template-columns:\s*minmax\(220px,\s*0\.24fr\) minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.film-contact-sheet\s*{[^}]*grid-template-columns:\s*repeat\(6,\s*minmax\(0,\s*1fr\)\)/s);
  assert.match(styles, /\.film-tile-button/);
  assert.match(styles, /\.tile-detail-cue/);
});

test("reader-facing page copy stays concise and public-oriented", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");

  assert.match(html, /电子音乐纪录片地图/);
  assert.match(html, /按线索观看/);
  assert.match(html, /@电子音乐考古小分队/);
  assert.doesNotMatch(html, /像进入展厅一样|片单标准|拖动封面墙|继续向下进入|重要电子音乐/);
  assert.doesNotMatch(source, /Route signal/);
});

test("site supports Chinese default with an English language toggle", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");
  const source = await readFile(resolve(projectRoot, "assets", "app.js"), "utf8");
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /class="language-switch"/);
  assert.match(html, /data-locale="zh"[^>]*aria-pressed="true"[^>]*>中文/);
  assert.match(html, /data-locale="en"[^>]*>EN/);
  assert.match(html, /data-i18n="hero\.title"/);
  assert.match(html, /data-i18n-placeholder="library\.searchPlaceholder"/);
  assert.match(source, /const DEFAULT_LOCALE = "zh"/);
  assert.match(source, /const UI_STRINGS =/);
  assert.match(source, /localStorage\.setItem\("emda-locale"/);
  assert.match(source, /function setLocale\(locale\)/);
  assert.match(styles, /\.language-switch/);
});

test("contact-sheet and dossier styles stay responsive", async () => {
  const styles = await readFile(resolve(projectRoot, "assets", "styles.css"), "utf8");

  assert.match(styles, /@media \(max-width:\s*1120px\)[\s\S]*\.film-contact-sheet\s*{[\s\S]*repeat\(5,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /@media \(max-width:\s*760px\)[\s\S]*\.library-explorer\s*{[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(styles, /@media \(max-width:\s*760px\)[\s\S]*\.film-contact-sheet\s*{[\s\S]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(styles, /\.film-title\s*{[^}]*font-size:\s*clamp\(15px,\s*1\.35vw,\s*19px\)/s);
  assert.match(styles, /\.dialog-dossier\s*{[^}]*grid-template-columns:\s*minmax\(260px,\s*0\.38fr\) minmax\(0,\s*1fr\)/s);
  assert.match(styles, /\.dialog-hero-panel/);
  assert.match(styles, /\.dialog-story-panel/);
  assert.match(styles, /\.dialog-head\s*{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) minmax\(260px,\s*0\.58fr\)/s);
  assert.match(styles, /\.dialog-facts/);
  assert.match(styles, /\.dialog-info-grid/);
  assert.match(styles, /\.watch-card/);
  assert.match(styles, /\.watch-link-button/);
  assert.match(styles, /\.source-list\.compact/);
  assert.match(styles, /@media \(max-width:\s*760px\)[\s\S]*\.dialog-dossier\s*{[\s\S]*grid-template-columns:\s*1fr/);
});

test("unverified supplement shelves stay hidden from the public page", async () => {
  const html = await readFile(resolve(projectRoot, "index.html"), "utf8");

  assert.doesNotMatch(html, /extended-film-grid/);
  assert.doesNotMatch(html, /related-film-grid/);
  assert.doesNotMatch(html, /延伸片目|相关议题/);
});
