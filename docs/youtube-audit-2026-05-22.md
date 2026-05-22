# YouTube Link Audit - 2026-05-22

Scope: all 29 current documentary records in `data/documentaries.json`.

Method:

1. Search each title on YouTube with `yt-dlp` using exact title + year + `full documentary`.
2. Re-query polluted or ambiguous results with narrower keywords.
3. Classify candidates by title match, duration, uploader/channel identity, and whether the item is a full film, trailer, clip, interview, playlist, or unrelated result.
4. Write only high-confidence full-film links into `watch_channels`. User uploads and copyright-uncertain copies are kept as audit notes unless they are already part of the existing curator-provided channel set.

## Data Changes Made

| Film | YouTube result | Action |
| --- | --- | --- |
| Modulations: Cinema for the Ear | Cultures of Resistance Films full upload, 1:13:39, public: https://www.youtube.com/watch?v=icpDt6aQDww | Added as official YouTube full-film channel. |
| Bassweight: A Dubstep Documentary | GetDarker full upload, 1:01:06, public: https://www.youtube.com/watch?v=YVcX0Oc5j5E | Added as host/official YouTube full-film channel. |
| The Sound of Belgium | Jozef Devillé director's cut, 1:24:52, public: https://www.youtube.com/watch?v=0h721lQrrjk | Added as director-upload YouTube channel. |
| Copyright Criminals | Alphabet Entertainment full movie, 53:21, public: https://www.youtube.com/watch?v=5kN8hugndG8 | Added as secondary YouTube full-film lead. |
| Can You Feel It: How Dance Music Conquered the World | Existing playlist contains available dance docs and hidden copyright-claimed BBC videos. First visible item: https://www.youtube.com/watch?v=9Rah1F1zq1k | Kept, but downgraded from raw full upload to partial YouTube series lead. |

## Existing YouTube Records Confirmed

| Film | Existing link | Status |
| --- | --- | --- |
| A Life in Waves | https://www.youtube.com/watch?v=YOhSRBGq70Y | Public full user upload, not official. Kept as raw YouTube lead. |
| Break_The_Wall | https://www.youtube.com/watch?v=SRRRvLnIrxo | Public full upload on `Break the Wall China`, 1:07:06. Also found alternate Mai Ai Music upload: https://www.youtube.com/watch?v=Nk3yT6ATvx8 |
| Sound of Berlin | https://www.youtube.com/watch?v=BF-fTJolMSM | Public full Embassy One upload, 55 min. Kept as official channel. |
| The Untold History of Disco | https://www.youtube.com/watch?v=q_c2dCO5WLo | Public Polyphonic video essay, 34 min. Kept as official channel. |

## Candidates Found, Not Promoted

| Film | Candidate | Reason not promoted |
| --- | --- | --- |
| Theremin: An Electronic Odyssey | https://www.youtube.com/watch?v=EjNxXwJnwwk | Full-length user upload under generic title `Theremin 1994`; not official. |
| Pump Up the Volume: A History of House Music | https://www.youtube.com/watch?v=QDBpXSMOBiA and other full copies | Channel 4/BBC-era user uploads; keep as leads only, not reliable public channel. |
| Maestro | https://www.youtube.com/watch?v=OO81eHdjXJU | Full user upload; channel authority unclear. |
| Moog | https://www.youtube.com/watch?v=XRg8R-00mjs | Full user upload; not official. |
| High Tech Soul: The Creation of Techno Music | https://www.youtube.com/watch?v=x1KkE6I1wJo | Full user upload; not official. Existing Vimeo/Bilibili channels remain better. |
| What the Future Sounded Like | https://www.youtube.com/watch?v=X86bT56upic | Full short-film upload exists, but current Vimeo/Closer Productions sources are stronger. |
| Dub Echoes | https://www.youtube.com/watch?v=xmQ4jgApKmk | Full user upload; not official. |
| Synth Britannia | https://www.youtube.com/watch?v=1lVljmH0yUw | Full BBC user upload; not official. |
| The Delian Mode | https://www.youtube.com/watch?v=nXnmSgaeGAI | Full short user upload; NFB/Vitheque remain more reliable. |
| Krautrock: The Rebirth of Germany | https://www.youtube.com/watch?v=QP5dOKTB3ng | Full BBC user upload with subtitles; not official. |
| 808 | https://www.youtube.com/watch?v=FF61A9XEb9c | Likely full user upload with Spanish subtitles; not official. |
| If I Think of Germany at Night | https://www.youtube.com/watch?v=mhGmKVJYrQM | Full user upload with Spanish subtitles; not official. |
| Everybody in the Place | https://www.youtube.com/watch?v=Jqc_1NVHE-0 | Full user upload; Frieze/Bilibili remain better recorded channels. |
| Tones, Drones and Arpeggios | https://www.youtube.com/watch?v=Y39kBvT1hFg | Episode 1 user upload; not a complete official series channel. |

## No Reliable Full YouTube Film Found

| Film | Search result |
| --- | --- |
| The Alchemists of Sound | Search is polluted by Fullmetal Alchemist results; no reliable full BBC documentary found. |
| I Dream of Wires | Official trailers and clips found, no reliable full-film YouTube result. |
| Sisters with Transistors | Official trailer/interviews found; one full-audio upload exists but is not a watchable official film upload. |
| The Rise of the Synths | Official trailer/channel materials found, no reliable full-film YouTube upload. |
| Never Stop - A Music That Resists | Trailer/festival clips found, no full film. |
| How Music Got Free | Trailer/review clips found, no full official YouTube film. |

## Follow-Up

- Use `watch_channels` only for concrete watch pages.
- Use a future `youtube_audit` or `candidate_sources` field if we want to expose user-upload leads without implying authorization.
- Re-check YouTube links before public launch, because several user uploads and BBC/Channel 4 copies are unstable and may be removed.
