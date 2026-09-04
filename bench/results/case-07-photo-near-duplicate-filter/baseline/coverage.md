# Case 07 baseline coverage

## Request coverage

| Requirement | Evidence found | Baseline conclusion |
| --- | --- | --- |
| Configurable spacing window | No Immich-native feature found for 30-second, 5-minute, or 2-hour representative selection. | Build a rolling minimum-spacing rule; avoid rigid clock buckets. |
| Keep the best representative | Immich's duplicate suggestion is documented around file size and EXIF count. | Add sharpness, exposure/clipping, face size/quality, resolution, and optionally eyes-open signals. |
| Scope to face-focused timelapse | Immich provides the surrounding asset/person system and an API seam. | Process only the chosen person/month subset rather than all 80,000 assets. |
| Preview | The built-in duplicate utility establishes a manual review precedent. | Show a contact sheet per window with keep/reject/lock controls. |
| Never delete originals | Read-only external libraries prevent UI deletion. | Never call trash/delete endpoints; optionally use a read-only mount. |
| Undo | No durable undo mechanism for this proposed selection workflow was found. | Save a versioned manifest and make outputs disposable/rebuildable. |
| Immich integration | Official OpenAPI REST documentation is available. | Start as a local companion tool; treat a plugin as later packaging. |

## Exact search queries

The rerun made three batched search calls containing 11 exact queries:

1. `site:immich.app/docs duplicate photos Immich library`
2. `site:immich.app/docs Immich API assets external library read only`
3. `site:github.com/immich-app/immich duplicate detection representative photo API`
4. `site:immich.app/docs Immich extensions plugins API`
5. `site:docs.immich.app/features duplicate detection Immich machine learning duplicates review`
6. `site:docs.immich.app "Duplicate Detection" Immich`
7. `site:github.com/immich-app/immich "suggestedKeepAssetIds"`
8. `site:github.com/immich-app/immich plugin extension support Immich`
9. `site:docs.immich.app/developer plugins Immich plugin system workflows wasm`
10. `site:github.com/immich-app/immich "IMMICH_ALLOW_EXTERNAL_PLUGINS"`
11. `site:docs.immich.app "plugins" Immich`

## Opened pages

One batched open call opened three search references, resolving to:

- `https://docs.immich.app/features/duplicates-utility/`
- `https://docs.immich.app/features/libraries/`
- `https://immich.app/docs/api/` (the final answer uses the current canonical `https://docs.immich.app/api/` form)

The plugin-system discussion was surfaced by search results but was not separately opened.

## Evidence limits

This is a faithful baseline capture, including its gaps. It did not perform a broad GitHub, package-registry, or general-web sweep for third-party photo-culling products; it did not inspect a real 80,000-photo library; and it did not benchmark quality metrics. The recommendation therefore calls for a three-to-four-month MVP validation, with manual override rate as the primary success measure.
