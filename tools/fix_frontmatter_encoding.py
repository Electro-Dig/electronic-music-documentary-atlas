from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse

import yaml

VAULT_ROOT = Path(
    r"C:\Users\yunlo\OneDrive\Obsidian\Rosebud\400-music\401-电子音乐考古小分队\纪录片整理"
)
CARDS_DIR = VAULT_ROOT / "纪录片卡片"
SITE_ROOT = Path(r"D:\Codex\electronic-music-documentary-atlas")
SITE_DATA = SITE_ROOT / "data" / "documentaries.json"
VAULT_DATA = VAULT_ROOT / "data" / "documentaries.json"

METADATA = {
    "Theremin An Electronic Odyssey.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["乐器史", "技术想象", "电子音乐起源"],
        "genres": ["early electronic"],
        "regions": ["美国", "苏联"],
        "cities": [],
        "technologies": ["theremin"],
        "periods": ["1920s-1940s", "1990s"],
    },
    "The Alchemists of Sound.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["BBC Radiophonic Workshop", "声音实验室", "广播声音"],
        "genres": ["electronic", "radiophonic", "experimental"],
        "regions": ["英国"],
        "cities": ["London"],
        "technologies": ["tape", "oscillator", "radiophonic sound"],
        "periods": ["1950s-1960s", "1970s", "2000s"],
    },
    "What the Future Sounded Like.md": {
        "countries": ["Australia"],
        "languages": ["English"],
        "themes": ["声音实验室", "EMS", "未来声音"],
        "genres": ["electronic", "experimental"],
        "regions": ["英国", "澳大利亚"],
        "cities": ["London"],
        "technologies": ["EMS Synthi", "VCS3", "tape"],
        "periods": ["1960s", "1970s", "2000s"],
    },
    "Sisters with Transistors.md": {
        "countries": [],
        "languages": ["English"],
        "themes": ["女性先锋", "声音实验", "技术与性别"],
        "genres": ["electronic", "experimental"],
        "regions": ["美国", "英国", "法国"],
        "cities": [],
        "technologies": ["theremin", "tape", "synthesizer", "computer music"],
        "periods": ["1950s-1960s", "1970s", "2020s"],
    },
    "The Delian Mode.md": {
        "countries": ["Canada"],
        "languages": ["English"],
        "themes": ["女性先锋", "BBC Radiophonic Workshop", "短片"],
        "genres": ["electronic", "experimental", "radiophonic"],
        "regions": ["英国", "加拿大"],
        "cities": ["London"],
        "technologies": ["tape", "oscillator", "radiophonic sound"],
        "periods": ["1960s", "2000s"],
    },
    "A Life in Waves.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["女性先锋", "合成器", "声音设计"],
        "genres": ["electronic", "new age", "experimental"],
        "regions": ["美国"],
        "cities": [],
        "technologies": ["Buchla synthesizer", "voice synthesis"],
        "periods": ["1970s", "1980s", "2010s"],
    },
    "Moog.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["合成器", "乐器人物", "技术与音乐想象"],
        "genres": ["electronic", "synthesizer music"],
        "regions": ["美国"],
        "cities": [],
        "technologies": ["Moog synthesizer"],
        "periods": ["1960s", "1970s", "2000s"],
    },
    "I Dream of Wires.md": {
        "countries": ["Canada"],
        "languages": ["English"],
        "themes": ["模块合成器", "乐器复兴", "声音实验"],
        "genres": ["modular synth", "electronic", "experimental"],
        "regions": ["北美", "欧洲"],
        "cities": [],
        "technologies": ["modular synthesizer", "Eurorack"],
        "periods": ["1960s", "1970s", "2010s"],
    },
    "808.md": {
        "countries": ["United States", "United Kingdom"],
        "languages": ["English"],
        "themes": ["鼓机", "流行音乐技术", "电子舞曲基础设施"],
        "genres": ["electro", "hip-hop", "dance music"],
        "regions": ["美国", "英国"],
        "cities": [],
        "technologies": ["Roland TR-808"],
        "periods": ["1980s", "2010s"],
    },
    "Krautrock The Rebirth of Germany.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["Krautrock", "战后德国", "摇滚与电子实验"],
        "genres": ["krautrock", "kosmische musik", "electronic"],
        "regions": ["德国", "英国"],
        "cities": ["Cologne", "Düsseldorf", "Berlin"],
        "technologies": ["synthesizer", "studio production"],
        "periods": ["1960s", "1970s", "2000s"],
    },
    "Synth Britannia.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["Synth-pop", "英国流行音乐", "合成器文化"],
        "genres": ["synth-pop", "new wave", "electronic pop"],
        "regions": ["英国"],
        "cities": ["Sheffield", "London"],
        "technologies": ["synthesizer", "drum machine"],
        "periods": ["1970s", "1980s", "2000s"],
    },
    "Modulations Cinema for the Ear.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["电子音乐总览", "声音文化", "实验与舞曲"],
        "genres": ["electronic", "techno", "ambient", "experimental"],
        "regions": ["美国", "欧洲", "英国"],
        "cities": [],
        "technologies": ["synthesizer", "sampler", "computer music"],
        "periods": ["1960s", "1970s", "1980s", "1990s"],
    },
    "Pump Up the Volume A History of House Music.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["House 史", "俱乐部文化", "舞曲传播"],
        "genres": ["house", "disco", "acid house"],
        "regions": ["美国", "英国"],
        "cities": ["Chicago", "New York", "London"],
        "technologies": ["DJ", "drum machine", "sampler"],
        "periods": ["1970s", "1980s", "1990s", "2000s"],
    },
    "Maestro.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["Disco", "House 起源", "纽约俱乐部文化"],
        "genres": ["disco", "house", "garage"],
        "regions": ["美国"],
        "cities": ["New York", "Chicago"],
        "technologies": ["DJ", "sound system"],
        "periods": ["1970s", "1980s", "2000s"],
    },
    "High Tech Soul The Creation of Techno Music.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["Detroit Techno", "黑人电子音乐", "城市工业史"],
        "genres": ["techno", "electro"],
        "regions": ["美国"],
        "cities": ["Detroit"],
        "technologies": ["synthesizer", "drum machine", "sequencer"],
        "periods": ["1980s", "1990s", "2000s"],
    },
    "Never Stop A Music That Resists.md": {
        "countries": ["France"],
        "languages": ["English", "French"],
        "themes": ["Detroit Techno", "抵抗音乐", "黑人电子音乐"],
        "genres": ["techno"],
        "regions": ["美国", "法国"],
        "cities": ["Detroit"],
        "technologies": ["DJ", "synthesizer", "drum machine"],
        "periods": ["1980s", "1990s", "2010s"],
    },
    "If I Think of Germany at Night.md": {
        "countries": ["Germany"],
        "languages": ["German"],
        "themes": ["俱乐部文化", "德国 Techno", "夜晚与社会时间"],
        "genres": ["techno", "minimal techno"],
        "regions": ["德国", "欧洲"],
        "cities": [],
        "technologies": ["DJ", "studio production"],
        "periods": ["2010s"],
    },
    "The Sound of Belgium.md": {
        "countries": ["Belgium"],
        "languages": ["Dutch", "French", "English"],
        "themes": ["Belgian New Beat", "俱乐部文化", "欧洲舞曲"],
        "genres": ["new beat", "electronic body music", "techno", "house"],
        "regions": ["比利时", "欧洲"],
        "cities": ["Brussels", "Ghent", "Antwerp"],
        "technologies": ["DJ", "sampler", "drum machine"],
        "periods": ["1970s", "1980s", "1990s", "2010s"],
    },
    "Everybody in the Place.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["Rave", "英国社会史", "俱乐部文化"],
        "genres": ["rave", "acid house", "house", "techno"],
        "regions": ["英国"],
        "cities": ["London"],
        "technologies": ["DJ", "sampler", "drum machine"],
        "periods": ["1980s", "1990s", "2010s"],
    },
    "Can You Feel It How Dance Music Conquered the World.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["舞曲总览", "俱乐部文化", "全球流行化"],
        "genres": ["house", "techno", "disco", "dance music"],
        "regions": ["英国", "美国", "欧洲"],
        "cities": ["Chicago", "Detroit", "New York", "London"],
        "technologies": ["DJ", "drum machine", "sampler"],
        "periods": ["1970s", "1980s", "1990s", "2010s"],
    },
    "Tones Drones and Arpeggios.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["Minimalism", "当代作曲", "重复与电子音乐"],
        "genres": ["minimalism", "contemporary classical", "electronic"],
        "regions": ["美国", "英国"],
        "cities": [],
        "technologies": ["tape", "arpeggiator", "synthesizer"],
        "periods": ["1960s", "1970s", "2010s"],
    },
    "Dub Echoes.md": {
        "countries": ["Brazil"],
        "languages": ["English", "Portuguese"],
        "themes": ["Dub", "声音系统", "混音文化"],
        "genres": ["dub", "reggae", "electronic"],
        "regions": ["牙买加", "巴西", "英国"],
        "cities": ["Kingston"],
        "technologies": ["mixing desk", "echo", "delay", "sound system"],
        "periods": ["1970s", "1980s", "2000s"],
    },
    "Bassweight A Dubstep Documentary.md": {
        "countries": ["United Kingdom"],
        "languages": ["English"],
        "themes": ["俱乐部文化", "低频文化", "英国地下音乐"],
        "genres": ["dubstep", "bass music"],
        "regions": ["英国"],
        "cities": ["London", "Croydon", "Bristol"],
        "technologies": ["sound system", "sub-bass"],
        "periods": ["2000s", "2010s"],
    },
    "How Music Got Free.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["数字发行", "MP3", "音乐产业"],
        "genres": ["music industry"],
        "regions": ["美国"],
        "cities": [],
        "technologies": ["MP3", "file sharing", "internet distribution"],
        "periods": ["1990s", "2000s", "2020s"],
    },
    "Copyright Criminals.md": {
        "countries": ["United States"],
        "languages": ["English"],
        "themes": ["采样版权", "音乐产业", "法律与技术"],
        "genres": ["hip-hop", "sample-based music", "electronic"],
        "regions": ["美国"],
        "cities": [],
        "technologies": ["sampler", "sampling"],
        "periods": ["1980s", "1990s", "2000s"],
    },
}

PREFERRED_KEYS = [
    "title",
    "id",
    "original_title",
    "aliases",
    "type",
    "status",
    "site_visibility",
    "priority",
    "grade",
    "grade_code",
    "year",
    "sort_year",
    "runtime",
    "runtime_minutes",
    "director",
    "directors",
    "countries",
    "languages",
    "section",
    "themes",
    "genres",
    "regions",
    "cities",
    "people",
    "labels",
    "technologies",
    "periods",
    "subtitle_status",
    "public_screening",
    "poster",
    "watch_channels",
    "sources",
    "tags",
]

SOURCE_RULES = [
    ("idfa.nl", "festival", "institution"),
    ("goethe.de", "institution", "institution"),
    ("filmportal.de", "database", "institution"),
    ("viennale.at", "festival", "institution"),
    ("nfb.ca", "institution", "institution"),
    ("vitheque.com", "platform", "institution"),
    ("qagoma.qld.gov.au", "institution", "institution"),
    ("kviff.com", "festival", "institution"),
    ("offscreen.be", "festival", "institution"),
    ("film-documentaire.fr", "database", "institution"),
    ("contemporaryartsociety.org", "institution", "institution"),
    ("afi.com", "database", "institution"),
    ("bbc.co.uk", "institution", "institution"),
    ("radio-lists.org.uk", "database", "secondary"),
    ("imdb.com", "database", "secondary"),
    ("wikipedia.org", "wiki", "secondary"),
    ("rottentomatoes.com", "database", "secondary"),
    ("moviefone.com", "database", "secondary"),
    ("themoviedb.org", "database", "secondary"),
    ("letterboxd.com", "database", "secondary"),
    ("tvguide.com", "database", "secondary"),
    ("justwatch.com", "platform", "secondary"),
    ("plex.tv", "platform", "platform"),
    ("tubitv.com", "platform", "platform"),
    ("paramountplus.com", "platform", "platform"),
    ("disneyplus.com", "platform", "platform"),
    ("apple.com", "platform", "platform"),
    ("vimeo.com", "platform", "platform"),
    ("bilibili.com", "user_upload", "user_upload"),
    ("youtube.com", "user_upload", "user_upload"),
    ("andanafilms.com", "distributor", "distributor"),
    ("monoduo.net", "distributor", "distributor"),
]


def domain_for(url: str) -> str:
    return urlparse(url).netloc.lower().removeprefix("www.") if url else ""


def source_class(url: str) -> tuple[str, str]:
    domain = domain_for(url)
    for needle, source_type, reliability in SOURCE_RULES:
        if needle in domain:
            return source_type, reliability
    return "source", "uncertain"


def source_title(label: str, url: str) -> str:
    label = label.strip()
    return domain_for(url) if label.startswith("http") or not label else label


def watch_from_url(url: str) -> dict | None:
    domain = domain_for(url)

    def item(
        platform: str,
        access_type: str,
        reliability: str,
        public_screening: str,
        region: str = "unknown",
        subtitle: str = "unknown",
        note: str = "",
    ) -> dict:
        data = {
            "platform": platform,
            "url": url,
            "access_type": access_type,
            "reliability": reliability,
            "region": region,
            "subtitle": subtitle,
            "public_screening": public_screening,
        }
        if note:
            data["note"] = note
        return data

    if "bilibili.com" in domain:
        return item("Bilibili", "free", "user_upload", "not_recommended", "China", note="用户上传或搬运线索，不作为公开放映依据。")
    if "youtube.com" in domain or "youtu.be" in domain:
        return item("YouTube", "free", "user_upload", "not_recommended", note="需确认是否为官方上传；默认不作为公开放映依据。")
    if "vimeo.com" in domain:
        return item("Vimeo", "free", "platform", "permission_required", note="公开视频线索；公开放映仍需确认片方或上传方授权。")
    if "tubitv.com" in domain:
        return item("Tubi", "free", "platform", "permission_required")
    if "plex.tv" in domain:
        return item("Plex", "free", "platform", "permission_required")
    if "paramountplus.com" in domain:
        return item("Paramount+", "subscription", "platform", "permission_required")
    if "disneyplus.com" in domain:
        return item("Disney+", "subscription", "platform", "permission_required")
    if "apple.com" in domain:
        return item("Apple TV", "rental", "platform", "permission_required")
    if "watch.tsob.be" in domain:
        return item("The Sound of Belgium official watch page", "rental", "official", "permission_required")
    if "frieze.com" in domain:
        return item("Frieze", "free", "institution", "permission_required")
    if "getdarker.com" in domain:
        return item("GetDarker", "free", "secondary", "private_research_only", note="可看线索，公开使用前需另核授权。")
    if "dubechoes.com" in domain:
        return item("Dub Echoes official site", "unknown", "official", "permission_required")
    if "monoduo.net" in domain:
        return item("MonoDuo shop", "purchase", "distributor", "permission_required")
    if "andanafilms.com" in domain:
        return item("AndanaFilms", "event_only", "distributor", "permission_required")
    if "goethe.de" in domain:
        return item("Goethe-Institut film catalogue", "event_only", "institution", "permission_required")
    if "collection.nfb.ca" in domain:
        return item("NFB collection", "event_only", "institution", "permission_required")
    if "vitheque.com" in domain:
        return item("Vithèque", "unknown", "institution", "permission_required")
    if "closerproductions.com.au" in domain:
        return item("Closer Productions", "unknown", "official", "permission_required")
    return None


def extract_section(body: str, heading: str) -> str:
    pattern = re.compile(rf"^##\s+{re.escape(heading)}\s*(.*?)(?=^##\s+|\Z)", re.M | re.S)
    match = pattern.search(body)
    return match.group(1).strip() if match else ""


def plain(text: str) -> str:
    text = re.sub(r"!\[\[[^\]]+\]\]", "", text)
    text = re.sub(r"\[([^\]]+)\]\(([^\)]+)\)", r"\1", text)
    text = re.sub(r"\*([^*]+)\*", r"\1", text)
    return " ".join(text.split())


def rebuild_sources(body: str) -> list[dict]:
    sources = []
    for label, url in re.findall(r"- \[(.*?)\]\((.*?)\)", body):
        if not url.startswith("http"):
            continue
        source_type, reliability = source_class(url)
        sources.append(
            {
                "title": source_title(label, url),
                "url": url,
                "type": source_type,
                "reliability": reliability,
            }
        )
    return sources


def rebuild_watch_channels(sources: list[dict]) -> list[dict]:
    channels = []
    seen = set()
    for source in sources:
        channel = watch_from_url(source["url"])
        if not channel:
            continue
        key = (channel["platform"], channel.get("url"))
        if key in seen:
            continue
        channels.append(channel)
        seen.add(key)
    if channels:
        return channels
    return [
        {
            "platform": "正文观看渠道待拆分",
            "access_type": "unknown",
            "reliability": "uncertain",
            "region": "unknown",
            "subtitle": "unknown",
            "public_screening": "permission_required",
            "note": "现有卡片正文记录了观看线索，但尚未拆分成平台级结构。",
        }
    ]


def ordered_frontmatter(data: dict) -> dict:
    ordered = {}
    for key in PREFERRED_KEYS:
        if key in data:
            ordered[key] = data[key]
    for key, value in data.items():
        if key not in ordered:
            ordered[key] = value
    return ordered


def update_cards() -> None:
    for path in sorted(CARDS_DIR.glob("*.md")):
        if path.name.startswith("00-") or path.name not in METADATA:
            continue
        raw = path.read_text(encoding="utf-8")
        has_bom = raw.startswith("\ufeff")
        text = raw.lstrip("\ufeff")
        _, frontmatter, body = text.split("---", 2)
        data = yaml.safe_load(frontmatter) or {}
        data.update(METADATA[path.name])
        sources = rebuild_sources(body)
        data["sources"] = sources
        data["watch_channels"] = rebuild_watch_channels(sources)
        data["poster"] = data.get("poster") or {}
        data["poster"]["rights_status"] = "needs_review"
        data["poster"]["source"] = data["poster"].get("source") or "local_or_unknown"
        data["poster"]["alt"] = f"Poster for {data.get('original_title') or path.stem}"
        dumped = yaml.safe_dump(ordered_frontmatter(data), allow_unicode=True, sort_keys=False, width=1000).strip()
        path.write_text(("\ufeff" if has_bom else "") + "---\n" + dumped + "\n---" + body, encoding="utf-8")


def export_json() -> None:
    items = []
    for path in sorted(CARDS_DIR.glob("*.md")):
        if path.name.startswith("00-"):
            continue
        raw = path.read_text(encoding="utf-8").lstrip("\ufeff")
        _, frontmatter, body = raw.split("---", 2)
        data = yaml.safe_load(frontmatter) or {}
        if data.get("type") != "documentary-card":
            continue
        item = {
            key: data.get(key)
            for key in [
                "id",
                "title",
                "original_title",
                "aliases",
                "year",
                "sort_year",
                "runtime",
                "runtime_minutes",
                "directors",
                "countries",
                "languages",
                "grade",
                "grade_code",
                "section",
                "site_visibility",
                "themes",
                "genres",
                "regions",
                "cities",
                "people",
                "labels",
                "technologies",
                "periods",
                "subtitle_status",
                "public_screening",
                "poster",
                "watch_channels",
                "sources",
            ]
        }
        item["summary"] = plain(extract_section(body, "简介"))
        item["core_argument"] = plain(extract_section(body, "核心论点"))
        item["note_path"] = str(path.relative_to(VAULT_ROOT)).replace("\\", "/")
        items.append(item)
    items.sort(key=lambda item: (item.get("sort_year") or 9999, item.get("title") or ""))
    payload = json.dumps(items, ensure_ascii=False, indent=2)
    SITE_DATA.write_text(payload, encoding="utf-8")
    VAULT_DATA.parent.mkdir(exist_ok=True)
    VAULT_DATA.write_text(payload, encoding="utf-8")


if __name__ == "__main__":
    update_cards()
    export_json()
    print(f"updated_cards={len(METADATA)}")
    print(f"exported={SITE_DATA}")
    print(f"exported={VAULT_DATA}")
