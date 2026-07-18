from __future__ import annotations

import base64
import json
import re

from .common import ROOT, read_text


def validate() -> None:
    readme = read_text("README.md")
    readme_zh = read_text("README.zh-CN.md")

    language_switch = "[English](./README.md) | [简体中文](./README.zh-CN.md)"
    assert language_switch in readme
    assert language_switch in readme_zh
    assert "Before you start vibe coding" in readme
    assert "在开始 vibe coding 之前" in readme_zh
    assert not (ROOT / "README.en.md").exists()

    assert "A direct request to enable, configure, or improve GitHub deep search" not in readme
    assert "The npm installer maps its own version" not in readme
    assert "直接提出“启用、配置或增强 GitHub 深度检索”时" not in readme_zh
    assert "npm 安装器会把自身版本映射到同版本 Git tag" not in readme_zh

    for language in ("en", "zh"):
        for image in (
            "01-decision.png",
            "02-capability-matrix.png",
            "03-competitor-analysis.png",
        ):
            path = ROOT / "assets" / "showcase" / language / image
            assert path.is_file(), f"missing showcase image: {path.relative_to(ROOT)}"
            assert f"./assets/showcase/{language}/{image}" in (
                readme if language == "en" else readme_zh
            )

    pages_url = "https://user-w-ui.github.io/search-before-build/"
    assert f"[Explore a live report]({pages_url})" in readme
    assert f"[体验完整报告样例]({pages_url}zh/)" in readme_zh

    showcase_en = read_text("showcase/index.html")
    showcase_zh = read_text("showcase/zh/index.html")
    assert 'href="./zh/"' in showcase_en
    assert 'href="../"' in showcase_zh
    assert _embedded_language(showcase_en) == "en"
    assert _embedded_language(showcase_zh) == "zh-CN"

    for path, showcase in (
        ("showcase/index.html", showcase_en),
        ("showcase/zh/index.html", showcase_zh),
    ):
        for forbidden in ("file://", "AppData", "C:\\\\Users", "<script src=", "<link href="):
            assert forbidden not in showcase, f"{path} contains non-portable content: {forbidden}"
        assert "const encodedReport" in showcase
        assert "Save Markdown" in showcase
        assert "保存 Markdown" in showcase

    workflow = read_text(".github/workflows/pages.yml")
    assert "actions/configure-pages" in workflow
    assert "actions/upload-pages-artifact" in workflow
    assert "actions/deploy-pages" in workflow
    assert "cp -R showcase/. _site/" in workflow


def _embedded_language(showcase: str) -> str:
    match = re.search(r'const encodedReport = "([A-Za-z0-9+/=]+)";', showcase)
    assert match, "showcase is missing its embedded report payload"
    report = json.loads(base64.b64decode(match.group(1)).decode("utf-8"))
    return report["language"]
