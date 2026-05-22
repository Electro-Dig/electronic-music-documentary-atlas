# Watch Channels Intake - 2026-05-22

## Existing Films Updated

User-supplied watch channels were written into existing `data/documentaries.json` records with display-ready channel metadata:

- Xiaohongshu personal uploads: `Modulations: Cinema for the Ear`, `Theremin: An Electronic Odyssey`
- Bilibili fan-sub uploads: `Krautrock: The Rebirth of Germany`, `Sisters with Transistors`, `Moog`, `Dub Echoes`, `Bassweight`, `I Dream of Wires`, `Everybody in the Place`
- Bilibili personal subtitle upload: `Tones, Drones and Arpeggios: The Magic of Minimalism`
- Bilibili raw uploads: `High Tech Soul: The Creation of Techno Music`, `Synth Britannia`, `The Delian Mode`, `Copyright Criminals`, `808`
- YouTube raw uploads: `A Life in Waves`, `Can You Feel It: How Dance Music Conquered the World`

All added channels avoid internal `note` fields and include `source_kind` plus `display_label` for frontend display.

## Newly Added Important Records

These four titles have now been added to `data/documentaries.json` as important main-library records after curator review. They use `grade_code: "A"` and `site_visibility: "core"`, so they appear with the main important-film library rather than the extended/related shelves.

The YouTube pass used direct YouTube metadata checks for the current public videos, then the records were cross-linked with the user supplied Bilibili / Xiaohongshu entries. Public screening remains `permission_required`.

YouTube checks recorded:

- `The Rise of the Synths`: official trailer/channel evidence at https://www.youtube.com/watch?v=usnW-CsFVwI
- `Break_The_Wall`: YouTube upload titled `20 Years of China's Electronic Music` at https://www.youtube.com/watch?v=SRRRvLnIrxo
- `Sound of Berlin`: official Embassy One full upload at https://www.youtube.com/watch?v=BF-fTJolMSM and director credits cross-checked against https://www.lozen-films.com/sound-of-berlin-en
- `The Untold History of Disco`: Polyphonic video essay at https://www.youtube.com/watch?v=q_c2dCO5WLo

| Candidate | User link | Proposed placement | Status |
| --- | --- | --- | --- |
| The Rise of The Synths | https://www.bilibili.com/video/BV1XB4y1j7iC/ | main / important | Added as `the-rise-of-the-synths-2019`. Bilibili is the watch channel; YouTube official trailer is kept as source evidence. |
| Break_The_Wall | https://www.bilibili.com/video/BV17g411V714/ | main / important | Added as `break-the-wall-2019`. Bilibili and YouTube both recorded; YouTube title is `20 Years of China's Electronic Music`. |
| Sound of Berlin (2018) | https://www.bilibili.com/video/BV1dt411b7Zp/ | main / important | Added as `sound-of-berlin-2018`. Official Embassy One YouTube upload is recorded as a free channel. |
| The Untold History of Disco | https://www.xiaohongshu.com/explore/67aa05a50000000029015e68 | main / important | Added as `the-untold-history-of-disco-2022`. Promoted into the important library by curator decision despite being closer to video essay format. |
