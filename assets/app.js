const DATA_URL = "data/documentaries.json";

const routes = [
  {
    id: "starter-five",
    title: "入门 5 部",
    description: "从电子乐器、声音实验、house、techno 和采样版权进入。",
    match: (film) =>
      [
        "theremin-electronic-odyssey-1993",
        "the-alchemists-of-sound-2003",
        "pump-up-the-volume-a-history-of-house-music-2001",
        "high-tech-soul-the-creation-of-techno-music-2006",
        "copyright-criminals-2009",
      ].includes(film.id),
  },
  {
    id: "machines",
    title: "机器与身体",
    description: "乐器、鼓机、合成器和不可见的电子声音界面。",
    match: (film) =>
      hasAny(film.themes, ["乐器史", "合成器", "模块合成器", "鼓机"]) ||
      hasAny(film.technologies, ["theremin", "Moog synthesizer", "Roland TR-808", "modular synthesizer"]),
  },
  {
    id: "dancefloor",
    title: "舞池如何形成",
    description: "Disco、house、techno、rave 与俱乐部社会史。",
    match: (film) =>
      hasAny(film.genres, ["disco", "house", "techno", "rave", "acid house", "dance music"]),
  },
  {
    id: "german-line",
    title: "德国线索",
    description: "Krautrock、synth-pop、Berlin techno 与欧洲电子身份。",
    match: (film) => hasAny(film.regions, ["德国", "欧洲"]) || /Germany|Krautrock|Synth/i.test(film.section || ""),
  },
  {
    id: "black-electronic",
    title: "黑人音乐与电子舞曲",
    description: "Dub、disco、house、Detroit techno 和采样文化。",
    match: (film) =>
      hasAny(film.genres, ["dub", "disco", "house", "techno", "hip-hop"]) ||
      hasAny(film.themes, ["黑人电子音乐", "采样版权"]),
  },
  {
    id: "women-pioneers",
    title: "女性先锋",
    description: "Radiophonic Workshop、声音实验、合成器和被遮蔽的作者谱系。",
    match: (film) => hasAny(film.themes, ["女性先锋", "技术与性别"]),
  },
];

const state = {
  films: [],
  filtered: [],
  route: "",
  search: "",
  grade: "all",
  theme: "all",
  region: "all",
  watch: "all",
  sort: "year-asc",
};

const els = {
  statCount: document.querySelector("#stat-count"),
  statCore: document.querySelector("#stat-core"),
  statFree: document.querySelector("#stat-free"),
  statSources: document.querySelector("#stat-sources"),
  routeGrid: document.querySelector("#route-grid"),
  filmGrid: document.querySelector("#film-grid"),
  resultCount: document.querySelector("#result-count"),
  searchInput: document.querySelector("#search-input"),
  gradeFilter: document.querySelector("#grade-filter"),
  themeFilter: document.querySelector("#theme-filter"),
  regionFilter: document.querySelector("#region-filter"),
  watchFilter: document.querySelector("#watch-filter"),
  sortFilter: document.querySelector("#sort-filter"),
  resetFilters: document.querySelector("#reset-filters"),
  dialog: document.querySelector("#film-dialog"),
  dialogContent: document.querySelector("#dialog-content"),
  dialogClose: document.querySelector(".dialog-close"),
  watchNow: document.querySelector("[data-watch-now]"),
};

init();

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.films = await response.json();
    state.filtered = [...state.films];
    hydrateStats();
    hydrateFilters();
    renderRoutes();
    bindEvents();
    applyFilters();
  } catch (error) {
    els.filmGrid.innerHTML = `<div class="empty-state">无法加载片库数据：${escapeHtml(error.message)}</div>`;
    els.resultCount.textContent = "数据加载失败";
  }
}

function bindEvents() {
  els.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim();
    state.route = "";
    applyFilters();
  });
  els.gradeFilter.addEventListener("change", (event) => {
    state.grade = event.target.value;
    state.route = "";
    applyFilters();
  });
  els.themeFilter.addEventListener("change", (event) => {
    state.theme = event.target.value;
    state.route = "";
    applyFilters();
  });
  els.regionFilter.addEventListener("change", (event) => {
    state.region = event.target.value;
    state.route = "";
    applyFilters();
  });
  els.watchFilter.addEventListener("change", (event) => {
    state.watch = event.target.value;
    state.route = "";
    applyFilters();
  });
  els.sortFilter.addEventListener("change", (event) => {
    state.sort = event.target.value;
    applyFilters();
  });
  els.resetFilters.addEventListener("click", resetFilters);
  els.watchNow.addEventListener("click", () => {
    state.watch = "has-watch";
    state.route = "";
    els.watchFilter.value = "has-watch";
    document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
    applyFilters();
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

function hydrateFilters() {
  setOptions(els.gradeFilter, ["all", ...unique(state.films.map((film) => film.grade_code))], "全部等级", "等级 ");
  setOptions(els.themeFilter, ["all", ...unique(flat(state.films.map((film) => film.themes)))], "全部主题");
  setOptions(els.regionFilter, ["all", ...unique(flat(state.films.map((film) => film.regions)))], "全部地区");
  setOptions(
    els.watchFilter,
    ["all", "has-watch", "free", "library", "subscription", "rental", "purchase", "event_only", "unknown"],
    "全部状态",
    "",
    {
      "has-watch": "有观看渠道",
      free: "含免费线索",
      library: "图书馆 / 教育",
      subscription: "订阅",
      rental: "租赁",
      purchase: "购买",
      event_only: "机构 / 活动",
      unknown: "未确认",
    }
  );
}

function renderRoutes() {
  els.routeGrid.innerHTML = routes
    .map((route, index) => {
      const count = state.films.filter(route.match).length;
      return `
        <button class="route-card" type="button" data-route="${route.id}">
          <small>${String(index + 1).padStart(2, "0")} / ${count} films</small>
          <span>
            <strong>${escapeHtml(route.title)}</strong>
            <span>${escapeHtml(route.description)}</span>
          </span>
        </button>
      `;
    })
    .join("");

  els.routeGrid.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      resetFilters(false);
      state.route = button.dataset.route;
      document.querySelector("#library").scrollIntoView({ behavior: "smooth" });
      applyFilters();
    });
  });
}

function applyFilters() {
  const route = routes.find((item) => item.id === state.route);
  const query = state.search.toLowerCase();
  let films = state.films.filter((film) => {
    if (route && !route.match(film)) return false;
    if (state.grade !== "all" && film.grade_code !== state.grade) return false;
    if (state.theme !== "all" && !film.themes?.includes(state.theme)) return false;
    if (state.region !== "all" && !film.regions?.includes(state.region)) return false;
    if (!matchesWatch(film, state.watch)) return false;
    if (!query) return true;
    return searchableText(film).includes(query);
  });

  films = sortFilms(films, state.sort);
  state.filtered = films;
  renderFilms();
}

function renderFilms() {
  els.resultCount.textContent = `${state.filtered.length} / ${state.films.length} 部影片`;
  if (!state.filtered.length) {
    els.filmGrid.innerHTML = `<div class="empty-state">没有匹配的片目。可以重置筛选，或换一个主题入口。</div>`;
    return;
  }

  els.filmGrid.innerHTML = state.filtered
    .map((film) => {
      const poster = posterPath(film);
      const tags = [...(film.themes || []), ...(film.regions || [])].slice(0, 4);
      return `
        <article class="film-card">
          <div class="poster-wrap">
            ${poster ? `<img src="${poster}" alt="${escapeHtml(film.poster?.alt || film.title)}" loading="lazy" />` : fallbackPoster()}
            <span class="grade-badge">${escapeHtml(film.grade_code || "")}</span>
            <span class="watch-badge">${escapeHtml(watchLabel(film))}</span>
          </div>
          <div class="card-body">
            <div class="card-kicker">${escapeHtml(film.year || "")} / ${escapeHtml(film.section || "")}</div>
            <h3 class="film-title">${escapeHtml(film.title || "")}</h3>
            <div class="original-title">${escapeHtml(film.original_title || "")}</div>
            <div class="meta-line">${escapeHtml((film.directors || []).join(" / "))}</div>
            <div class="tag-row">${tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
            <div class="card-actions">
              <button type="button" data-film="${escapeHtml(film.id)}">查看详情</button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");

  els.filmGrid.querySelectorAll("[data-film]").forEach((button) => {
    button.addEventListener("click", () => openFilm(button.dataset.film));
  });
}

function openFilm(id) {
  const film = state.films.find((item) => item.id === id);
  if (!film) return;
  const poster = posterPath(film);
  els.dialogContent.innerHTML = `
    <div class="dialog-layout">
      <aside class="dialog-poster">
        ${poster ? `<img src="${poster}" alt="${escapeHtml(film.poster?.alt || film.title)}" />` : fallbackPoster()}
      </aside>
      <div class="dialog-main">
        <p class="eyebrow">${escapeHtml(film.grade || "")} / ${escapeHtml(film.section || "")}</p>
        <h2 id="dialog-title">${escapeHtml(film.title || "")}</h2>
        <p class="original-title">${escapeHtml(film.original_title || "")}</p>
        <p class="meta-line">${escapeHtml(film.year || "")} · ${escapeHtml(film.runtime || "")} · ${escapeHtml((film.directors || []).join(" / "))}</p>
        <div class="tag-row">${[...(film.themes || []), ...(film.genres || []), ...(film.regions || [])]
          .slice(0, 10)
          .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
          .join("")}</div>

        <section class="dialog-section">
          <h3>简介</h3>
          <p>${escapeHtml(film.summary || "暂无简介。")}</p>
        </section>

        <section class="dialog-section">
          <h3>核心论点</h3>
          <p>${escapeHtml(film.core_argument || "待补充。")}</p>
        </section>

        <section class="dialog-section">
          <h3>观看渠道</h3>
          <ul class="watch-list">${renderWatchChannels(film)}</ul>
        </section>

        <section class="dialog-section">
          <h3>来源</h3>
          <ul class="source-list">${renderSources(film)}</ul>
        </section>
      </div>
    </div>
  `;
  els.dialog.showModal();
}

function renderWatchChannels(film) {
  return (film.watch_channels || [])
    .map((channel) => {
      const label = `${channel.access_type || "unknown"} / ${channel.reliability || "uncertain"} / ${channel.public_screening || "unknown"}`;
      const title = escapeHtml(channel.platform || "未命名渠道");
      const note = channel.note ? `<div class="meta-line">${escapeHtml(channel.note)}</div>` : "";
      const body = channel.url ? `<a href="${escapeAttribute(channel.url)}" target="_blank" rel="noreferrer">${title}</a>` : `<strong>${title}</strong>`;
      return `<li>${body}<div class="meta-line">${escapeHtml(label)}</div>${note}</li>`;
    })
    .join("");
}

function renderSources(film) {
  return (film.sources || [])
    .map((source) => {
      const label = `${source.type || "source"} / ${source.reliability || "uncertain"}`;
      return `
        <li>
          <a href="${escapeAttribute(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title || source.url)}</a>
          <div class="meta-line">${escapeHtml(label)}</div>
        </li>
      `;
    })
    .join("");
}

function matchesWatch(film, watch) {
  if (watch === "all") return true;
  const channels = film.watch_channels || [];
  if (watch === "has-watch") return channels.length > 0;
  return channels.some((channel) => channel.access_type === watch);
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

function watchLabel(film) {
  const channels = film.watch_channels || [];
  if (channels.some((channel) => channel.access_type === "free")) return "FREE?";
  if (channels.some((channel) => channel.access_type === "library")) return "LIB";
  if (channels.some((channel) => ["subscription", "rental", "purchase"].includes(channel.access_type))) return "VOD";
  if (channels.some((channel) => channel.access_type === "event_only")) return "AUTH";
  return "CHECK";
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
  state.grade = "all";
  state.theme = "all";
  state.region = "all";
  state.watch = "all";
  state.sort = "year-asc";
  state.route = "";
  els.searchInput.value = "";
  els.gradeFilter.value = "all";
  els.themeFilter.value = "all";
  els.regionFilter.value = "all";
  els.watchFilter.value = "all";
  els.sortFilter.value = "year-asc";
  if (render) applyFilters();
}

function setOptions(select, values, allLabel, prefix = "", labels = {}) {
  select.innerHTML = values
    .map((value) => {
      const label = value === "all" ? allLabel : labels[value] || `${prefix}${value}`;
      return `<option value="${escapeAttribute(value)}">${escapeHtml(label)}</option>`;
    })
    .join("");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function flat(values) {
  return values.flatMap((value) => value || []);
}

function hasAny(values = [], targets = []) {
  return values.some((value) => targets.includes(value));
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
