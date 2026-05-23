# 策展型资料网站工作流与 Skill 化评估

日期：2026-05-24

## 1. 是否适合沉淀为工作流或 skill

适合，但建议分两层沉淀：

1. 工作流文档：先作为可复用流程，用于下一次类似项目。
2. Skill：等流程再经过 1-2 个项目验证后，整理为正式 Codex skill。

原因是这个项目包含事实核验、策展判断、视觉研究、前端开发、测试和部署，跨度较大。如果直接写成一个“大而全”的 skill，容易触发范围过宽、执行含糊、产出质量不稳定的问题。更好的做法是把它拆成一个主工作流 skill，再挂若干子流程。

## 2. 推荐工作流名称

推荐名称：

`curated-media-atlas`

中文名：

`策展型媒体档案网站工作流`

适用对象不局限于电子音乐纪录片，也可以扩展到：

- 电影片单网站。
- 音乐史专题档案。
- 展览资料网站。
- 艺术家、流派、技术谱系整理。
- 从 Obsidian / Markdown / 表格资料转成公开网站的策展项目。

## 3. 触发场景

可以在用户提出以下需求时触发：

- “我整理了一批资料，想做成一个网站。”
- “帮我核验这些片单/作品资料，然后做成策展页面。”
- “把 Obsidian 里的资料转成一个公开展示项目。”
- “我想做一个类似档案馆/展览/知识地图的网站。”
- “这个片单/书单/艺术家资料能不能整理成专业网页？”

## 4. 输入与输出

### 输入

- 原始资料目录：Markdown、Obsidian、CSV、JSON、截图或混合资料。
- 目标受众：研究者、普通读者、粉丝、活动观众、课堂使用等。
- 公开边界：哪些内容能公开，哪些只是内部资料。
- 主题范围：主片单、延伸片目、相关议题的边界。
- 视觉倾向：参考网站、品牌气质、是否需要交互或 3D。
- 发布方式：GitHub Pages、Netlify、Vercel 或本地原型。

### 输出

- 内容核验报告。
- 数据清洗规则。
- 标准化 JSON 数据。
- 视觉案例研究文档。
- 策展路线或分类标准。
- 网页原型或可发布静态网站。
- 测试集。
- README。
- 部署链接。

## 5. 标准流程

### Step 1：资料盘点

目标：先知道手里有什么，不急着开发。

动作：

- 读取用户给出的资料目录。
- 列出文件类型、字段、截图、外链和明显缺口。
- 判断资料是“事实条目”“主观备注”“待核验线索”还是“内部工作记录”。
- 建立候选清单。

产出：

- `docs/source-inventory-YYYY-MM-DD.md`
- 初始候选数据表或 JSON。

### Step 2：范围和收录标准

目标：避免“所有相关内容都进入主片单”。

动作：

- 定义主目录、延伸目录、相关议题。
- 制定收录标准。
- 明确哪些内容不进入主目录。
- 确定公开语言，避免内部代号直接展示。

在本项目中的对应原则：

- `S/A/B` 不直接展示给读者。
- `How Music Got Free` 不进主电子音乐片库。
- 原名优先，中文名只保留成熟译名。

产出：

- `docs/curation-criteria-YYYY-MM-DD.md`

### Step 3：事实核验和来源分级

目标：把“资料看起来像真的”变成“资料可追溯”。

动作：

- 优先查官方、发行方、电视台、电影节、机构、馆藏。
- IMDb、TMDb、Wikipedia 只做辅助。
- 用户上传视频只作为观看线索，不等于授权。
- 每个关键字段保留来源或明确标记 unknown。

来源优先级：

1. 官方和权利方。
2. 电影节、机构、图书馆、公共媒体。
3. 正规平台。
4. 数据库。
5. 用户上传和二级转载。

产出：

- `docs/content-verification-method.md`
- `docs/content-batch-XX.md`
- `docs/watch-channels-YYYY-MM-DD.md`

### Step 4：数据模型整理

目标：让数据既能保留研究信息，又适合公开展示。

建议字段：

- `id`
- `title`
- `original_title`
- `year`
- `runtime`
- `directors`
- `summary`
- `themes`
- `genres`
- `technologies`
- `people`
- `regions`
- `watch_channels`
- `sources`
- `grade_code`
- `collection_visibility`
- `poster`

关键设计：

- 源数据可以保留内部字段。
- 公开展示逻辑放到 presentation layer。
- 不把 UI 文案写死在原始数据里。

产出：

- `data/items.json`
- `assets/presentation-data.js`
- JSON schema 或内容测试。

### Step 5：视觉案例研究

目标：避免在旧界面上反复微调。

动作：

- 找 5-8 个优秀案例。
- 截图保存到 `docs/visual-references/screenshots/`。
- 对比当前项目的问题。
- 提炼可借鉴点和需要避免点。
- 明确页面应该像“档案库”“展览”“地图”“实验室”还是混合结构。

本项目得到的结构：

- 首页：影像展览。
- 路线：策展章节。
- 片库：可靠检索。
- 实验室：关系探索。

产出：

- `docs/visual-reference-research-YYYY-MM-DD.md`

### Step 6：信息架构和交互分层

目标：把资料组织成读者能理解的路径。

推荐层级：

1. 第一屏：视觉入口，不解释太多。
2. 策展路线：给新读者方向。
3. 片库：给认真查找的人。
4. 详情：给每部作品足够上下文。
5. 实验室：给探索型用户。
6. 方法说明：解释标准和来源边界。

关键原则：

- 不让筛选器承担策展叙事。
- 不用自动标签代替人工路线。
- 不把所有信息塞进单张卡片。

产出：

- `docs/superpowers/specs/YYYY-MM-DD-content-display-design.md`
- 页面线框或原型说明。

### Step 7：前端原型

目标：先做可验证原型，而不是一次做完所有视觉野心。

推荐实现顺序：

1. 静态片库和详情弹窗。
2. presentation layer。
3. 首页封面墙。
4. 策展路线区。
5. 发行年份索引。
6. 实验室或 3D 交互。
7. i18n 和移动端。

技术选择：

- 静态站点优先。
- 数据放 JSON。
- 原生 ES modules 足够时不引入框架。
- Three.js 用于明确的空间交互，不用于普通列表。

产出：

- `index.html`
- `assets/*.js`
- `assets/*.css`
- `lab.html` 或实验页面。

### Step 8：测试和防回归

目标：把用户反复强调的原则写成测试。

测试应覆盖：

- 主目录和延伸目录边界。
- 公共文案不出现内部术语。
- 时间轴不推断历史跨度。
- 路线成员不因关键词泛化而重复。
- 标签数量和卡片密度。
- 观看渠道字段完整。
- 详情弹窗不展示内部备注。
- 页面资源和脚本加载。

推荐命令：

```powershell
node --test tests\*.test.mjs
node --check assets\app.js
```

产出：

- `tests/*.test.mjs`

### Step 9：发布

目标：让项目从本地原型变成可访问网站。

动作：

- 写 README。
- 清理 `.gitignore`。
- 加 `.nojekyll`。
- 推送 GitHub。
- 公开仓库。
- 启用 GitHub Pages。
- 部署 Netlify。
- 验证线上链接返回 200。

产出：

- GitHub repo URL。
- GitHub Pages URL。
- Netlify URL。

## 6. 可以沉淀为 Skill 的结构

### Skill 名称草案

`curated-media-atlas`

### Skill 描述草案

Use this skill when the user has a rough collection of cultural, media, film, music, art, or research materials and wants to turn it into a public curated website, archive, atlas, exhibition page, or knowledge map. This skill guides source inventory, factual verification, inclusion criteria, visual reference research, data normalization, public presentation design, interactive prototype planning, tests, and deployment.

### Skill 主流程草案

```markdown
## Workflow

1. Inspect source materials and produce an inventory.
2. Define public scope, inclusion criteria, and exclusion rules.
3. Verify facts and sources by batch.
4. Normalize data and separate source data from presentation data.
5. Research visual and interaction references.
6. Design information architecture and public language.
7. Build or revise the prototype incrementally.
8. Add tests for curation rules and content boundaries.
9. Deploy and record live links.
10. Write a retrospective and update the workflow.
```

### Skill 内部模块

建议拆成以下子模块，而不是一个巨型流程：

- `source-inventory`
- `content-verification`
- `curation-criteria`
- `visual-reference-research`
- `presentation-data-model`
- `frontend-curated-archive`
- `interactive-prototype-review`
- `publish-static-site`
- `retrospective-and-skill-update`

## 7. Skill 需要的配套资源

如果正式创建 skill，建议附带这些模板：

```text
curated-media-atlas/
  SKILL.md
  references/
    source-priority.md
    watch-channel-taxonomy.md
    public-copy-rules.md
    visual-reference-checklist.md
    testing-checklist.md
  templates/
    content-verification-method.md
    visual-reference-research.md
    project-retrospective.md
    README.md
  scripts/
    validate-documentary-json.mjs
    check-watch-links.mjs
    audit-public-copy.mjs
```

脚本优先级：

1. JSON 字段和简介长度检查。
2. URL 可访问性检查。
3. 内部术语扫描。
4. 观看渠道分类检查。
5. 截图生成和页面烟测。

## 8. Skill 测试用例建议

如果进入正式 skill 创建阶段，可以先设计 3 个 eval prompts：

### Eval 1：片单资料转公开片库

输入：一组 Markdown 纪录片笔记和若干待核验链接。

期望输出：

- 资料盘点。
- 收录标准。
- 标准化 JSON 草案。
- 核验待办。

### Eval 2：已有片库网页的公共呈现优化

输入：一个静态片库项目，包含内部等级、过多筛选和详情卡。

期望输出：

- 公共语言替换。
- presentation layer。
- 策展路线。
- 防回归测试。

### Eval 3：视觉参考研究到设计规格

输入：用户给出 2-3 个参考网站和当前页面截图。

期望输出：

- 案例截图目录。
- 对比分析。
- 推荐视觉方向。
- 可执行原型计划。

## 9. Skill 化风险

### 风险一：事实核验不能完全自动化

影片、书籍、艺术资料的事实核验依赖来源判断。Skill 可以规定流程和优先级，但不能保证每个搜索结果都正确。

缓解：

- 强制记录来源优先级。
- 对用户上传、二级来源、未知授权显式标记。
- 把不确定信息写成 `unknown`，不要填补。

### 风险二：视觉设计容易模板化

如果 skill 只给固定版式，会限制项目气质。

缓解：

- 要求先做视觉案例研究。
- 要求提出 2-3 个方向。
- 只把信息架构和质量门槛固化，不固化具体视觉风格。

### 风险三：范围过大

从资料核验到部署包含太多步骤。

缓解：

- Skill 只负责“总工作流和质量门槛”。
- 具体前端、数据清洗、部署可以调用其他技能或工具。
- 每轮只处理一个批次或一个页面层级。

## 10. 推荐下一步

建议先不要马上写正式 skill，而是做一个 beta 版 workflow package：

1. 把本文件作为需求底稿。
2. 再补一份 `templates/content-verification-method.md`。
3. 把现有测试中的公共规则抽象成 checklist。
4. 下一次类似项目先按这套流程走一遍。
5. 如果仍然顺手，再创建 `curated-media-atlas/SKILL.md`。

如果现在就要创建 skill，也可以先做一个轻量版，只覆盖：

- 资料盘点。
- 收录标准。
- 来源核验。
- 视觉案例研究。
- 数据呈现层。
- 测试和发布 checklist。

不要一开始就把 Three.js、具体设计风格或电子音乐专有判断写死进 skill。

