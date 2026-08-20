# Graph Report - zen-vot  (2026-08-19)

## Corpus Check
- 18 files · ~14,115 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 298 nodes · 724 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 64 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d984779`
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
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `$()` - 135 edges
2. `decode()` - 44 edges
3. `fromPartial()` - 34 edges
4. `encode()` - 19 edges
5. `ht()` - 17 edges
6. `join()` - 16 edges
7. `bt()` - 15 edges
8. `uint32()` - 15 edges
9. `assertBounds()` - 15 edges
10. `dn()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `translateVideo()` --calls--> `fetchTranslation()`  [EXTRACTED]
  src/content.js → src/translation.js
- `pollForTranslation()` --calls--> `fetchTranslation()`  [EXTRACTED]
  src/content.js → src/translation.js

## Import Cycles
- None detected.

## Communities (18 total, 5 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (30): bt(), Ce(), float(), fromJSON(), ge(), getSubtitlesVOTImpl(), ie(), join() (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.47
Nodes (6): double(), fixed64(), raw(), sfixed32(), sfixed64(), string()

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (21): action, default_icon, default_title, background, service_worker, content_scripts, 16, 48 (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (20): Dev режим, 📋 TODO, Zen VOT - Voice Over Translation, Архитектура, 🙏 Благодарности, 🚀 Быстрый старт, ✨ Возможности, ⚠️ Возможные проблемы (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (43): an(), assertBounds(), bn(), bytes(), cn(), createSession(), ct(), decode() (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.20
Nodes (12): cleanup(), getVideoElement(), getVideoId(), init(), log(), playTranslation(), pollForTranslation(), translateVideo() (+4 more)

### Community 6 - "Community 6"
Cohesion: 0.11
Nodes (17): author, dependencies, @vot.js/core, @vot.js/ext, @vot.js/shared, description, devDependencies, esbuild (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (44): absUrl(), activeCue(), applyBarLayout(), bindSubClock(), closeMenus(), createButtonBar(), cueEn, cueRu (+36 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): browser_specific_settings, gecko, content_scripts, required, description, data_collection_permissions, id, strict_min_version (+6 more)

### Community 10 - "Community 10"
Cohesion: 0.40
Nodes (4): DEFAULTS, FIELDS, load(), setVolumeLabel()

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (51): $(), B(), be(), canLog(), create(), decodeStreamResponse(), decodeSubtitlesResponse(), decodeTranslationAudioResponse() (+43 more)

## Knowledge Gaps
- **71 isolated node(s):** `build.sh script`, `DEFAULTS`, `build.sh script`, `client`, `WORKERS` (+66 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `$()` connect `Community 20` to `Community 0`, `Community 1`, `Community 4`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Why does `decode()` connect `Community 4` to `Community 0`, `Community 1`, `Community 20`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `decode()` (e.g. with `ft()` and `it()`) actually correct?**
  _`decode()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `fromPartial()` (e.g. with `ft()` and `it()`) actually correct?**
  _`fromPartial()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `ht()` (e.g. with `bn()` and `bt()`) actually correct?**
  _`ht()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `build.sh script`, `DEFAULTS`, `build.sh script` to the rest of the system?**
  _71 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.13793103448275862 - nodes in this community are weakly interconnected._