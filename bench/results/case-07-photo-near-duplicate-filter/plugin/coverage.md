# Search coverage

Research date: 2026-09-04. English and Chinese discovery queries were attempted because the market was not restricted to one language.

| Route | Status | Evidence and limit |
| --- | --- | --- |
| GitHub | used | Read-only GitHub app searched and read Immich Selfie Timelapse, Immich-Deduper, Photo-Curator, Best Photo Picker, the source issue #40, Immich album service, and folder album creator. Repository/code coverage is public only. |
| Immich documentation/API | used | Official duplicates utility, external libraries, API, CLI, and album-service sources checked. Public API docs expose OpenAPI/SDK guidance; a live server was unavailable for endpoint testing. |
| General web | used | Product discovery and primary pages covered FolioSort, Photiva, Winnow, Photo Curator, and Immich. |
| npm | used | `sharp-phash`, `image-hash`, and related perceptual-hash package metadata/pages checked. |
| PyPI | used | ImageHash and opencv-python-headless metadata/pages checked. |
| arXiv | used | Near-duplicate image detection and perceptual-hashing papers checked for candidate-generation/clustering patterns. |
| Hacker News Algolia | limited | No material HN result was returned; community demand evidence was therefore limited to relevant web/GitHub discussions. |

The route audit matched the fingerprint triggers: GitHub for Immich extensions and implementations; web for ready-made products; npm/PyPI for reusable hash and image-quality components; Immich docs/API for album, asset, and non-destructive behavior. The kernel received 10 retrieval envelopes, normalized 37 records, merged 9 duplicate observations, and ranked 27 unique candidates. Its lexical coverage still marked the timestamp-window capability missing; manual primary-source verification confirms the closest tools support the concept, while only the requested Immich issue states the exact seconds/minutes/hours requirement.

The anonymous-search limitation statement is not applicable: this run used the exposed structured GitHub app route for repository and issue reads.
