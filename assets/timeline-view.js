const rootInstances = new WeakMap();

export function renderSignalTimeline(root, items, options = {}) {
  if (!root || typeof root.innerHTML !== "string") {
    throw new TypeError("renderSignalTimeline(root, items) needs a DOM element root.");
  }

  const previous = rootInstances.get(root);
  if (previous?.handler) root.removeEventListener("click", previous.handler);

  const safeItems = normalizeItems(items);
  const itemById = new Map(safeItems.map((item) => [item.id, item]));
  root.innerHTML = renderReleaseIndex(safeItems, options);

  const handler = (event) => {
    if (!event.target || typeof event.target.closest !== "function") return;
    const trigger = event.target.closest("[data-st-id]");
    if (!trigger || !root.contains(trigger)) return;
    const id = trigger.dataset.stId;
    if (typeof options.onSelect === "function") options.onSelect(id, itemById.get(id) || null, event);
  };

  root.addEventListener("click", handler);

  const api = {
    update(nextItems, nextOptions = {}) {
      return renderSignalTimeline(root, nextItems, { ...options, ...nextOptions });
    },
    destroy() {
      root.removeEventListener("click", handler);
      root.innerHTML = "";
      rootInstances.delete(root);
    },
  };

  rootInstances.set(root, { handler, api });
  return api;
}

function renderReleaseIndex(items, options) {
  const title = options.title || "按年份浏览";
  const subtitle = options.subtitle || "只按发行年排序，不代表影片覆盖年代。";
  const groups = groupByYear(items);

  return `
    <section class="signal-timeline is-release-index" aria-label="${escapeAttribute(title)}">
      ${options.showHeader === false ? "" : renderHeader(title, subtitle, items.length, groups.length, options)}
      ${
        items.length === 0
          ? renderEmptyState(options)
          : `<div class="st-year-stream">${groups.map((group) => renderYearGroup(group, options)).join("")}</div>`
      }
    </section>
  `;
}

function renderHeader(title, subtitle, itemCount, yearCount, options) {
  const kicker = options.kicker || "Release index";
  const compact = options.compact || "compact view";
  const yearsLabel = options.yearsLabel || "years";
  return `
    <div class="st-header">
      <div class="st-heading">
        <p class="st-kicker">${escapeHtml(kicker)} / ${escapeHtml(compact)}</p>
        <h3 class="st-title">${escapeHtml(title)}</h3>
        <p class="st-subtitle">${escapeHtml(subtitle)}</p>
      </div>
      <div class="st-readout" aria-label="${itemCount} films across ${yearCount} release years">
        <strong>${escapeHtml(itemCount)}</strong>
        <span>${escapeHtml(yearCount)} ${escapeHtml(yearsLabel)}</span>
      </div>
    </div>
  `;
}

function renderYearGroup(group, options) {
  const filmUnit = options.filmUnit || "部";
  const yearFilmLabel = options.yearFilmLabel || "年影片";
  return `
    <article class="st-year-band">
      <div class="st-year-marker">
        <strong>${escapeHtml(group.year)}</strong>
        <span>${group.items.length} ${escapeHtml(filmUnit)}</span>
      </div>
      <div class="st-year-rail" aria-label="${escapeAttribute(group.year)} ${escapeAttribute(yearFilmLabel)}">
        ${group.items.map((item) => renderChip(item, options)).join("")}
      </div>
    </article>
  `;
}

function renderChip(item, options) {
  const grade = normalizeGrade(item.gradeCode ?? item.grade_code);
  const watch = normalizeWatchAccess(item.watchAccess ?? item.watch_access);
  const label = [item.title, item.original_title, item.year].filter(Boolean).join(" / ");

  return `
    <button
      class="st-event st-event-card st-grade-${escapeAttribute(grade.toLowerCase())} st-watch-${escapeAttribute(classToken(watch))}"
      type="button"
      data-st-id="${escapeAttribute(item.id)}"
      title="${escapeAttribute(label)}"
      aria-label="${escapeAttribute(label)}"
    >
      <span class="st-node" aria-hidden="true"></span>
      <span class="st-event-copy">
        <span class="st-event-title">${escapeHtml(item.title || item.original_title || "Untitled")}</span>
        <span class="st-event-meta">${escapeHtml([grade, watchLabel(watch, options), item.section].filter(Boolean).join(" / "))}</span>
      </span>
    </button>
  `;
}

function renderEmptyState(options) {
  const title = options.emptyTitle || "没有匹配的年份索引";
  const body = options.emptyBody || "放宽筛选条件，或回到完整片库查看发行年份分布。";

  return `
    <div class="st-empty" role="status">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(body)}</p>
    </div>
  `;
}

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item && item.id)
    .map((item) => ({ ...item, id: String(item.id), year: parseYear(item.year ?? item.sort_year) }))
    .filter((item) => Number.isFinite(item.year))
    .sort((a, b) => a.year - b.year || String(a.title || "").localeCompare(String(b.title || "")));
}

function groupByYear(items) {
  const groups = new Map();
  items.forEach((item) => {
    if (!groups.has(item.year)) groups.set(item.year, []);
    groups.get(item.year).push(item);
  });

  return [...groups.entries()].map(([year, groupItems]) => ({
    year,
    items: groupItems,
  }));
}

function parseYear(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const match = value.match(/\d{4}/);
    return match ? Number(match[0]) : NaN;
  }
  return NaN;
}

function normalizeGrade(value) {
  const text = String(value || "U").trim();
  return text ? text[0].toUpperCase() : "U";
}

function normalizeWatchAccess(value) {
  if (Array.isArray(value)) return normalizeWatchAccess(value[0]);
  if (value && typeof value === "object") return normalizeWatchAccess(value.primary || value.type || value.access_type);
  return String(value || "unknown").trim().toLowerCase();
}

function watchLabel(value, options = {}) {
  const labels = {
    free: "免费",
    library: "馆藏",
    subscription: "订阅",
    rental: "点播",
    purchase: "点播",
    event_only: "活动",
    official: "官方",
    unknown: "待核",
  };
  if (options.watchLabels?.[value]) return options.watchLabels[value];
  return labels[value] || value.toUpperCase();
}

function classToken(value) {
  return (
    String(value || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "unknown"
  );
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
