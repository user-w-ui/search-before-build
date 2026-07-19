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

    showcase_en = read_text("docs/index.html")
    showcase_zh = read_text("docs/zh/index.html")
    assert 'href="./zh/index.html"' in showcase_en
    assert 'href="../index.html"' in showcase_zh
    assert 'href="./zh/"' not in showcase_en
    assert 'href="../"' not in showcase_zh
    assert _embedded_language(showcase_en) == "en"
    assert _embedded_language(showcase_zh) == "zh-CN"

    for path, showcase in (
        ("docs/index.html", showcase_en),
        ("docs/zh/index.html", showcase_zh),
    ):
        for forbidden in ("file://", "AppData", "C:\\\\Users", "<script src=", "<link href="):
            assert forbidden not in showcase, f"{path} contains non-portable content: {forbidden}"
        assert "const encodedReport" in showcase
        assert 'id="export-pdf"' in showcase
        assert "Export full PDF" in showcase
        assert showcase.index('id="export-pdf"') < showcase.index('class="demo-language"')
        assert 'id="print-capability-matrix"' in showcase
        print_styles = showcase.split("@media print", 1)[1].split("</style>", 1)[0]
        assert ".skip-link" in print_styles
        assert "Save Markdown" in showcase
        assert "保存 Markdown" in showcase

    assert not (ROOT / "showcase").exists()
    assert not (ROOT / ".github" / "workflows" / "pages.yml").exists()


def _embedded_language(showcase: str) -> str:
    match = re.search(r'const encodedReport = "([A-Za-z0-9+/=]+)";', showcase)
    assert match, "showcase is missing its embedded report payload"
    report = json.loads(base64.b64decode(match.group(1)).decode("utf-8"))
    return report["language"]
