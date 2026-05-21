# 电子音乐纪录片地图

第一版静态网站原型。它直接使用 Obsidian 片单导出的 `data/documentaries.json` 渲染 A 类电子音乐纪录片片库。

## 当前范围

- 首页概览
- 6 条观看路线
- A 类片库网格
- 搜索、等级、主题、地区、观看状态、排序筛选
- 单片详情弹窗：简介、核心论点、观看渠道、来源
- 本地封面图

## 本地预览

```powershell
cd D:\Codex\electronic-music-documentary-atlas
python -m http.server 4181 --bind 127.0.0.1
```

然后打开：

```text
http://127.0.0.1:4181/
```

## 数据来源

当前数据来自：

```text
C:\Users\yunlo\OneDrive\Obsidian\Rosebud\400-music\401-电子音乐考古小分队\纪录片整理\data\documentaries.json
```

本目录内的 `data/documentaries.json` 是一份复制快照。之后如果 Obsidian 片卡继续更新，需要重新导出并复制到这里。
