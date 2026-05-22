# 电子音乐纪录片地图 / Electronic Music Documentary Atlas

面向中文读者的电子音乐纪录片策展网站。默认中文界面，可切换英文；以封面墙、观看路线、标签、发行年份和观看渠道来浏览影片。

A curated static site for electronic music documentaries. Chinese is the default UI, with an English toggle for the interface.

## 在线预览 / Live

- GitHub Pages: https://electro-dig.github.io/electronic-music-documentary-atlas/
- Netlify: https://emda-documentary-atlas.netlify.app/

## 内容 / Content

- 空间封面墙 / Spatial film wall
- 纪录片片库 / Documentary library
- 观看路线 / Curated viewing paths
- 发行年份索引 / Release-year index
- 观看渠道与来源记录 / Watch links and source notes
- Three.js 实验室 / Three.js lab

## 本地预览 / Local Preview

```powershell
cd D:\Codex\electronic-music-documentary-atlas
python -m http.server 4181 --bind 127.0.0.1
```

打开 / Open:

```text
http://127.0.0.1:4181/
```

## 数据 / Data

主数据文件是 `data/documentaries.json`。片单仍在继续核验与更新。

Main data lives in `data/documentaries.json`. Film metadata and watch links are still being verified and refined.

整理 / Curated by: `@电子音乐考古小分队`

## 测试 / Tests

```powershell
node --test tests\*.test.mjs
```
