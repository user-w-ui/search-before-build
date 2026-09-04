# Decision

## Recommendation: Adapt

The need is concrete and recurring, and a close Immich-specific project already handles face-focused selection, quality filters, local Docker execution, and timelapse compilation. Building a narrow extension is more proportionate than starting a new photo database or adopting a desktop cleaner that cannot emit an Immich selection.

The adaptation should:

1. enumerate the chosen person's current Immich assets and capture timestamps;
2. group them by a configurable seconds/minutes/hours spacing window;
3. choose one candidate per group using existing blur/brightness/pose/eye signals, with a simple sharpness/exposure fallback;
4. show a dry-run thumbnail report;
5. write a versioned asset-ID manifest and optionally an alternate Immich album for the timelapse job;
6. retain the prior manifest so restoring a previous selection is a file or album operation.

## Necessity gates

| Gate | Basis |
| --- | --- |
| Concrete need exists | **Fact:** source issue and prompt describe stutter from bursts/retakes in a monthly timelapse. |
| Core function addresses it | **Inference:** timestamp-first clustering directly removes over-represented moments; quality choice improves the keeper. |
| Delivery form fits | **Fact:** local batch and overnight runtime are explicitly acceptable. |
| Current alternatives leave trouble | **Fact:** Immich's documented day/week/month limits are coarse; desktop tools lack Immich output. |
| New work beats adoption | **Inference:** an adapter around the existing Immich Selfie Timelapse is smaller than rebuilding face filtering and compilation; this remains contingent on API compatibility. |

## Evidence-based comparison

- Immich Selfie Timelapse documents face metadata, blur, brightness, head pose, blink, and face-resolution filtering, plus Docker and MP4 output. Its issue #40 asks for the exact configurable time-window behavior.
- Immich-Deduper documents visual similarity, thresholds, pending review, and recoverable Trash, but it is designed to resolve library duplicates and updates the database directly.
- Photo Curator and FolioSort demonstrate mature time-plus-visual burst grouping and quality ranking, but their documented inputs/outputs are local folders or desktop libraries.
- Immich's official docs confirm visual duplicate review, album membership for external assets, and OpenAPI generated clients. Read-only external libraries protect originals but still store album metadata inside Immich.

## Reusable option

[ArnaudCrl/immich-automated-selfie-timelapse](https://github.com/ArnaudCrl/immich-automated-selfie-timelapse) is the strongest base. The largest remaining unknown is the exact Immich server version and API permission set for asset enumeration and album creation, followed by whether the current timelapse job can consume an asset-ID manifest.
