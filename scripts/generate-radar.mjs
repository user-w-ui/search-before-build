// Render the README benchmark radar (SVG, en + zh) and an interactive preview page.
// Usage: node scripts/generate-radar.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ASSETS_DIR = join(ROOT, "assets");

const escapeXml = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&apos;");

// Measured means from bench/results/SUMMARY.md. `plugin` and `baseline` are the
// raw values; `pluginVal` and `baselineVal` place them on each axis's own scale.
const METRICS = [
  {
    key: "catalogs",
    plugin: "10",
    baseline: "0",
    pluginVal: 1.0,
    baselineVal: 0,
    unit: { en: "catalogs", zh: "个" },
    en: { name: "Specialized catalogs", short: "Catalogs", detail: "npm, crates, HF, arXiv, MCP…" },
    zh: { name: "专有检索目录", short: "检索目录", detail: "npm、crates、HF、arXiv、MCP 等" },
  },
  {
    key: "clarification",
    plugin: "2.92",
    baseline: "0",
    pluginVal: 0.73,
    baselineVal: 0,
    unit: { en: "rounds", zh: "轮" },
    en: { name: "Clarification rounds", short: "Clarification", detail: "Aligns real constraints before searching" },
    zh: { name: "需求澄清轮次", short: "需求澄清", detail: "检索前主动对齐真实约束" },
  },
  {
    key: "crawled",
    plugin: "216",
    baseline: "111",
    pluginVal: 0.864,
    baselineVal: 0.444,
    unit: { en: "pages", zh: "篇" },
    en: { name: "Primary pages read", short: "Pages read", detail: "1.9× primary docs and source checked" },
    zh: { name: "一手页面抓取", short: "页面抓取", detail: "1.9× 一手文档与源码查验" },
  },
  {
    key: "citations",
    plugin: "112",
    baseline: "41",
    pluginVal: 0.8,
    baselineVal: 0.293,
    unit: { en: "URLs", zh: "条" },
    en: { name: "Citation density", short: "Citations", detail: "2.7× verifiable primary links" },
    zh: { name: "引用证据密度", short: "引用证据", detail: "2.7× 一手可验证链接" },
  },
  {
    key: "dates",
    plugin: "9",
    baseline: "3",
    pluginVal: 0.75,
    baselineVal: 0.25,
    unit: { en: "cases", zh: "案" },
    en: { name: "Date evidence", short: "Dates", detail: "75% dated · caught 2/2 dead tools" },
    zh: { name: "日期时效证据", short: "日期证据", detail: "75% 有日期 · 2/2 识破停服项目" },
  },
  {
    key: "composite",
    plugin: "0.592",
    baseline: "0.341",
    pluginVal: 0.592,
    baselineVal: 0.341,
    unit: { en: "", zh: "" },
    en: { name: "Composite score", short: "Composite", detail: "Overall benchmark score, 1.7×" },
    zh: { name: "综合评测得分", short: "综合得分", detail: "综合能力得分，1.7× 提升" },
  },
];

const HIGHLIGHTS = {
  en: [
    { value: "11", suffix: "/12", label: "Tasks won", sub: "Bare agent won 1" },
    { value: "10", suffix: "/10", label: "Specialized catalogs reached", sub: "Bare agent: 0" },
    { value: "2", suffix: "/2", label: "Shut-down tools caught", sub: "Bare agent: 0" },
    { value: "0", suffix: "", label: "Answers from memory alone", sub: "Bare agent: 2" },
  ],
  zh: [
    { value: "11", suffix: "/12", label: "任务胜出", sub: "裸 Agent 胜 1 个" },
    { value: "10", suffix: "/10", label: "触达专有检索目录", sub: "裸 Agent：0 个" },
    { value: "2", suffix: "/2", label: "识破已停服工具", sub: "裸 Agent：0 个" },
    { value: "0", suffix: "", label: "纯凭记忆、零检索作答", sub: "裸 Agent：2 次" },
  ],
};

const COPY = {
  en: {
    eyebrow: "Benchmark · 12 paired real tasks",
    title: "With the plugin vs. a bare agent",
    subtitle: "Same tasks on Claude Code and Codex · composite score 0.592 vs 0.341",
    plugin: "With plugin",
    pluginStat: "11 wins",
    baseline: "Bare agent",
    baselineStat: "1 win",
    radar: "Six measures",
    radarNote: "Each axis uses its own scale",
    list: "Measured means per task",
  },
  zh: {
    eyebrow: "评测 · 12 个成对真实任务",
    title: "加载插件 vs 裸 Agent",
    subtitle: "同一批任务，覆盖 Claude Code 与 Codex · 综合得分 0.592 vs 0.341",
    plugin: "加载插件",
    pluginStat: "11 胜",
    baseline: "裸 Agent",
    baselineStat: "1 胜",
    radar: "六个维度",
    radarNote: "各轴按自身量程归一化",
    list: "逐项实测均值",
  },
};

const COLORS = {
  bg: "#f2f2f4",
  card: "#ffffff",
  border: "#e8e8ec",
  line: "#ececf0",
  lineStrong: "#d6d6dc",
  text: "#111114",
  muted: "#66666f",
  faint: "#a1a1aa",
  tone: "#2563eb",
  toneSoft: "#eaf1fe",
  base: "#8b8b95",
  baseBar: "#c9c9d1",
};
const FONT = "'SF Pro Display', Inter, 'Segoe UI Variable Display', 'Segoe UI', 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif";

const WIDTH = 1120;
const HEIGHT = 788;
const PAD = 40;
const ROW_Y = 150;
const ROW_H = 470;
const RADAR_CARD = { x: PAD, w: 540 };
const LIST_CARD = { x: PAD + 540 + 16, w: WIDTH - PAD * 2 - 540 - 16 };
const CX = RADAR_CARD.x + RADAR_CARD.w / 2;
const CY = ROW_Y + ROW_H / 2 + 22;
const R = 150;
const ANGLES = [-90, -30, 30, 90, 150, 210];
const STAT_Y = ROW_Y + ROW_H + 16;
const STAT_H = 112;

const point = (radius, angle) => {
  const radians = (angle * Math.PI) / 180;
  return { x: CX + radius * Math.cos(radians), y: CY + radius * Math.sin(radians) };
};
const fmt = (value) => value.toFixed(2);
const polygon = (values) => values
  .map((value, index) => {
    const p = point(R * value, ANGLES[index]);
    return `${fmt(p.x)},${fmt(p.y)}`;
  })
  .join(" ");
const text = (x, y, content, { size = 14, weight = 500, fill = COLORS.text, anchor = "start", extra = "" } = {}) =>
  `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${extra}>${content}</text>`;
const card = (x, y, w, h, fill = COLORS.card) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${COLORS.border}" />`;

function generateSvg(lang) {
  const copy = COPY[lang];
  const local = (metric) => metric[lang];

  const rings = [0.25, 0.5, 0.75, 1].map((level) => `<polygon points="${polygon(ANGLES.map(() => level))}" fill="none" stroke="${level === 1 ? COLORS.lineStrong : COLORS.line}" stroke-width="${level === 1 ? 1.2 : 1}" />`).join("\n    ");
  const axes = ANGLES.map((angle) => {
    const end = point(R, angle);
    return `<line x1="${CX}" y1="${CY}" x2="${fmt(end.x)}" y2="${fmt(end.y)}" stroke="${COLORS.line}" />`;
  }).join("\n    ");

  // A zero still sits slightly off-centre so the bare-agent shape stays readable.
  const baselineShape = polygon(METRICS.map((metric) => Math.max(metric.baselineVal, 0.04)));
  const pluginShape = polygon(METRICS.map((metric) => metric.pluginVal));
  const baselineDots = METRICS.map((metric, index) => {
    const p = point(R * Math.max(metric.baselineVal, 0.04), ANGLES[index]);
    return `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="3" fill="${COLORS.base}" />`;
  }).join("\n    ");
  const pluginDots = METRICS.map((metric, index) => {
    const p = point(R * metric.pluginVal, ANGLES[index]);
    return `<circle cx="${fmt(p.x)}" cy="${fmt(p.y)}" r="4.5" fill="${COLORS.card}" stroke="${COLORS.tone}" stroke-width="2.2" />`;
  }).join("\n    ");
  const axisLabels = METRICS.map((metric, index) => {
    const angle = ANGLES[index];
    const p = point(R + 24, angle);
    const cos = Math.cos((angle * Math.PI) / 180);
    const anchor = Math.abs(cos) < 0.1 ? "middle" : cos > 0 ? "start" : "end";
    const dy = angle === -90 ? -4 : angle === 90 ? 14 : 5;
    return text(p.x, p.y + dy, escapeXml(local(metric).short), { size: 14, weight: 650, anchor });
  }).join("\n    ");

  const listX = LIST_CARD.x + 28;
  const listRight = LIST_CARD.x + LIST_CARD.w - 28;
  const listW = listRight - listX;
  const rows = METRICS.map((metric, index) => {
    const y = ROW_Y + 80 + index * 62;
    const unit = metric.unit[lang];
    const unitSuffix = unit ? `${lang === "zh" ? "" : " "}${unit}` : "";
    const baselineBar = metric.baselineVal > 0
      ? `<rect x="${listX}" y="${y + 38}" width="${fmt(listW * metric.baselineVal)}" height="5" rx="2.5" fill="${COLORS.baseBar}" />`
      : "";
    return `${text(listX, y, escapeXml(local(metric).name), { size: 15, weight: 650 })}
    <text x="${listRight}" y="${y}" text-anchor="end" fill="${COLORS.tone}"><tspan font-size="19" font-weight="700">${escapeXml(metric.plugin)}</tspan><tspan font-size="12.5" font-weight="600">${escapeXml(unitSuffix)}</tspan></text>
    ${text(listX, y + 19, escapeXml(local(metric).detail), { size: 12.5, fill: COLORS.muted })}
    ${text(listRight, y + 19, `vs ${escapeXml(metric.baseline + unitSuffix)}`, { size: 12.5, weight: 600, fill: COLORS.faint, anchor: "end" })}
    <rect x="${listX}" y="${y + 30}" width="${listW}" height="5" rx="2.5" fill="${COLORS.line}" />
    <rect x="${listX}" y="${y + 30}" width="${fmt(listW * metric.pluginVal)}" height="5" rx="2.5" fill="${COLORS.tone}" />
    ${baselineBar}`;
  }).join("\n    ");

  const statW = (WIDTH - PAD * 2 - 16 * 3) / 4;
  const stats = HIGHLIGHTS[lang].map((item, index) => {
    const x = PAD + index * (statW + 16);
    return `${card(x, STAT_Y, statW, STAT_H)}
    <text x="${x + 24}" y="${STAT_Y + 50}" fill="${COLORS.text}"><tspan font-size="34" font-weight="700" letter-spacing="-0.5">${escapeXml(item.value)}</tspan><tspan font-size="18" font-weight="650" fill="${COLORS.faint}">${escapeXml(item.suffix)}</tspan></text>
    ${text(x + 24, STAT_Y + 76, escapeXml(item.label), { size: 14, weight: 600 })}
    ${text(x + 24, STAT_Y + 95, escapeXml(item.sub), { size: 12.5, fill: COLORS.muted })}`;
  }).join("\n    ");

  const legendY = 72;
  const legend = `<g transform="translate(${WIDTH - PAD - 412}, ${legendY})">
      <rect width="210" height="34" rx="17" fill="${COLORS.card}" stroke="${COLORS.border}" />
      <circle cx="20" cy="17" r="5.5" fill="${COLORS.card}" stroke="${COLORS.tone}" stroke-width="2.4" />
      ${text(34, 22, escapeXml(copy.plugin), { size: 13.5, weight: 650 })}
      ${text(194, 22, escapeXml(copy.pluginStat), { size: 13.5, weight: 700, fill: COLORS.tone, anchor: "end" })}
      <g transform="translate(220, 0)">
        <rect width="192" height="34" rx="17" fill="${COLORS.card}" stroke="${COLORS.border}" />
        <line x1="12" y1="17" x2="28" y2="17" stroke="${COLORS.base}" stroke-width="2" stroke-dasharray="4 3" />
        ${text(36, 22, escapeXml(copy.baseline), { size: 13.5, weight: 650, fill: COLORS.muted })}
        ${text(176, 22, escapeXml(copy.baselineStat), { size: 13.5, weight: 700, fill: COLORS.faint, anchor: "end" })}
      </g>
    </g>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" font-family="${FONT}" role="img" aria-label="${escapeXml(copy.title)}">
  <defs>
    <linearGradient id="radarCard" x1="0" y1="0" x2="0.55" y2="1">
      <stop offset="0" stop-color="${COLORS.toneSoft}" />
      <stop offset="0.7" stop-color="${COLORS.card}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="28" fill="${COLORS.bg}" />

  <g id="header">
    ${text(PAD, 64, escapeXml(copy.eyebrow), { size: 13, weight: 700, fill: COLORS.tone })}
    ${text(PAD, 102, escapeXml(copy.title), { size: 30, weight: 750, extra: ' letter-spacing="-0.4"' })}
    ${text(PAD, 130, escapeXml(copy.subtitle), { size: 15, fill: COLORS.muted })}
    ${legend}
  </g>

  <g id="radar">
    ${card(RADAR_CARD.x, ROW_Y, RADAR_CARD.w, ROW_H, "url(#radarCard)")}
    ${text(RADAR_CARD.x + 28, ROW_Y + 38, escapeXml(copy.radar), { size: 14, weight: 650, fill: COLORS.muted })}
    ${text(RADAR_CARD.x + RADAR_CARD.w - 28, ROW_Y + 38, escapeXml(copy.radarNote), { size: 12.5, fill: COLORS.faint, anchor: "end" })}
    ${rings}
    ${axes}
    <polygon points="${baselineShape}" fill="${COLORS.base}" fill-opacity="0.1" stroke="${COLORS.base}" stroke-width="1.8" stroke-dasharray="5 4" stroke-linejoin="round" />
    ${baselineDots}
    <polygon points="${pluginShape}" fill="${COLORS.tone}" fill-opacity="0.14" stroke="${COLORS.tone}" stroke-width="2.6" stroke-linejoin="round" />
    ${pluginDots}
    ${axisLabels}
  </g>

  <g id="measures">
    ${card(LIST_CARD.x, ROW_Y, LIST_CARD.w, ROW_H)}
    ${text(LIST_CARD.x + 28, ROW_Y + 38, escapeXml(copy.list), { size: 14, weight: 650, fill: COLORS.muted })}
    ${rows}
  </g>

  <g id="highlights">
    ${stats}
  </g>
</svg>
`;
}

function generateHtml(svgs) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Search Before Build · Benchmark radar</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 40px 24px 56px;
      background: ${COLORS.bg};
      color: ${COLORS.text};
      font: 15px/1.6 ${FONT};
      -webkit-font-smoothing: antialiased;
    }
    main { width: min(${WIDTH}px, 100%); margin: 0 auto; }
    .bar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
    h1 { margin: 0; font-size: 22px; letter-spacing: -0.02em; }
    .actions { display: flex; gap: 8px; flex-wrap: wrap; }
    button {
      min-height: 38px;
      padding: 8px 15px;
      border: 0;
      border-radius: 999px;
      background: ${COLORS.card};
      box-shadow: inset 0 0 0 1px ${COLORS.lineStrong};
      color: ${COLORS.text};
      font: 650 13px ${FONT};
      cursor: pointer;
    }
    button:hover { box-shadow: inset 0 0 0 1px ${COLORS.text}; }
    button[aria-pressed="true"], button.primary { background: ${COLORS.text}; color: ${COLORS.bg}; box-shadow: none; }
    #chart svg { display: block; width: 100%; height: auto; }
    .toast {
      position: fixed; left: 50%; bottom: 24px; padding: 12px 18px; border-radius: 14px;
      background: ${COLORS.text}; color: ${COLORS.bg}; font-weight: 620;
      opacity: 0; transform: translate(-50%, 10px); transition: opacity 200ms, transform 200ms; pointer-events: none;
    }
    .toast[data-visible="true"] { opacity: 1; transform: translate(-50%, 0); }
  </style>
</head>
<body>
  <main>
    <div class="bar">
      <h1>Search Before Build · Benchmark radar</h1>
      <div class="actions">
        <button type="button" data-lang="en" aria-pressed="true">English</button>
        <button type="button" data-lang="zh" aria-pressed="false">简体中文</button>
        <button type="button" class="primary" id="png">Export 2× PNG</button>
        <button type="button" id="svg">Save SVG</button>
      </div>
    </div>
    <div id="chart"></div>
  </main>
  <div class="toast" id="toast" role="status"></div>
  <script>
    const svgs = ${JSON.stringify(svgs)};
    let lang = "en";
    const toast = (message) => {
      const node = document.getElementById("toast");
      node.textContent = message;
      node.dataset.visible = "true";
      setTimeout(() => { node.dataset.visible = "false"; }, 2200);
    };
    const download = (href, name) => {
      const link = document.createElement("a");
      link.href = href;
      link.download = name;
      document.body.append(link);
      link.click();
      link.remove();
    };
    const setLang = (next) => {
      lang = next;
      document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
      document.getElementById("chart").innerHTML = svgs[next];
      document.querySelectorAll("[data-lang]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === next)));
    };
    document.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => setLang(button.dataset.lang)));
    document.getElementById("svg").addEventListener("click", () => {
      const url = URL.createObjectURL(new Blob([svgs[lang]], { type: "image/svg+xml;charset=utf-8" }));
      download(url, lang === "zh" ? "benchmark-radar.zh.svg" : "benchmark-radar.svg");
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    document.getElementById("png").addEventListener("click", () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = ${WIDTH} * 2;
        canvas.height = ${HEIGHT} * 2;
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          download(url, (lang === "zh" ? "benchmark-radar.zh" : "benchmark-radar") + "@2x.png");
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }, "image/png");
      };
      image.onerror = () => toast("PNG export failed");
      image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgs[lang]);
    });
    setLang("en");
  </script>
</body>
</html>
`;
}

mkdirSync(ASSETS_DIR, { recursive: true });
// Optional parts interpolate to empty strings; drop the trailing whitespace they leave.
const svgs = Object.fromEntries(["en", "zh"].map((lang) => [lang, generateSvg(lang).replace(/[ 	]+$/gm, "")]));
const outputs = {
  "benchmark-radar.svg": svgs.en,
  "benchmark-radar.zh.svg": svgs.zh,
  "benchmark-radar.html": generateHtml(svgs),
};
for (const [name, contents] of Object.entries(outputs)) {
  writeFileSync(join(ASSETS_DIR, name), contents, "utf8");
  console.log(join("assets", name));
}
