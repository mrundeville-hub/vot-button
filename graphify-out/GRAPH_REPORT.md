# Graph Report - vot-button  (2026-08-27)

## Corpus Check
- 12 files · ~9,651 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 124 nodes · 157 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c19fabde`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]

## God Nodes (most connected - your core abstractions)
1. `getCaptionBaseUrl()` - 10 edges
2. `ensureSubtitles()` - 10 edges
3. `VOT Button — Voice Over Translation` - 8 edges
4. `injectBar()` - 7 edges
5. `log()` - 6 edges
6. `startTranslate()` - 6 edges
7. `tickSubs()` - 5 edges
8. `init()` - 5 edges
9. `scripts` - 4 edges
10. `saveSetting()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `ensureSubtitles()` --calls--> `log()`  [EXTRACTED]
  src/content.js → src/content.js  _Bridges community 2 → community 9_
- `init()` --calls--> `log()`  [EXTRACTED]
  src/content.js → src/content.js  _Bridges community 2 → community 5_
- `startTranslate()` --calls--> `log()`  [EXTRACTED]
  src/content.js → src/content.js  _Bridges community 2 → community 13_
- `saveSetting()` --calls--> `ensureSubtitles()`  [EXTRACTED]
  src/content.js → src/content.js  _Bridges community 4 → community 9_
- `ensureSubtitles()` --calls--> `tickSubs()`  [EXTRACTED]
  src/content.js → src/content.js  _Bridges community 11 → community 9_

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (17): background, scripts, service_worker, content_scripts, description, host_permissions, icons, 128 (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (8): cueEn, cueRu, DEFAULTS, ICONS, settings, videoListeners, wordCache, WORKERS

### Community 2 - "Community 2"
Cohesion: 0.28
Nodes (9): absUrl(), extractJsonObject(), getCaptionBaseUrl(), getPlayerResponseFromDom(), listTimedTextTracks(), log(), pageRequest(), pickCaptionTrack() (+1 more)

### Community 3 - "Community 3"
Cohesion: 0.22
Nodes (8): VOT Button — Voice Over Translation, Использование, Как это работает, Лицензия, Проблемы, Разработка, Установка, Что делает сборку кросс-браузерной

### Community 4 - "Community 4"
Cohesion: 0.32
Nodes (8): applyBarLayout(), createButtonBar(), getPlayerContainer(), injectBar(), maybeAutoTranslate(), saveSetting(), syncSettingsPanel(), voiceLabel()

### Community 5 - "Community 5"
Cohesion: 0.33
Nodes (6): closeMenus(), getVideoId(), init(), loadSettings(), onDocClick(), removeBar()

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (18): author, dependencies, @vot.js/core, @vot.js/ext, @vot.js/shared, description, devDependencies, esbuild (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.33
Nodes (6): browser_specific_settings, gecko, required, data_collection_permissions, id, strict_min_version

### Community 8 - "Community 8"
Cohesion: 0.40
Nodes (4): DEFAULTS, FIELDS, load(), setVolumeLabel()

### Community 9 - "Community 9"
Cohesion: 0.40
Nodes (5): bindSubClock(), ensureSubOverlay(), ensureSubtitles(), loadTimedtext(), parseJson3()

### Community 10 - "Community 10"
Cohesion: 0.40
Nodes (5): action, default_icon, default_title, 16, 48

### Community 11 - "Community 11"
Cohesion: 0.50
Nodes (4): activeCue(), fillLineWithWords(), positionSubs(), tickSubs()

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (4): fetchTranslation(), setState(), startTranslate(), syncAudio()

## Knowledge Gaps
- **57 isolated node(s):** `build.sh script`, `name`, `version`, `description`, `main` (+52 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `browser_specific_settings` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `action` connect `Community 10` to `Community 0`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `build.sh script`, `name`, `version` to the rest of the system?**
  _57 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 6` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._