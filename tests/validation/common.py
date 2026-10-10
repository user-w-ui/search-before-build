from __future__ import annotations

import json
import subprocess
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[2]
LEGACY_NAMES = ("should-" + "i-build", "Should " + "I Build")


def read_json(path: str) -> Any:
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def read_skill(name: str) -> tuple[dict[str, str], str]:
    text = read_text(f"skills/{name}/SKILL.md")
    assert text.startswith("---\n"), f"{name}: missing YAML frontmatter"
    _, raw_frontmatter, body = text.split("---", 2)
    metadata: dict[str, str] = {}
    for line in raw_frontmatter.strip().splitlines():
        key, value = line.split(":", 1)
        metadata[key.strip()] = value.strip().strip('"')
    return metadata, body


def package_files() -> list[Path]:
    # Skip git-ignored local workspaces (video builds, virtualenvs) that are not
    # part of the package and may hold non-UTF-8 third-party files.
    try:
        listed = subprocess.run(
            ["git", "ls-files", "-z", "--cached", "--others", "--exclude-standard"],
            cwd=ROOT,
            capture_output=True,
            check=True,
        ).stdout.decode("utf-8")
        return [ROOT / name for name in listed.split("\0") if name]
    except (OSError, subprocess.CalledProcessError):
        return [path for path in ROOT.rglob("*") if ".git" not in path.parts]


def assert_legacy_name_removed() -> None:
    for path in package_files():
        if not path.is_file():
            continue
        relative = path.relative_to(ROOT).as_posix()
        if relative.startswith("bench/results/"):
            continue
        assert not any(name in relative for name in LEGACY_NAMES), relative
        if path.suffix.lower() in {".md", ".json", ".mjs", ".py"}:
            text = path.read_text(encoding="utf-8")
            assert not any(name in text for name in LEGACY_NAMES), relative
