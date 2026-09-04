# Candidates

## Ready-to-use products

| Candidate | Primary evidence | Fit |
| --- | --- | --- |
| FolioSort Best Shots | [official feature page](https://www.foliosort.app/features/best-shots) | Native time-plus-visual burst grouping, sharpness/face/open-eye scoring, side-by-side review, and undo; no Immich album/list integration documented. |
| Photiva | [official site](https://photiva.app/) | Time-based burst grouping and best-shot selection by sharpness, exposure, and resolution; desktop Mac product and no Immich integration evidence. |

## Adaptable projects

| Candidate | Primary evidence | Fit |
| --- | --- | --- |
| Immich Selfie Timelapse | [README](https://github.com/ArnaudCrl/immich-automated-selfie-timelapse), [issue #40](https://github.com/ArnaudCrl/immich-automated-selfie-timelapse/issues/40) | Closest fit: Immich face metadata, blur/brightness/pose/blink filters, Docker, and video compilation. Existing period limits are coarse; issue #40 directly requests configurable fine-grained spacing. |
| Immich-Deduper | [README](https://github.com/RazgrizHsu/immich-deduper) | Native visual similarity and pending review groups; auto-selection uses date/size/EXIF. Direct DB deletion to recoverable Trash and snapshot/refetch behavior conflict with a selection-only workflow. |
| Photo Curator | [README](https://github.com/kotyzap/Photo-Curator) | Local EXIF-aware burst clustering, ORB confirmation, sharpness ranking, cached signatures, and review-before-move. Folder based; no Immich adapter. |

## Reusable components

| Component | Primary evidence | Fit |
| --- | --- | --- |
| `sharp-phash` | [npm](https://www.npmjs.com/package/sharp-phash) | MIT pHash and Hamming distance for an optional visual second stage. |
| `ImageHash` | [PyPI](https://pypi.org/project/ImageHash/) | BSD-2-Clause aHash/pHash/dHash/wHash/colorhash and crop-resistant hashing. |
| `opencv-python-headless` | [PyPI](https://pypi.org/project/opencv-python-headless/) | Server-friendly CPU OpenCV wheels for a simple Laplacian sharpness/exposure heuristic. |

## Candidate capability distinctions

Time proximity, visual near-duplicate similarity, and exact file hashing are separate. Immich upload duplicate checks use file hashes; Immich's newer duplicates utility uses ML visual similarity; the requested filter starts with capture timestamps. A pHash alone does not implement the time-window rule.
