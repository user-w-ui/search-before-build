# Case 07 baseline decision

The following is the rerun's final answer, preserved verbatim.

Yes—this is worth building for your use case, but as a small local companion tool first, not a full Immich extension.

Immich’s current duplicate utility handles visually similar assets and supports manual review, but its automatic keep suggestion is based mainly on file size and EXIF count—not capture-time spacing, sharpness, exposure, or face quality. That leaves a clear gap. [Immich Duplicates Utility](https://docs.immich.app/features/duplicates-utility/)

The best design would be:

- Filter by person and month, then process only that subset—not all 80,000 photos.
- Use a rolling minimum-spacing rule rather than rigid clock buckets, avoiding boundary artifacts.
- Rank candidates by sharpness, exposure/clipping, face size/quality, resolution, and optional “eyes open” detection.
- Show a contact-sheet preview for every window, with keep/reject/lock controls.
- Save a versioned selection manifest and export a dedicated Immich album or timelapse file list.
- Never call trash/delete endpoints. For extra protection, read source files through a read-only mount; Immich documents that read-only external libraries prevent UI deletion. [External Libraries](https://docs.immich.app/features/libraries/)

A local tool can use Immich’s OpenAPI REST interface and remain independent of Immich releases. [Immich API](https://docs.immich.app/api/) The plugin ecosystem is still relatively young and manual, so an extension is better as a later packaging choice. [Immich plugin discussion](https://github.com/immich-app/immich/discussions/29998)

My verdict: build an MVP if you can validate it on three or four months of photos. The key success metric is not frame reduction; it is how often you manually override the selected representative. If the tool removes most stutter while rarely losing a meaningful expression or event, it is a genuinely useful utility rather than just another duplicate finder.
