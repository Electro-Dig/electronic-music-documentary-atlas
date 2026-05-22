import { renderSignalTimeline } from "./timeline-view.js";
import { ROUTES, getFilterTags, prepareFilm } from "./presentation-data.js";

const DATA_URL = "data/documentaries.json";
const timelineData = window.TimelineData || {};
const DEFAULT_LOCALE = "zh";
const UI_STRINGS = {
  zh: {
    "site.title": "电子音乐纪录片地图",
    "site.description": "一个面向中文用户的电子音乐纪录片策展档案、观看指南和知识地图。",
    "nav.library": "片库",
    "nav.lab": "实验室",
    "nav.routes": "观看路线",
    "nav.method": "方法",
    "hero.eyebrow": "Spatial film wall / curated archive",
    "hero.title": "电子音乐纪录片地图",
    "hero.lede": "从乐器、录音室、舞池到城市现场，按封面、线索和观看渠道浏览。",
    "hero.browse": "浏览片库",
    "hero.watchable": "只看可观看",
    "stats.total": "重要片目",
    "stats.core": "核心影片",
    "stats.free": "含免费线索",
    "stats.sources": "来源记录",
    "routes.eyebrow": "Curated paths",
    "routes.title": "按线索观看",
    "routes.note": "从入门、机器、舞池、欧洲线索和女性先锋进入。",
    "library.eyebrow": "Curated library",
    "library.title": "电子音乐纪录片片库",
    "library.loading": "正在加载片库…",
    "library.searchPlaceholder": "片名、人物、主题、技术…",
    "library.panelEyebrow": "Contact sheet",
    "library.panelTitle": "按封面浏览",
    "library.panelBody": "每张封面通向一部影片档案，包含简介、主题标签、来源和可观看渠道。",
    "library.count": "{shown} / {total} 部影片",
    "library.loadError": "无法加载片库数据：{message}",
    "library.loadFailed": "数据加载失败",
    "filters.search": "搜索",
    "filters.sort": "排序",
    "filters.reset": "重置",
    "filters.anyTag": "可多选，按任一标签匹配",
    "filters.active": "当前标签：{labels}",
    "filters.empty": "没有匹配的片目。可以重置筛选，或换一个主题入口。",
    "filters.expand": "展开 {count} 个细分标签",
    "filters.collapse": "收起细分标签",
    "filters.moreHint": "默认只显示路线、观看状态和出现 2 次以上的主题，避免标签墙遮挡片库。",
    "filters.topicDetail": "细分主题",
    "sort.yearAsc": "按年份从早到晚",
    "sort.yearDesc": "按年份从晚到早",
    "sort.title": "按原名",
    "timeline.eyebrow": "Release index",
    "timeline.title": "按年份浏览",
    "timeline.note": "只按发行年排序，不代表影片覆盖年代。",
    "timeline.emptyTitle": "没有匹配的时间信号",
    "timeline.emptyBody": "放宽筛选条件，或回到完整片库查看发行年份。",
    "method.eyebrow": "About",
    "method.title": "关于这个片单",
    "method.standardTitle": "选择标准",
    "method.standardBody": "优先收录能解释电子音乐史关键节点的影片：乐器、录音室、城市、舞池、媒介和社群。",
    "method.watchTitle": "观看渠道",
    "method.watchBody": "链接按官方、平台、馆藏、用户上传和待核验来源区分；公开放映仍需另行确认授权。",
    "method.updateTitle": "持续更新",
    "method.updateBody": "片名、年份、导演、简介和片源会继续核对。整理：@电子音乐考古小分队。",
    "dialog.close": "关闭详情",
    "dialog.dossier": "Film dossier",
    "dialog.summaryTitle": "简介",
    "dialog.watchTitle": "观看渠道",
    "dialog.sourceTitle": "资料来源",
    "dialog.noSummary": "暂无简介。",
    "dialog.noWatch": "暂无稳定观看渠道",
    "dialog.noWatchMeta": "待继续核验 B站、YouTube、平台片源与授权信息",
    "dialog.noSource": "暂无来源记录",
    "film.openDossier": "打开 {title} 档案",
    "film.dossierCue": "档案",
    "fact.year": "年份",
    "fact.runtime": "片长",
    "fact.director": "导演",
    "fact.section": "章节",
    "route.signal": "观看线索",
    "route.enter": "进入这条路线",
    "route.stageCount": "{count} 部影片 / {featured} 张代表封面",
    "route.selectorCount": "{index} / {count} films",
    "grade.S": "核心影片",
    "grade.A": "重要影片",
    "grade.B": "延伸片目",
    "grade.pending": "待分级",
    "watch.free": "免费",
    "watch.library": "馆藏",
    "watch.vod": "点播",
    "watch.event": "授权",
    "watch.unknown": "待核",
    "watch.platformFallback": "观看入口",
    "sourceKind.my_upload": "我的字幕",
    "sourceKind.fan_sub": "中文字幕",
    "sourceKind.raw_upload": "生肉",
    "sourceKind.official_upload": "官方上传",
    "subtitle.zh_sub": "中文字幕",
    "subtitle.no_sub": "生肉",
    "subtitle.unknown": "字幕待核",
    "reliability.official": "官方",
    "reliability.rights_holder": "权利方",
    "reliability.platform": "平台",
    "reliability.institution": "机构",
    "reliability.distributor": "发行方",
    "reliability.secondary": "二级资料",
    "reliability.user_upload": "用户上传",
    "reliability.archive": "档案来源",
    "reliability.uncertain": "待核验",
    "sourceType.source": "资料",
    "sourceType.database": "数据库",
    "sourceType.festival": "影展",
    "sourceType.platform": "平台",
    "sourceType.official": "官方",
    "sourceType.distributor": "发行",
    "sourceType.institution": "机构",
    "sourceType.wiki": "百科",
    "watchAccess.free": "免费",
    "watchAccess.library": "馆藏",
    "watchAccess.subscription": "订阅",
    "watchAccess.rental": "租赁",
    "watchAccess.purchase": "购买",
    "watchAccess.event_only": "活动放映",
    "watchAccess.unknown": "待核验",
    "screening.permission_required": "授权待核验",
    "screening.allowed": "可公开",
    "screening.unknown": "公开放映待核验",
    "tagGroup.观看": "观看",
    "tagGroup.路线": "路线",
    "tagGroup.主题": "主题",
    "tag.has-watch": "有观看渠道",
    "tag.free-watch": "免费可看",
    "tag.bilibili-watch": "B站可看",
    "tag.platform-library": "馆藏/平台",
    "route.entry-path.label": "入门路径",
    "route.entry-path.description": "从总览、乐器、声音实验、techno 和采样进入电子音乐纪录片。",
    "route.entry-path.scene": "Listening desk / 入门导览台",
    "route.entry-path.curatorialNote": "先建立电子音乐纪录片的基本坐标，再进入器物、舞池和人物线索。",
    "route.machine-studio.label": "机器与录音室",
    "route.machine-studio.description": "电子乐器、合成器、磁带、声音实验室和工作室作为乐器的历史。",
    "route.machine-studio.scene": "Patch bay / 机器与录音室",
    "route.machine-studio.curatorialNote": "把乐器、磁带、广播工作室和模块合成器看作声音历史的生产现场。",
    "route.dancefloor-city.label": "舞池与城市",
    "route.dancefloor-city.description": "Disco、house、techno、rave、dub 和俱乐部社会史。",
    "route.dancefloor-city.scene": "Night city circuit / 舞池与城市",
    "route.dancefloor-city.curatorialNote": "从 disco、house、dub、rave 到中国场景，追踪舞池如何成为城市网络。",
    "route.european-lines.label": "欧洲线索",
    "route.european-lines.description": "Krautrock、synth-pop、Belgian New Beat 和德国/欧洲电子身份。",
    "route.european-lines.scene": "Continental signal / 欧洲线索",
    "route.european-lines.curatorialNote": "把德国、英国、比利时和柏林的电子身份放在欧洲战后文化脉络中阅读。",
    "route.women-pioneers.label": "女性先锋",
    "route.women-pioneers.description": "女性电子音乐作者、声音实验和被遮蔽的技术谱系。",
    "route.women-pioneers.scene": "Recovered signals / 女性先锋",
    "route.women-pioneers.curatorialNote": "把被遮蔽的女性作曲家、工程师和声音实验者重新放回技术谱系。"
  },
  en: {
    "site.title": "Electronic Music Documentary Atlas",
    "site.description": "A curated atlas of electronic music documentaries, viewing paths, sources, and watch links.",
    "nav.library": "Library",
    "nav.lab": "Lab",
    "nav.routes": "Paths",
    "nav.method": "About",
    "hero.eyebrow": "Spatial film wall / curated archive",
    "hero.title": "Electronic Music Documentary Atlas",
    "hero.lede": "Browse films through instruments, studios, dancefloors, cities, sources, and watch links.",
    "hero.browse": "Browse library",
    "hero.watchable": "Watchable only",
    "stats.total": "Films",
    "stats.core": "Core films",
    "stats.free": "Free links",
    "stats.sources": "Sources",
    "routes.eyebrow": "Curated paths",
    "routes.title": "Viewing paths",
    "routes.note": "Start from entry films, machines, dancefloors, European lines, or women pioneers.",
    "library.eyebrow": "Curated library",
    "library.title": "Documentary library",
    "library.loading": "Loading library...",
    "library.searchPlaceholder": "Title, person, theme, technology...",
    "library.panelEyebrow": "Contact sheet",
    "library.panelTitle": "Browse by cover",
    "library.panelBody": "Each cover opens a film dossier with summary, tags, sources, and watch links.",
    "library.count": "{shown} / {total} films",
    "library.loadError": "Could not load library data: {message}",
    "library.loadFailed": "Data failed to load",
    "filters.search": "Search",
    "filters.sort": "Sort",
    "filters.reset": "Reset",
    "filters.anyTag": "Select multiple tags; any selected tag can match.",
    "filters.active": "Active tags: {labels}",
    "filters.empty": "No matching films. Reset filters or try another path.",
    "filters.expand": "Show {count} detailed tags",
    "filters.collapse": "Hide detailed tags",
    "filters.moreHint": "Only paths, availability, and recurring topics are shown by default.",
    "filters.topicDetail": "Detailed topics",
    "sort.yearAsc": "Year, earliest first",
    "sort.yearDesc": "Year, latest first",
    "sort.title": "Original title",
    "timeline.eyebrow": "Release index",
    "timeline.title": "Browse by year",
    "timeline.note": "Sorted by release year only, not by the period covered in each film.",
    "timeline.emptyTitle": "No matching release signal",
    "timeline.emptyBody": "Relax filters or return to the full library.",
    "method.eyebrow": "About",
    "method.title": "About this list",
    "method.standardTitle": "Selection",
    "method.standardBody": "Priority goes to films that explain structural nodes in electronic music history: instruments, studios, cities, dancefloors, media, and communities.",
    "method.watchTitle": "Watch links",
    "method.watchBody": "Links are marked as official, platform, library, user-uploaded, or unverified. Public screenings still require separate rights checks.",
    "method.updateTitle": "Updates",
    "method.updateBody": "Titles, years, directors, summaries, and watch links will continue to be checked. Curated by @电子音乐考古小分队.",
    "dialog.close": "Close details",
    "dialog.dossier": "Film dossier",
    "dialog.summaryTitle": "Summary",
    "dialog.watchTitle": "Watch links",
    "dialog.sourceTitle": "Sources",
    "dialog.noSummary": "No summary yet.",
    "dialog.noWatch": "No stable watch link yet",
    "dialog.noWatchMeta": "Bilibili, YouTube, platform links, and rights status still need checking.",
    "dialog.noSource": "No source recorded yet",
    "film.openDossier": "Open {title} dossier",
    "film.dossierCue": "Dossier",
    "fact.year": "Year",
    "fact.runtime": "Runtime",
    "fact.director": "Director",
    "fact.section": "Section",
    "route.signal": "Viewing path",
    "route.enter": "Open this path",
    "route.stageCount": "{count} films / {featured} cover picks",
    "route.selectorCount": "{index} / {count} films",
    "grade.S": "Core film",
    "grade.A": "Key film",
    "grade.B": "Extended shelf",
    "grade.pending": "Unsorted",
    "watch.free": "Free",
    "watch.library": "Library",
    "watch.vod": "VOD",
    "watch.event": "Rights",
    "watch.unknown": "Check",
    "watch.platformFallback": "Watch link",
    "sourceKind.my_upload": "My subtitled upload",
    "sourceKind.fan_sub": "Chinese subtitles",
    "sourceKind.raw_upload": "No subtitles",
    "sourceKind.official_upload": "Official upload",
    "subtitle.zh_sub": "Chinese subtitles",
    "subtitle.no_sub": "No subtitles",
    "subtitle.unknown": "Subtitle status unknown",
    "reliability.official": "Official",
    "reliability.rights_holder": "Rights holder",
    "reliability.platform": "Platform",
    "reliability.institution": "Institution",
    "reliability.distributor": "Distributor",
    "reliability.secondary": "Secondary source",
    "reliability.user_upload": "User upload",
    "reliability.archive": "Archive",
    "reliability.uncertain": "Unverified",
    "sourceType.source": "Source",
    "sourceType.database": "Database",
    "sourceType.festival": "Festival",
    "sourceType.platform": "Platform",
    "sourceType.official": "Official",
    "sourceType.distributor": "Distributor",
    "sourceType.institution": "Institution",
    "sourceType.wiki": "Wiki",
    "watchAccess.free": "Free",
    "watchAccess.library": "Library",
    "watchAccess.subscription": "Subscription",
    "watchAccess.rental": "Rental",
    "watchAccess.purchase": "Purchase",
    "watchAccess.event_only": "Screening only",
    "watchAccess.unknown": "Unverified",
    "screening.permission_required": "Rights check needed",
    "screening.allowed": "Screening allowed",
    "screening.unknown": "Screening rights unknown",
    "tagGroup.观看": "Watch",
    "tagGroup.路线": "Path",
    "tagGroup.主题": "Topic",
    "tag.has-watch": "Has watch links",
    "tag.free-watch": "Free to watch",
    "tag.bilibili-watch": "On Bilibili",
    "tag.platform-library": "Library/platform",
    "route.entry-path.label": "Entry path",
    "route.entry-path.description": "A starting route through overviews, instruments, sound labs, techno, and sampling.",
    "route.entry-path.scene": "Listening desk / Entry guide",
    "route.entry-path.curatorialNote": "Build the basic map before moving into machines, dancefloors, and people.",
    "route.machine-studio.label": "Machines and studios",
    "route.machine-studio.description": "Electronic instruments, synthesizers, tape, sound labs, and the studio as instrument.",
    "route.machine-studio.scene": "Patch bay / Machines and studios",
    "route.machine-studio.curatorialNote": "Read instruments, tape, broadcast workshops, and modular systems as production sites.",
    "route.dancefloor-city.label": "Dancefloors and cities",
    "route.dancefloor-city.description": "Disco, house, techno, rave, dub, and club social history.",
    "route.dancefloor-city.scene": "Night city circuit / Dancefloors and cities",
    "route.dancefloor-city.curatorialNote": "Follow how dancefloors became urban networks, from disco and house to dub, rave, and Chinese scenes.",
    "route.european-lines.label": "European lines",
    "route.european-lines.description": "Krautrock, synth-pop, Belgian New Beat, and German/European electronic identities.",
    "route.european-lines.scene": "Continental signal / European lines",
    "route.european-lines.curatorialNote": "Place Germany, Britain, Belgium, and Berlin in postwar European culture.",
    "route.women-pioneers.label": "Women pioneers",
    "route.women-pioneers.description": "Women electronic composers, sound experiments, and obscured technical lineages.",
    "route.women-pioneers.scene": "Recovered signals / Women pioneers",
    "route.women-pioneers.curatorialNote": "Put overlooked women composers, engineers, and sound experimenters back into the technical lineage."
  }
};

const state = {
  locale: getInitialLocale(),
  allFilms: [],
  films: [],
  filtered: [],
  route: "",
  routePreview: "",
  search: "",
  selectedTags: new Set(),
  tagsExpanded: false,
  sort: "year-asc",
};

const els = {
  statCount: document.querySelector("#stat-count"),
  statCore: document.querySelector("#stat-core"),
  statFree: document.querySelector("#stat-free"),
  statSources: document.querySelector("#stat-sources"),
  routeGrid: document.querySelector("#route-grid"),
  filmGrid: document.querySelector("#film-grid"),
  signalTimelineRoot: document.querySelector("#signal-timeline-root"),
  resultCount: document.querySelector("#result-count"),
  searchInput: document.querySelector("#search-input"),
  tagChipGroups: document.querySelector("#tag-chip-groups"),
  selectedTags: document.querySelector("#selected-tags"),
  sortFilter: document.querySelector("#sort-filter"),
  resetFilters: document.querySelector("#reset-filters"),
  dialog: document.querySelector("#film-dialog"),
  dialogContent: document.querySelector("#dialog-content"),
  dialogClose: document.querySelector(".dialog-close"),
  watchNow: document.querySelector("[data-watch-now]"),
  languageButtons: document.querySelectorAll("[data-locale]"),
};

let timelineView = null;

applyStaticTranslations();
init();

function getInitialLocale() {
  try {
    const stored = localStorage.getItem("emda-locale");
    return stored === "en" ? "en" : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

function setLocale(locale) {
  const nextLocale = locale === "en" ? "en" : DEFAULT_LOCALE;
  if (state.locale === nextLocale) return;
  state.locale = nextLocale;
  try {
    localStorage.setItem("emda-locale", nextLocale);
  } catch {
    // Private browsing and local file previews can block storage.
  }
  applyStaticTranslations();
  if (state.films.length) {
    renderFilterTags();
    renderRoutes();
    applyFilters();
  }
}

function applyStaticTranslations() {
  document.documentElement.lang = state.locale === "en" ? "en" : "zh-CN";
  document.title = t("site.title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("site.description"));

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n, {}, element.textContent);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder, {}, element.getAttribute("placeholder")));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel, {}, element.getAttribute("aria-label")));
  });
  els.languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.locale === state.locale));
  });
}

function t(key, params = {}, fallback = "") {
  const dictionary = UI_STRINGS[state.locale] || UI_STRINGS[DEFAULT_LOCALE];
  const defaultDictionary = UI_STRINGS[DEFAULT_LOCALE] || {};
  const template = dictionary[key] ?? defaultDictionary[key] ?? fallback ?? key;
  return Object.entries(params).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value ?? "")),
    String(template)
  );
}

function routeText(route, field) {
  if (!route?.id) return "";
  return t(`route.${route.id}.${field}`, {}, route[field] || "");
}

function filterTagLabel(tag) {
  return t(`tag.${tag.id}`, {}, tag.label || tag.id);
}

function tagGroupLabel(group) {
  return t(`tagGroup.${group}`, {}, group);
}

function publicGradeLabel(film) {
  return t(`grade.${film.grade_code}`, {}, film.publicGradeLabel ?? film.grade_code ?? "");
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.allFilms = (await response.json()).map(prepareFilm);
    state.films = state.allFilms.filter((film) => film.collectionVisibility === "main");
    state.filtered = [...state.films];
    hydrateStats();
    renderFilterTags();
    renderRoutes();
    bindEvents();
    applyFilters();
  } catch (error) {
    els.filmGrid.innerHTML = `<div class="empty-state">${escapeHtml(t("library.loadError", { message: error.message }))}</div>`;
    els.resultCount.textContent = t("library.loadFailed");
  }
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    applyFilters();
  });
  els.sortFilter.addEventListener("change", (event) => {
    state.sort = event.target.value;
    applyFilters();
  });
  els.resetFilters.addEventListener("click", resetFilters);
  els.languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLocale(button.dataset.locale));
  });
  els.watchNow.addEventListener("click", () => {
    state.selectedTags = new Set(["has-watch"]);
    state.route = "";
    renderFilterTags();
    document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
    applyFilters();
  });
  window.addEventListener("open-film-detail", (event) => {
    const id = event.detail?.id;
    if (id) openFilm(id);
  });
  els.dialogClose.addEventListener("click", () => els.dialog.close());
  els.dialog.addEventListener("click", (event) => {
    if (event.target === els.dialog) els.dialog.close();
  });
}

function hydrateStats() {
  const sourceCount = state.films.reduce((total, film) => total + (film.sources?.length || 0), 0);
  const freeCount = state.films.filter((film) =>
    film.watch_channels?.some((channel) => channel.access_type === "free")
  ).length;
  els.statCount.textContent = state.films.length;
  els.statCore.textContent = state.films.filter((film) => film.grade_code === "S").length;
  els.statFree.textContent = freeCount;
  els.statSources.textContent = sourceCount;
}

function renderFilterTags() {
  const tags = getFilterTags().map((tag) => ({
    ...tag,
    count: state.films.filter((film) => filmTagIds(film).includes(tag.id)).length,
  }));
  const groups = unique(tags.map((tag) => tag.group));
  const visibleGroups = groups
    .map((group) => ({
      group,
      tags: tags.filter(
        (tag) =>
          tag.group === group &&
          tag.count > 0 &&
          (group !== "主题" || tag.count > 1 || state.selectedTags.has(tag.id))
      ),
    }))
    .filter((group) => group.tags.length);
  const hiddenTopicTags = tags.filter(
    (tag) => tag.group === "主题" && tag.count === 1 && !state.selectedTags.has(tag.id)
  );

  els.tagChipGroups.innerHTML = [
    ...visibleGroups.map(({ group, tags: groupTags }) => renderTagGroup(group, groupTags)),
    hiddenTopicTags.length
      ? `
        <div class="tag-chip-more ${state.tagsExpanded ? "is-open" : ""}">
          <button class="tag-more-toggle" type="button" data-toggle-tags aria-expanded="${String(state.tagsExpanded)}">
            ${state.tagsExpanded ? t("filters.collapse") : t("filters.expand", { count: hiddenTopicTags.length })}
          </button>
          ${
            state.tagsExpanded
              ? renderTagGroup("细分主题", hiddenTopicTags)
              : `<div class="tag-more-hint">${escapeHtml(t("filters.moreHint"))}</div>`
          }
        </div>
      `
      : "",
  ].join("");

  els.tagChipGroups.querySelectorAll("[data-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.tag;
      if (state.selectedTags.has(id)) state.selectedTags.delete(id);
      else state.selectedTags.add(id);
      state.route = "";
      renderFilterTags();
      applyFilters();
    });
  });
  els.tagChipGroups.querySelector("[data-toggle-tags]")?.addEventListener("click", () => {
    state.tagsExpanded = !state.tagsExpanded;
    renderFilterTags();
  });

  const activeLabels = tags.filter((tag) => state.selectedTags.has(tag.id)).map((tag) => filterTagLabel(tag));
  els.selectedTags.textContent = activeLabels.length
    ? t("filters.active", { labels: activeLabels.join(" / ") })
    : t("filters.anyTag");
}

function renderTagGroup(group, groupTags) {
  const groupLabel = group === "细分主题" ? t("filters.topicDetail") : tagGroupLabel(group);
  return `
    <div class="tag-chip-group">
      <span class="tag-group-title">${escapeHtml(groupLabel)}</span>
      <div class="tag-chip-row">
        ${groupTags
          .map((tag) => {
            const active = state.selectedTags.has(tag.id);
            return `
              <button
                class="tag-chip"
                type="button"
                data-tag="${escapeAttribute(tag.id)}"
                aria-pressed="${String(active)}"
              >
                <span>${escapeHtml(filterTagLabel(tag))}</span>
                <small>${tag.count}</small>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderRoutes() {
  const activeRoute = ROUTES.find((route) => route.id === state.routePreview) || ROUTES[0];
  state.routePreview = activeRoute?.id || "";

  els.routeGrid.innerHTML = `
    <div class="route-gallery">
      <div class="route-selector-rail" role="tablist" aria-label="${escapeAttribute(t("routes.title"))}">
        ${ROUTES.map((route, index) => renderRouteSelector(route, index)).join("")}
      </div>
      ${renderRouteStage(activeRoute)}
    </div>
  `;

  els.routeGrid.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => setActiveRoutePreview(button.dataset.route));
  });
  els.routeGrid.querySelector("[data-enter-route]")?.addEventListener("click", () => {
    resetFilters(false);
    state.route = activeRoute.id;
    document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
    applyFilters();
  });
  els.routeGrid.querySelectorAll("[data-route-film]").forEach((button) => {
    button.addEventListener("click", () => openFilm(button.dataset.routeFilm));
  });
}

function setActiveRoutePreview(routeId) {
  if (!ROUTES.some((route) => route.id === routeId)) return;
  state.routePreview = routeId;
  renderRoutes();
  syncRouteButtons();
}

function renderRouteSelector(route, index) {
  const ids = routeFilmIds(route);
  const count = state.films.filter((film) => ids.has(film.id)).length;
  const isActive = route.id === state.routePreview;
  return `
    <button
      class="route-card route-chapter route-tab"
      type="button"
      data-route="${route.id}"
      role="tab"
      aria-selected="${String(isActive)}"
      aria-pressed="${String(route.id === state.route)}"
    >
      <span class="route-card-head">
        <small>${escapeHtml(t("route.selectorCount", { index: String(index + 1).padStart(2, "0"), count }))}</small>
        <em>${escapeHtml(route.kicker || "")}</em>
      </span>
      <span class="route-card-copy">
        <span class="route-scene">${escapeHtml(routeText(route, "scene"))}</span>
        <strong>${escapeHtml(routeText(route, "label"))}</strong>
      </span>
    </button>
  `;
}

function renderRouteStage(route) {
  if (!route) return "";
  const ids = routeFilmIds(route);
  const count = state.films.filter((film) => ids.has(film.id)).length;
  const featuredFilms = (route.featured || [])
    .map((id) => state.films.find((film) => film.id === id))
    .filter(Boolean)
    .slice(0, 6);

  return `
    <article class="route-stage" data-route-stage="${escapeAttribute(route.id)}">
      <div class="route-stage-copy">
        <p class="eyebrow">${escapeHtml(t("route.signal"))} / ${escapeHtml(route.kicker || "")}</p>
        <h3>${escapeHtml(routeText(route, "label"))}</h3>
        <p class="route-stage-description">${escapeHtml(routeText(route, "description"))}</p>
        <p class="route-curatorial-note">${escapeHtml(routeText(route, "curatorialNote"))}</p>
        <div class="route-stage-actions">
          <button class="route-entry-button" type="button" data-enter-route="${escapeAttribute(route.id)}">
            ${escapeHtml(t("route.enter"))}
          </button>
          <span>${escapeHtml(t("route.stageCount", { count, featured: featuredFilms.length }))}</span>
        </div>
      </div>
      <div class="route-stage-visual">
        <span class="route-stage-scene">${escapeHtml(routeText(route, "scene"))}</span>
        <span class="route-poster-stack route-stage-posters" aria-hidden="true">
          ${renderRoutePosterStack(featuredFilms)}
        </span>
        <div class="route-film-strip">
          ${featuredFilms
            .map((film, index) => {
              const title = film.displayTitle?.primary || film.original_title || film.title || "";
              return `
                <button type="button" data-route-film="${escapeAttribute(film.id)}">
                  <small>${String(index + 1).padStart(2, "0")}</small>
                  <span>${escapeHtml(title)}</span>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    </article>
  `;
}

function renderRoutePosterStack(films) {
  if (!films.length) {
    return `<span class="route-card-plate route-card-plate-empty">NO POSTER</span>`;
  }

  return films
    .map((film) => {
      const poster = posterPath(film);
      const title = film.displayTitle?.primary || film.original_title || film.title || "";
      return `
        <span class="route-card-plate">
          ${
            poster
              ? `<img src="${poster}" alt="${escapeHtml(film.poster?.alt || title)}" loading="lazy" />`
              : `<span>${escapeHtml(title)}</span>`
          }
        </span>
      `;
    })
    .join("");
}

function applyFilters() {
  const route = ROUTES.find((item) => item.id === state.route);
  const routeIds = route ? routeFilmIds(route) : null;
  const query = state.search.toLowerCase();
  let films = state.films.filter((film) => {
    if (routeIds && !routeIds.has(film.id)) return false;
    if (!matchesSelectedTags(film)) return false;
    if (!query) return true;
    return searchableText(film).includes(query);
  });

  films = sortFilms(films, state.sort);
  state.filtered = films;
  syncRouteButtons();
  renderTimeline();
  renderFilms();
}

function renderFilms() {
  els.resultCount.textContent = t("library.count", { shown: state.filtered.length, total: state.films.length });
  if (!state.filtered.length) {
    els.filmGrid.innerHTML = `<div class="empty-state">${escapeHtml(t("filters.empty"))}</div>`;
    return;
  }

  els.filmGrid.innerHTML = state.filtered
    .map((film, index) => {
      const poster = posterPath(film);
      const tags = (film.publicTags || []).slice(0, 3);
      const watch = watchStatus(film);
      const title = film.displayTitle.primary || "";
      const gradeLabel = publicGradeLabel(film);
      const density = index % 11 === 0 ? "anchor" : index % 7 === 0 ? "offset" : "standard";
      return `
        <article class="film-card film-tile" data-density="${escapeAttribute(density)}">
          <button class="film-tile-button" type="button" data-film="${escapeAttribute(film.id)}" aria-label="${escapeAttribute(t("film.openDossier", { title }))}">
            <div class="poster-wrap">
              ${poster ? `<img src="${poster}" alt="${escapeHtml(film.poster?.alt || title)}" loading="lazy" />` : fallbackPoster()}
              <span class="watch-badge" data-watch="${escapeAttribute(watch.type)}">${escapeHtml(watch.label)}</span>
              <span class="tile-detail-cue">${escapeHtml(t("film.dossierCue"))}</span>
            </div>
            <div class="tile-caption">
              <div class="tile-meta-row">
                <span>${escapeHtml([film.year, gradeLabel].filter(Boolean).join(" / "))}</span>
                <span>${escapeHtml(film.section || "")}</span>
              </div>
              <h3 class="film-title">${escapeHtml(title)}</h3>
              ${film.displayTitle.secondary ? `<div class="original-title">${escapeHtml(film.displayTitle.secondary)}</div>` : ""}
              <div class="meta-line">${escapeHtml((film.directors || []).join(" / "))}</div>
              <div class="tag-row tile-tags">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
            </div>
          </button>
        </article>
      `;
    })
    .join("");

  els.filmGrid.querySelectorAll("[data-film]").forEach((button) => {
    button.addEventListener("click", () => openFilm(button.dataset.film));
  });
}

function openFilm(id) {
  const film = state.allFilms.find((item) => item.id === id);
  if (!film) return;
  const poster = posterPath(film);
  const gradeLabel = publicGradeLabel(film);
  els.dialogContent.innerHTML = `
    <div class="dialog-layout dialog-dossier dialog-exhibit">
      <aside class="dialog-aside dialog-hero-panel">
        <div class="dialog-poster">
          ${poster ? `<img src="${poster}" alt="${escapeHtml(film.poster?.alt || film.displayTitle.primary)}" />` : fallbackPoster()}
        </div>
        <div class="dialog-signal-bar" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div class="dialog-hero-meta">
          <span>${escapeHtml(film.year || "")}</span>
          <span>${escapeHtml(gradeLabel || "")}</span>
          <span>${escapeHtml(watchStatus(film).label)}</span>
        </div>
      </aside>
      <div class="dialog-main dialog-story-panel">
        <header class="dialog-head">
          <div class="dialog-title-block">
            <p class="eyebrow">${escapeHtml(t("dialog.dossier"))} / ${escapeHtml(gradeLabel || t("grade.pending"))}</p>
            <h2 id="dialog-title">${escapeHtml(film.displayTitle.primary || "")}</h2>
            ${film.displayTitle.secondary ? `<p class="original-title">${escapeHtml(film.displayTitle.secondary)}</p>` : ""}
          </div>
          <dl class="dialog-facts">${renderDialogFacts(film)}</dl>
        </header>
        <div class="tag-row dialog-tags">${(film.publicTags || [])
          .slice(0, 6)
          .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
          .join("")}</div>

        <section class="dialog-section">
          <h3>${escapeHtml(t("dialog.summaryTitle"))}</h3>
          <p class="dialog-lede">${escapeHtml(film.summary || t("dialog.noSummary"))}</p>
        </section>

        <div class="dialog-info-grid">
          <section class="dialog-section dialog-watch-panel">
            <h3>${escapeHtml(t("dialog.watchTitle"))}</h3>
            <ul class="watch-list">${renderWatchChannels(film)}</ul>
          </section>

          <section class="dialog-section dialog-source-panel">
            <h3>${escapeHtml(t("dialog.sourceTitle"))}</h3>
            <ul class="source-list compact">${renderSources(film)}</ul>
          </section>
        </div>
      </div>
    </div>
  `;
  els.dialog.showModal();
}

function renderTimeline() {
  if (!els.signalTimelineRoot || typeof timelineData.buildTimelineItems !== "function") return;
  const items = timelineData.buildTimelineItems(state.filtered);
  const options = {
    title: t("timeline.title"),
    subtitle: t("timeline.note"),
    emptyTitle: t("timeline.emptyTitle"),
    emptyBody: t("timeline.emptyBody"),
    kicker: t("timeline.eyebrow"),
    compact: state.locale === "en" ? "compact view" : "紧凑浏览",
    filmUnit: state.locale === "en" ? "films" : "部",
    yearsLabel: state.locale === "en" ? "years" : "年",
    yearFilmLabel: state.locale === "en" ? "films" : "部影片",
    watchLabels: {
      free: t("watch.free"),
      library: t("watch.library"),
      subscription: t("watch.vod"),
      rental: t("watch.vod"),
      purchase: t("watch.vod"),
      event_only: t("watch.event"),
      official: state.locale === "en" ? "Official" : "官方",
      unknown: t("watch.unknown"),
    },
    onSelect: (id) => openFilm(id),
  };
  if (timelineView) {
    timelineView = timelineView.update(items, options);
    return;
  }
  timelineView = renderSignalTimeline(els.signalTimelineRoot, items, options);
}

function renderWatchChannels(film) {
  const channels = film.watch_channels || [];
  if (!channels.length) {
    return `
      <li class="watch-card">
        <div class="watch-card-head">
          <strong>${escapeHtml(t("dialog.noWatch"))}</strong>
        </div>
        <div class="meta-line">${escapeHtml(t("dialog.noWatchMeta"))}</div>
      </li>
    `;
  }

  return channels
    .map((channel) => {
      const label = watchChannelLabel(channel);
      const meta = watchChannelMeta(channel);
      const platform = watchPlatformLabel(channel);
      const title = escapeHtml(channel.platform || t("watch.platformFallback"));
      const body = channel.url
        ? `<a class="watch-link-button" href="${escapeAttribute(channel.url)}" target="_blank" rel="noreferrer">
            <span class="watch-platform">${escapeHtml(platform)}</span>
            <strong>${title}</strong>
          </a>`
        : `<strong class="watch-link-button"><span class="watch-platform">${escapeHtml(platform)}</span>${title}</strong>`;
      return `
        <li class="watch-card">
          <div class="watch-card-head">${body}<strong class="watch-label">${escapeHtml(label)}</strong></div>
          <div class="watch-meta">${meta.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
        </li>
      `;
    })
    .join("");
}

function renderDialogFacts(film) {
  const facts = [
    [t("fact.year"), film.year],
    [t("fact.runtime"), film.runtime],
    [t("fact.director"), (film.directors || []).join(" / ")],
    [t("fact.section"), film.section],
  ].filter(([, value]) => value);

  return facts
    .map(
      ([label, value]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `
    )
    .join("");
}

function routeFilmIds(route) {
  return new Set([...(route?.main || []), ...(route?.auxiliary || [])]);
}

function matchesSelectedTags(film) {
  const selectedTags = [...state.selectedTags];
  if (!selectedTags.length) return true;
  const ids = filmTagIds(film);
  return selectedTags.some((tag) => ids.includes(tag));
}

function filmTagIds(film) {
  const ids = new Set([
    ...(film.publicRoutes?.main || []),
    ...(film.publicRoutes?.auxiliary || []),
    ...(film.publicTags || []).map((tag) => `tag:${tag}`),
  ]);
  const channels = film.watch_channels || [];
  if (channels.length) ids.add("has-watch");
  if (channels.some((channel) => channel.access_type === "free")) ids.add("free-watch");
  if (
    channels.some(
      (channel) =>
        /bilibili|b站/i.test(`${channel.platform || ""} ${channel.url || ""}`) ||
        /哔哩哔哩/.test(`${channel.platform || ""} ${channel.url || ""}`)
    )
  ) {
    ids.add("bilibili-watch");
  }
  if (channels.some((channel) => ["library", "subscription", "rental", "purchase"].includes(channel.access_type))) {
    ids.add("platform-library");
  }
  return [...ids];
}

function renderSources(film) {
  const sources = film.sources || [];
  if (!sources.length) {
    return `<li><span>${escapeHtml(t("dialog.noSource"))}</span></li>`;
  }

  return sources
    .map((source) => {
      const label = [sourceTypeLabel(source.type), reliabilityLabel(source.reliability)].filter(Boolean).join(" / ");
      return `
        <li>
          <a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title || source.url)}</a>
          <div class="meta-line">${escapeHtml(label)}</div>
        </li>
      `;
    })
    .join("");
}

function sortFilms(films, sort) {
  const copy = [...films];
  if (sort === "year-desc") return copy.sort((a, b) => (b.sort_year || 0) - (a.sort_year || 0));
  if (sort === "grade") return copy.sort((a, b) => `${a.grade_code}${a.sort_year}`.localeCompare(`${b.grade_code}${b.sort_year}`));
  if (sort === "title") return copy.sort((a, b) => (a.original_title || a.title).localeCompare(b.original_title || b.title));
  return copy.sort((a, b) => (a.sort_year || 9999) - (b.sort_year || 9999));
}

function searchableText(film) {
  return [
    film.title,
    film.original_title,
    film.section,
    film.summary,
    film.core_argument,
    ...(film.directors || []),
    ...(film.people || []),
    ...(film.themes || []),
    ...(film.genres || []),
    ...(film.regions || []),
    ...(film.cities || []),
    ...(film.technologies || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function watchStatus(film) {
  const channels = film.watch_channels || [];
  if (channels.some((channel) => channel.access_type === "free")) return { type: "free", label: t("watch.free") };
  if (channels.some((channel) => channel.access_type === "library")) return { type: "library", label: t("watch.library") };
  if (channels.some((channel) => ["subscription", "rental", "purchase"].includes(channel.access_type))) {
    return { type: "vod", label: t("watch.vod") };
  }
  if (channels.some((channel) => channel.access_type === "event_only")) return { type: "event", label: t("watch.event") };
  return { type: "unknown", label: t("watch.unknown") };
}

function watchChannelLabel(channel) {
  if (state.locale === "en" && channel.source_kind) {
    return sourceKindLabel(channel.source_kind);
  }
  return (
    channel.display_label ||
    sourceKindLabel(channel.source_kind) ||
    subtitleLabel(channel.subtitle) ||
    [watchAccessLabel(channel.access_type), reliabilityLabel(channel.reliability)].filter(Boolean).join(" / ")
  );
}

function watchChannelMeta(channel) {
  const shouldShowSubtitle = !channel.source_kind;
  return unique([
    shouldShowSubtitle ? subtitleLabel(channel.subtitle) : "",
    watchAccessLabel(channel.access_type),
    reliabilityLabel(channel.reliability),
    screeningLabel(channel.public_screening),
  ]);
}

function watchPlatformLabel(channel) {
  const value = `${channel.platform || ""} ${channel.url || ""}`;
  if (/xiaohongshu|小红书/i.test(value)) return "小红书";
  if (/bilibili|b站|哔哩哔哩/i.test(value)) return "B站";
  if (/youtube|youtu\.be/i.test(value)) return "YouTube";
  return channel.platform || t("watch.platformFallback");
}

function sourceKindLabel(sourceKind) {
  return t(`sourceKind.${sourceKind}`, {}, sourceKind || "");
}

function subtitleLabel(subtitle) {
  return t(`subtitle.${subtitle}`, {}, subtitle || "");
}

function reliabilityLabel(reliability) {
  return t(`reliability.${reliability}`, {}, reliability || "");
}

function sourceTypeLabel(type) {
  return t(`sourceType.${type}`, {}, type || "");
}

function watchAccessLabel(accessType) {
  return t(`watchAccess.${accessType}`, {}, accessType || t("watchAccess.unknown"));
}

function screeningLabel(screening) {
  return t(`screening.${screening}`, {}, screening || "");
}

function posterPath(film) {
  const path = film.poster?.path;
  if (!path) return "";
  return `assets/${path}`;
}

function fallbackPoster() {
  return document.querySelector("#poster-fallback-template").innerHTML;
}

function resetFilters(render = true) {
  state.search = "";
  state.selectedTags = new Set();
  state.tagsExpanded = false;
  state.sort = "year-asc";
  state.route = "";
  els.searchInput.value = "";
  els.sortFilter.value = "year-asc";
  renderFilterTags();
  if (render) applyFilters();
}

function syncRouteButtons() {
  els.routeGrid.querySelectorAll("[data-route]").forEach((button) => {
    const isActive = button.dataset.route === state.route;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
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
