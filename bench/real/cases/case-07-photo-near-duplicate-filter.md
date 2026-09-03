# Case 07 · 照片时间窗口近重复过滤器（assess，个人照片库）

| 项 | 值 |
| --- | --- |
| 技能（B 臂） | `search-before-build-assess` |
| 模拟用户语言 | English |
| 补充材料 | 无 |
| 真实需求来源 | [Immich automated selfie timelapse issue #40](https://github.com/ArnaudCrl/immich-automated-selfie-timelapse/issues/40)（公开 feature request） |
| 对比焦点 | 真实痛点与功能边界、照片相似度/质量排序、Immich 插件生态、可逆批处理 |

## Source and assessment focus

The source request comes from a real timelapse workflow: burst shots and retakes taken seconds apart all become frames, so one moment is over-represented and the video “stutters”. Per-day/week/month limits are too coarse. The requested behavior is a configurable spacing window in seconds, minutes, or hours, keeping one representative photo—ideally the one with the best blur, brightness, pose, or eye scores—and skipping the rest.

The case turns that request into a standalone product decision. It tests whether the agent searches for existing Immich extensions, photo-management tools, perceptual-hash/embedding libraries, and quality-ranking implementations, while keeping the operation non-destructive and reversible.

## User prompt (use verbatim for both arms)

```text
I have about 80,000 personal photos in an Immich library and I generate a face-focused timelapse every month. Burst shots and retakes taken within a few seconds create clusters of almost identical frames, so the timelapse looks like it is stuttering. I want a local tool or Immich extension with a configurable spacing window (for example 30 seconds, 5 minutes, or 2 hours) that keeps one representative photo per window, preferably the sharpest or best-exposed one. It must never delete originals and should let me preview and undo the selection. Is this worth building?
```

## Clarification script (answer only if asked)

1. Existing workflow → `The source photos stay in Immich; I only need to change which photos are selected for the timelapse export, not clean up the library itself.`
2. Similarity and selection rule → `Timestamp proximity is the first filter. If several photos are in one window, use existing quality scores or a simple sharpness/exposure heuristic; I do not need face recognition beyond what Immich already has.`
3. Scale and runtime → `It runs once a month on a home server. An overnight batch is fine, and a dry-run report with thumbnails is more important than real-time speed.`
4. Safety and integration → `The output should be a list or alternate album that the timelapse job can consume. Do not move or delete files, and keep a record so I can restore the previous selection.`
5. Pre-research confirmation (B arm) → `Confirmed.`

## B-arm routing observation table

| Source | Strength | Trigger |
| --- | --- | --- |
| GitHub | must | Immich extensions, timelapse tools, perceptual-hash and image-quality implementations |
| web (host/DDG fallback) | must | Product pages and comparisons for photo deduplication and timelapse selection |
| npm / PyPI | should | Reusable image-hash, sharpness, and video-frame selection packages |
| Immich documentation/API | must | Verify album/search/export integration and non-destructive behavior |

## Evidence to record

- [ ] Candidate list: Immich plugins, photo deduplication tools, perceptual-hash libraries, and timelapse utilities, with links and the evidence for each capability.
- [ ] Whether each candidate works on timestamps, visual similarity, quality ranking, or only exact file hashes; do not treat those as interchangeable.
- [ ] Whether originals remain untouched and whether dry-run/undo/audit behavior is documented.
- [ ] Whether the recommendation fits an 80,000-photo home-server batch and Immich's album/export model.
- [ ] Source coverage and query terms for both arms; note if A arm never checks Immich's own API or extension ecosystem.
- [ ] B-arm kernel output: cross-source identity merging, observation counts, and warnings for candidates whose “duplicate” feature means exact hashes only.
- [ ] Final recommendation and supporting quotations from both arms.

## Comparison focus

1. Does either arm identify the distinction between exact duplicates and near-duplicates taken close together in time?
2. Which arm finds a reusable Immich integration or image-quality component instead of proposing a new photo database?
3. Do both recommendations preserve originals and provide a reviewable, reversible selection?
4. Does the proposed implementation path match a monthly home-server batch, or does it assume a cloud photo SaaS or real-time mobile app?

