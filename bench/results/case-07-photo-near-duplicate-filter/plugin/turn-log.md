# Case 07 plugin arm turn log

Workflow invoked: `search-before-build:search-before-build-assess`.

Initial product input was used verbatim:

> I have about 80,000 personal photos in an Immich library and I generate a face-focused timelapse every month. Burst shots and retakes taken within a few seconds create clusters of almost identical frames, so the timelapse looks like it is stuttering. I want a local tool or Immich extension with a configurable spacing window (for example 30 seconds, 5 minutes, or 2 hours) that keeps one representative photo per window, preferably the sharpest or best-exposed one. It must never delete originals and should let me preview and undo the selection. Is this worth building?

The clarification stage asked one material question per turn and recorded the supplied answers:

1. **Existing workflow:** The source photos stay in Immich; only the photos selected for timelapse export change.
2. **Selection rule:** Timestamp proximity is the first filter; within a window use existing quality scores or a simple sharpness/exposure heuristic; no additional face recognition is needed.
3. **Runtime:** Monthly home-server batch; overnight processing is acceptable; a dry-run report with thumbnails matters more than real-time speed.
4. **Safety and integration:** Produce a list or alternate album for the timelapse job; never move or delete files; retain a record for restoring the previous selection.
5. **Pre-research confirmation:** Confirmed.

Pre-research understanding was therefore: one person needs a local, monthly Immich batch that narrows a face-focused timelapse by capture-time windows, chooses a quality representative, and emits a reviewable, reversible selection artifact while leaving originals untouched. Existing Immich face metadata and a home-server Docker/CLI deployment are boundaries; the key gap is fine-grained timestamp spacing plus an album/list output and audit trail. The understanding was confirmed before research.

Necessity check:

- **Fact:** Burst and retake clusters make the existing timelapse stutter; the source issue says day/week/month limits are too coarse.
- **Fact:** The user has a recurring 80,000-photo local workflow and explicitly values preview, undo, and no deletion.
- **Inference:** A small adapter around an Immich timelapse project is more economical than a new photo database because face filtering, quality checks, and video compilation already exist.
- **Unknown:** Exact Immich server version, API permissions, and whether the current timelapse job accepts an asset manifest or album.

Research found a close reusable Immich timelapse implementation, an Immich visual deduper, local burst/quality culling tools, and reusable hash/OpenCV components. One targeted follow-up was run after the decision kernel reported a missing lexical timestamp-window mention. The final recommendation is **Adapt**: extend the existing Immich Selfie Timelapse pipeline with timestamp-window clustering, review thumbnails, a versioned selection manifest, and optional alternate-album creation.

Temporary viewer rendered at `C:\\Users\\QC\\AppData\\Local\\Temp\\search-before-build\\runs\\20260904T022820-c07b\\brief.html`; the standard copy is `artifacts/brief.html`.
