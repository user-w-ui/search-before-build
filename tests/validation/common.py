from __future__ import annotations

import json
import re
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
        if path.suffix.lower() in {".md", ".json", ".js", ".mjs", ".py"}:
            text = path.read_text(encoding="utf-8")
            assert not any(name in text for name in LEGACY_NAMES), relative


PACKAGE_PATH = re.compile(r"(?<![\w./<-])((?:\.\./)+[\w./-]+)")
REFERENCE_NAME = re.compile(r"`([a-z0-9-]+\.md)`|\]\(([a-z0-9-]+\.md)\)")


def assert_package_paths_resolve() -> None:
    """Every package-resource path resolves from the file that contains it.

    Skills and references write package paths relative to their own file
    (`../../references/x.md`, `../scripts/x.mjs`) and references name each
    other by bare file name. User-project and temporary paths are not checked.
    """
    documents = sorted((ROOT / "skills").glob("*/SKILL.md")) + sorted((ROOT / "references").glob("*.md"))
    for document in documents:
        relative = document.relative_to(ROOT).as_posix()
        text = document.read_text(encoding="utf-8")
        assert "<package-root>" not in text, f"{relative}: use a path relative to this file"
        assert "from this package" not in text, f"{relative}: use a path relative to this file"
        for match in PACKAGE_PATH.finditer(text):
            target = match.group(1).rstrip(".,;:")
            assert (document.parent / target).exists(), f"{relative}: {target} does not resolve"
        if document.parent.name == "references":
            for groups in REFERENCE_NAME.findall(text):
                name = groups[0] or groups[1]
                assert (document.parent / name).is_file(), f"{relative}: {name} does not resolve"
