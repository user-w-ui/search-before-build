# Case 07 baseline candidates

The rerun surfaced four relevant Immich-native capabilities or seams. This baseline did not discover a ready-made third-party tool that satisfies the full request.

| Candidate / seam | Evidence | Fit | Main gap |
| --- | --- | --- | --- |
| [Immich Duplicates Utility](https://docs.immich.app/features/duplicates-utility/) | Official documentation describes similarity-based duplicate review and an automatic keep suggestion based primarily on file size and EXIF count. | Reusable comparison and review baseline inside Immich. | No configurable capture-time spacing and no documented sharpness, exposure, or face-quality ranking. |
| [Immich External Libraries](https://docs.immich.app/features/libraries/) | Official documentation describes read-only external-library mode, which prevents deletion from the Immich UI. | Useful safety boundary for a non-destructive companion workflow. | It is storage/library infrastructure, not a representative-photo selector. |
| [Immich OpenAPI REST API](https://docs.immich.app/api/) | Official API documentation provides the integration seam for an independent local companion tool. | Supports keeping the selector outside the Immich server and exporting an album or asset list. | The selection, scoring, preview, manifest, and undo workflow still need to be built. |
| [Immich plugin-system discussion](https://github.com/immich-app/immich/discussions/29998) | Project discussion indicates the extension ecosystem is still an evolving packaging surface. | Possible later distribution route. | Not mature enough to be the MVP's primary dependency. |

## Baseline interpretation

The closest reusable product feature is Immich's built-in Duplicates Utility, but the requested task is not ordinary deduplication. The useful product gap is a local, face/month-scoped selector that applies a configurable rolling spacing window, ranks candidates by photo and face quality, previews every choice, and records a reversible selection manifest without deleting originals.

The baseline therefore recommends a small independent companion tool first. It does not claim that the four entries above are equivalent competitors: External Libraries and the API are reusable components, while the plugin discussion is evidence about the packaging boundary.
