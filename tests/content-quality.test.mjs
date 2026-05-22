import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const documentaries = JSON.parse(await readFile(resolve(projectRoot, "data", "documentaries.json"), "utf8"));

const verifiedBatchIds = [
  "theremin-electronic-odyssey-1993",
  "modulations-cinema-for-the-ear-1998",
  "the-alchemists-of-sound-2003",
  "high-tech-soul-the-creation-of-techno-music-2006",
  "copyright-criminals-2009",
  "moog-2004",
  "what-the-future-sounded-like-2007",
  "i-dream-of-wires-2014",
  "808-2015",
  "tones-drones-and-arpeggios-2018",
  "pump-up-the-volume-a-history-of-house-music-2001",
  "maestro-2003",
  "dub-echoes-2008",
  "bassweight-a-dubstep-documentary-2010",
  "never-stop-a-music-that-resists-2017",
  "can-you-feel-it-how-dance-music-conquered-the-world-2018",
  "everybody-in-the-place-2018",
  "synth-britannia-2009",
  "krautrock-the-rebirth-of-germany-2009",
  "the-sound-of-belgium-2012",
  "if-i-think-of-germany-at-night-2017",
  "the-delian-mode-2009",
  "a-life-in-waves-2017",
  "sisters-with-transistors-2020",
];

const newlyAddedCandidateIds = [
  "the-rise-of-the-synths-2019",
  "break-the-wall-2019",
  "sound-of-berlin-2018",
  "the-untold-history-of-disco-2022",
];

function byId(id) {
  const film = documentaries.find((item) => item.id === id);
  assert.ok(film, `missing film ${id}`);
  return film;
}

const userSuppliedWatchChannels = [
  {
    id: "modulations-cinema-for-the-ear-1998",
    platform: "Xiaohongshu",
    url: "https://www.xiaohongshu.com/explore/67beb27e000000000d016622",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "my_upload",
    display_label: "我的字幕",
  },
  {
    id: "theremin-electronic-odyssey-1993",
    platform: "Xiaohongshu",
    url: "https://www.xiaohongshu.com/explore/67efb117000000001c00df09",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "my_upload",
    display_label: "我的字幕",
  },
  {
    id: "krautrock-the-rebirth-of-germany-2009",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1GA411B72X/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
  {
    id: "tones-drones-and-arpeggios-2018",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1aW411s7NY/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "my_upload",
    display_label: "我的字幕",
  },
  {
    id: "sisters-with-transistors-2020",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1ks4y1A721/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
  {
    id: "moog-2004",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1Nh411k7YC/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
  {
    id: "high-tech-soul-the-creation-of-techno-music-2006",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV15mLpzCEcU/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "no_sub",
    source_kind: "raw_upload",
    display_label: "生肉",
  },
  {
    id: "dub-echoes-2008",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1F841137BB/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
  {
    id: "synth-britannia-2009",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1Jx411F7gG/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "no_sub",
    source_kind: "raw_upload",
    display_label: "生肉",
  },
  {
    id: "the-delian-mode-2009",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1RW411B7w2/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "no_sub",
    source_kind: "raw_upload",
    display_label: "生肉",
  },
  {
    id: "copyright-criminals-2009",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1sp4y1674K/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "no_sub",
    source_kind: "raw_upload",
    display_label: "生肉",
  },
  {
    id: "bassweight-a-dubstep-documentary-2010",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1yuAfzwE7k/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
  {
    id: "i-dream-of-wires-2014",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1Pi4y1K7ZZ/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
  {
    id: "808-2015",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV1zb411j7pj/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "no_sub",
    source_kind: "raw_upload",
    display_label: "生肉",
  },
  {
    id: "a-life-in-waves-2017",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=YOhSRBGq70Y",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "no_sub",
    source_kind: "raw_upload",
    display_label: "YouTube/生肉",
  },
  {
    id: "can-you-feel-it-how-dance-music-conquered-the-world-2018",
    platform: "YouTube",
    url: "https://www.youtube.com/watch?v=9Rah1F1zq1k&list=PLQnhjB-di_YYOQ5MQX-nfXpjHbyUhios4",
    access_type: "free",
    reliability: "secondary",
    subtitle: "no_sub",
    source_kind: "playlist_partial",
    display_label: "YouTube/系列线索",
  },
  {
    id: "everybody-in-the-place-2018",
    platform: "Bilibili",
    url: "https://www.bilibili.com/video/BV18J411K7fV/",
    access_type: "free",
    reliability: "user_upload",
    subtitle: "zh_sub",
    source_kind: "fan_sub",
    display_label: "中文字幕",
  },
];

test("verified content batches use complete public summaries", () => {
  for (const id of verifiedBatchIds) {
    const film = byId(id);
    const length = [...film.summary].length;

    assert.ok(length >= 120, `${id} summary is too short: ${length}`);
    assert.ok(length <= 180, `${id} summary is too long: ${length}`);
    assert.doesNotMatch(film.summary, /待核验|待拆分|截图|正文/);
  }
});

test("verified content batches have no placeholder watch channels or notes", () => {
  for (const id of verifiedBatchIds) {
    const film = byId(id);

    for (const channel of film.watch_channels || []) {
      assert.notEqual(channel.platform, "正文观看渠道待拆分", `${id} still has placeholder channel`);
      assert.equal(channel.note, undefined, `${id} watch channel still exposes internal notes`);
      assert.ok(["free", "library", "subscription", "rental", "purchase", "event_only", "unknown"].includes(channel.access_type));
      assert.ok(["platform", "institution", "official", "secondary", "uncertain", "distributor", "user_upload"].includes(channel.reliability));
      assert.ok(
        ["permission_required", "allowed", "unknown"].includes(channel.public_screening),
        `${id} exposes unsupported public_screening: ${channel.public_screening}`,
      );
    }
  }
});

test("user supplied watch channels expose display-ready source metadata", () => {
  const platforms = new Set();

  for (const expected of userSuppliedWatchChannels) {
    const film = byId(expected.id);
    const channel = (film.watch_channels || []).find((candidate) => candidate.url === expected.url);

    assert.ok(channel, `${expected.id} is missing watch channel ${expected.url}`);
    platforms.add(channel.platform);
    assert.equal(channel.note, undefined, `${expected.id} watch channel should not expose internal notes`);

    for (const key of ["platform", "access_type", "reliability", "subtitle", "source_kind", "display_label"]) {
      assert.equal(channel[key], expected[key], `${expected.id} ${key}`);
    }

    assert.equal(channel.public_screening, "permission_required", `${expected.id} public_screening`);
  }

  for (const platform of ["Bilibili", "Xiaohongshu", "YouTube"]) {
    assert.ok(platforms.has(platform), `missing representative ${platform} channel`);
  }
});

test("copyright criminals does not advertise unavailable Plex viewing", () => {
  const film = byId("copyright-criminals-2009");
  const plexFree = (film.watch_channels || []).find(
    (channel) => /plex/i.test(channel.platform || channel.url || "") && channel.access_type === "free"
  );

  assert.equal(plexFree, undefined);
});

test("new important films are recorded as main library entries with YouTube-supplemented sources", () => {
  for (const id of newlyAddedCandidateIds) {
    const film = byId(id);

    assert.equal(film.grade_code, "A", `${id} should be promoted to an important film`);
    assert.equal(film.site_visibility, "core", `${id} should enter the main library`);
    assert.ok((film.summary || "").length >= 80, `${id} needs a useful public summary`);
    assert.doesNotMatch(JSON.stringify(film), /\?{3,}/, `${id} contains replacement-character placeholders`);
    assert.ok((film.sources || []).some((source) => /youtube\.com/.test(source.url || "")), `${id} needs YouTube source evidence`);
    assert.ok((film.watch_channels || []).some((channel) => channel.url), `${id} needs at least one watch channel`);
  }

  assert.ok(
    byId("sound-of-berlin-2018").watch_channels.some(
      (channel) => channel.platform === "YouTube" && channel.access_type === "free" && channel.reliability === "official"
    )
  );
  assert.ok(
    byId("break-the-wall-2019").watch_channels.some(
      (channel) => channel.platform === "YouTube" && channel.url === "https://www.youtube.com/watch?v=SRRRvLnIrxo"
    )
  );
});
