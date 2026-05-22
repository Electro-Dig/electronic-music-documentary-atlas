# Content Display Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the prototype from an internal A/S database view into a public curated film archive with original-title-first cards, manual routes, tag browsing, simplified detail cards, and a larger home film wall.

**Architecture:** Add a small presentation layer over `data/documentaries.json` instead of rewriting the source data wholesale. `assets/app.js`, `assets/film-wall-data.js`, and route/tag helpers will consume the presentation layer so the public UI can hide internal grade codes, route membership can be manual, and filtering can use curated tags.

**Tech Stack:** Static HTML/CSS/JavaScript, native ES modules, Node test runner, React/Three.js only for the film wall.

---

### Task 1: Presentation Data Helpers

**Files:**
- Create: `assets/presentation-data.js`
- Test: `tests/presentation-data.test.mjs`

- [ ] Write failing tests for public grade labels, original-title-first display titles, main collection exclusion of `How Music Got Free`, maximum four public tags, and manual route membership limits.
- [ ] Implement `PUBLIC_GRADE_LABELS`, `RELATED_FILM_IDS`, `ROUTES`, `MATURE_CHINESE_TITLES`, `getPublicGradeLabel`, `getDisplayTitle`, `getCollectionVisibility`, `getPublicTags`, `getFilmRoutes`, and `prepareFilm`.
- [ ] Verify tests pass with `node --test tests/presentation-data.test.mjs`.

### Task 2: Home Wall Public Copy and 25 Percent Scale

**Files:**
- Modify: `index.html`
- Modify: `assets/film-wall-data.js`
- Modify: `assets/film-wall.js`
- Test: `tests/film-wall-page.test.mjs`
- Test: `tests/film-wall-data.test.mjs`

- [ ] Write failing tests that homepage text no longer uses `A 类`, the home wall uses important/core language, `How Music Got Free` is absent from the home wall, and PC home camera scale is about 25 percent larger than the current light-background view.
- [ ] Update homepage CTA and hero title to public language.
- [ ] Update film wall data filtering to use main collection visibility.
- [ ] Adjust home scene view from the current `initialZ: 32` to about `25.6`, with matching zoom bounds.
- [ ] Verify film wall and homepage tests pass.

### Task 3: Manual Curated Routes

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/presentation-data.js`
- Test: `tests/presentation-data.test.mjs`
- Test: `tests/app-routes.test.mjs`

- [ ] Write failing tests that route membership is manual, `Modulations: Cinema for the Ear` appears in the entry route and at most one auxiliary route, and no film has more than one main route plus one auxiliary route.
- [ ] Replace keyword route matching in `assets/app.js` with `ROUTES` from the presentation layer.
- [ ] Render route cards from manual route film lists.
- [ ] Verify route tests pass.

### Task 4: Tag Browser Library Filters

**Files:**
- Modify: `index.html`
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Test: `tests/app-filtering.test.mjs`

- [ ] Write failing tests for tag OR filtering, visible tag chips, absence of public `地区 / 状态 / 等级` dropdowns, and search plus tag combined behavior.
- [ ] Replace the dropdown form with a search input, selected-tag summary, tag chip rows, sort control, and reset button.
- [ ] Implement OR tag filtering using public tags.
- [ ] Style tag rows as compact film-library chips.
- [ ] Verify filtering tests pass.

### Task 5: Film Card and Detail Card Simplification

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Test: `tests/app-rendering.test.mjs`

- [ ] Write failing tests that film cards show original title first, optional mature Chinese title second, no public grade badge, and at most four tags.
- [ ] Write failing tests that detail cards include metadata, description, watch channels, and sources, while excluding `策展定位`, `观看说明`, and notes.
- [ ] Update card rendering and dialog rendering.
- [ ] Verify rendering tests pass.

### Task 6: Extended and Related Sections

**Files:**
- Modify: `index.html`
- Modify: `assets/app.js`
- Modify: `assets/styles.css`
- Test: `tests/app-rendering.test.mjs`

- [ ] Write failing tests that related media-industry films and B-class extension films are not in the main library but can render in separate extension sections.
- [ ] Add `延伸片目` and `相关议题` sections below the main library.
- [ ] Render `How Music Got Free` under related media industry.
- [ ] Verify rendering tests pass.

### Task 7: Full Verification

**Files:**
- Modify tests only if a previous task exposed an outdated assertion.

- [ ] Run all Node tests:

```powershell
node --test tests\timeline-data.test.mjs tests\timeline-view.test.mjs tests\graph-data.test.mjs tests\patch-cable-lab.test.mjs tests\film-wall-data.test.mjs tests\film-wall-page.test.mjs tests\presentation-data.test.mjs tests\app-routes.test.mjs tests\app-filtering.test.mjs tests\app-rendering.test.mjs
```

- [ ] Run JavaScript syntax checks:

```powershell
node --check assets\app.js assets\graph-data.js assets\patch-cable-lab.js assets\timeline-data.js assets\timeline-view.js assets\film-wall-data.js assets\film-wall.js assets\presentation-data.js
```

- [ ] Capture desktop and mobile screenshots with Edge headless and inspect that the home wall is larger, text is secondary, and the tag browser replaces the old database filters.

