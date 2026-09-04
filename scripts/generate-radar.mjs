import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const ASSETS_DIR = join(ROOT, "assets");

// 安全转义 XML 特殊字符
function escapeXml(unsafe) {
  if (unsafe === null || unsafe === undefined) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 6 核心具体数值维度（去掉了量程行，气泡彻底避开端点，绝对不遮挡）
const METRICS_DATA = [
  {
    key: "catalogs",
    angleDeg: -90, // Top
    align: "middle",
    labelX: 490,
    labelY: 132,
    scaleMax: 10,
    unit: { en: "catalogs", zh: "个" },
    pluginRaw: 10,
    baselineRaw: 0,
    // 气泡放在端点正上方外侧，彻底不遮挡端点圆圈
    pluginValDx: 0,
    pluginValDy: -18,
    baselineValDx: 0,
    baselineValDy: 0,
    en: {
      name: "Specialized Catalogs",
      pluginStat: "10",
      baselineStat: "0",
      detail: "npm, crates, HF, arXiv, MCP...",
    },
    zh: {
      name: "专有检索目录",
      pluginStat: "10",
      baselineStat: "0",
      detail: "npm, crates, HF, arXiv, MCP 等",
    },
    pluginVal: 1.0,
    baselineVal: 0.04,
  },
  {
    key: "clarification",
    angleDeg: -30, // Top-Right
    align: "start",
    labelX: 652,
    labelY: 268,
    scaleMax: 4.0,
    unit: { en: "rounds", zh: "轮" },
    pluginRaw: 2.92,
    baselineRaw: 0,
    // 气泡放在端点右上方外侧
    pluginValDx: 26,
    pluginValDy: -14,
    baselineValDx: 0,
    baselineValDy: 0,
    en: {
      name: "Clarification Rounds",
      pluginStat: "2.92",
      baselineStat: "0",
      detail: "Pre-search intent alignment",
    },
    zh: {
      name: "需求澄清轮次",
      pluginStat: "2.92",
      baselineStat: "0",
      detail: "检索前主动对齐真实约束",
    },
    pluginVal: 0.73,
    baselineVal: 0.04,
  },
  {
    key: "crawled",
    angleDeg: 30, // Bottom-Right
    align: "start",
    labelX: 652,
    labelY: 428,
    scaleMax: 250,
    unit: { en: "pages", zh: "篇" },
    pluginRaw: 216,
    baselineRaw: 111,
    // 气泡放在端点右下方外侧
    pluginValDx: 26,
    pluginValDy: 14,
    baselineValDx: 14,
    baselineValDy: 14,
    en: {
      name: "Pages Crawled",
      pluginStat: "216",
      baselineStat: "111",
      detail: "1.9× primary docs and code",
    },
    zh: {
      name: "一手页面抓取",
      pluginStat: "216",
      baselineStat: "111",
      detail: "1.9× 一手文档与源码查验",
    },
    pluginVal: 0.864,
    baselineVal: 0.444,
  },
  {
    key: "citations",
    angleDeg: 90, // Bottom
    align: "middle",
    labelX: 490,
    labelY: 518,
    scaleMax: 140,
    unit: { en: "URLs", zh: "条" },
    pluginRaw: 112,
    baselineRaw: 41,
    // 气泡放在端点正下方外侧
    pluginValDx: 0,
    pluginValDy: 22,
    baselineValDx: 0,
    baselineValDy: -14,
    en: {
      name: "Citation Density",
      pluginStat: "112",
      baselineStat: "41",
      detail: "2.7× verifiable primary links",
    },
    zh: {
      name: "引用证据密度",
      pluginStat: "112",
      baselineStat: "41",
      detail: "2.7× 一手可验证链接",
    },
    pluginVal: 0.80,
    baselineVal: 0.293,
  },
  {
    key: "date_evidence",
    angleDeg: 150, // Bottom-Left
    align: "end",
    labelX: 328,
    labelY: 428,
    scaleMax: 12,
    unit: { en: "cases", zh: "案" },
    pluginRaw: 9,
    baselineRaw: 3,
    // 气泡放在端点左下方外侧
    pluginValDx: -26,
    pluginValDy: 14,
    baselineValDx: -14,
    baselineValDy: 14,
    en: {
      name: "Date Evidence",
      pluginStat: "9",
      baselineStat: "3",
      detail: "75% dates · caught 2/2 dead tools",
    },
    zh: {
      name: "日期时效证据",
      pluginStat: "9",
      baselineStat: "3",
      detail: "75% 日期 · 2/2 识破停服死项目",
    },
    pluginVal: 0.75,
    baselineVal: 0.25,
  },
  {
    key: "composite",
    angleDeg: 210, // Top-Left
    align: "end",
    labelX: 328,
    labelY: 268,
    scaleMax: 1.0,
    unit: { en: "", zh: "" },
    pluginRaw: 0.592,
    baselineRaw: 0.341,
    // 气泡放在端点左上方外侧
    pluginValDx: -28,
    pluginValDy: -14,
    baselineValDx: -16,
    baselineValDy: -8,
    en: {
      name: "Composite Score",
      pluginStat: "0.592",
      baselineStat: "0.341",
      detail: "Overall benchmark score (1.7×)",
    },
    zh: {
      name: "综合评测得分",
      pluginStat: "0.592",
      baselineStat: "0.341",
      detail: "规范综合能力得分 (1.7× 提升)",
    },
    pluginVal: 0.592,
    baselineVal: 0.341,
  },
];

const HIGHLIGHTS = {
  en: [
    { label: "Win Rate", val: "11 / 12", sub: "vs 1 win" },
    { label: "Catalogs Reached", val: "10 / 10", sub: "vs 0 catalogs" },
    { label: "Shutdowns Caught", val: "2 / 2", sub: "vs 0 caught" },
    { label: "Zero-Search Blind", val: "0 Cases", sub: "vs 2 on baseline" },
  ],
  zh: [
    { label: "实测决策胜负", val: "11 / 12 胜", sub: "vs 1 胜" },
    { label: "专有检索目录", val: "10 / 10 触达", sub: "vs 0 目录" },
    { label: "停服陷阱防御", val: "2 / 2 识破", sub: "vs 0 识破" },
    { label: "纯记忆零检索", val: "0 案", sub: "裸 agent 发生 2 案" },
  ],
};

const WIDTH = 980;
const HEIGHT = 680;
const CX = 490;
const CY = 355;
const R = 135;
// 4 等分工程标尺环：0.25, 0.50, 0.75, 1.00
const LEVELS = [0.25, 0.5, 0.75, 1.0];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function buildPolygonPath(values) {
  return values
    .map((v, i) => {
      const pt = polarToCartesian(CX, CY, R * v, METRICS_DATA[i].angleDeg);
      return `${i === 0 ? "M" : "L"} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

function generateSvg(lang = "en") {
  const isZh = lang === "zh";
  const t = {
    badge: isZh ? "12-CASE 双臂评测" : "12-CASE BENCHMARK",
    badgeWidth: isZh ? 145 : 155,
    title: isZh ? "Search Before Build 插件 vs 裸 Agent 6维实测" : "Search Before Build vs Bare Agent: 6D Radar",
    subtitle: isZh
      ? "12 真实选型任务成对实测 · 具体实测数值 · Composite 0.592 vs 0.341"
      : "12 Paired Real-World Tasks · Concrete Measurements · Composite 0.592 vs 0.341",
    pluginLegend: isZh ? "加载插件" : "With Plugin",
    pluginLegendStat: isZh ? "11 胜 · 0.592" : "11 Wins · 0.592",
    baselineLegend: isZh ? "裸 Agent" : "Bare Agent",
    baselineLegendStat: isZh ? "1 胜 · 0.341" : "1 Win · 0.341",
  };

  const highlights = isZh ? HIGHLIGHTS.zh : HIGHLIGHTS.en;

  // 网格环 (4 层几何多边形网格)
  const gridPolygons = LEVELS.map((level) => {
    const pts = METRICS_DATA.map((d) => {
      const p = polarToCartesian(CX, CY, R * level, d.angleDeg);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");
    return `<polygon points="${pts}" fill="none" stroke="#223249" stroke-width="${level === 1.0 ? "1.5" : "1"}" stroke-dasharray="${level === 1.0 ? "none" : "3,3"}" />`;
  }).join("\n        ");

  // 轴线
  const axisLines = METRICS_DATA.map((d) => {
    const end = polarToCartesian(CX, CY, R, d.angleDeg);
    return `<line x1="${CX}" y1="${CY}" x2="${end.x.toFixed(2)}" y2="${end.y.toFixed(2)}" stroke="#273b53" stroke-width="1.2" />`;
  }).join("\n        ");

  // 数据多边形
  const baselinePath = buildPolygonPath(METRICS_DATA.map((d) => d.baselineVal));
  const pluginPath = buildPolygonPath(METRICS_DATA.map((d) => d.pluginVal));

  // A 臂基线顶点圆点与标注
  const baselinePoints = METRICS_DATA.map((d) => {
    const pt = polarToCartesian(CX, CY, R * d.baselineVal, d.angleDeg);
    const vx = pt.x + d.baselineValDx;
    const vy = pt.y + d.baselineValDy;
    const loc = isZh ? d.zh : d.en;

    const textMarkup = d.baselineRaw > 0 ? `
      <text x="${vx.toFixed(2)}" y="${vy.toFixed(2)}" fill="#94a3b8" font-size="10" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">${escapeXml(loc.baselineStat)}</text>
    ` : "";

    return `
      <circle cx="${pt.x.toFixed(2)}" cy="${pt.y.toFixed(2)}" r="4" fill="#94a3b8" stroke="#090d16" stroke-width="1.5" />
      ${textMarkup}
    `;
  }).join("\n        ");

  // B 臂插件顶点发光亮点与数值气泡（绝对不遮挡端点圆圈）
  const pluginPoints = METRICS_DATA.map((d) => {
    const pt = polarToCartesian(CX, CY, R * d.pluginVal, d.angleDeg);
    const vx = pt.x + d.pluginValDx;
    const vy = pt.y + d.pluginValDy;
    const loc = isZh ? d.zh : d.en;

    return `
      <circle cx="${pt.x.toFixed(2)}" cy="${pt.y.toFixed(2)}" r="7" fill="#10b981" fill-opacity="0.25" />
      <circle cx="${pt.x.toFixed(2)}" cy="${pt.y.toFixed(2)}" r="4.5" fill="#34d399" stroke="#ffffff" stroke-width="1.5" filter="url(#glow)" />
      <!-- 数值气泡：外离端点，完全不重合遮挡 -->
      <g transform="translate(${vx.toFixed(2)}, ${vy.toFixed(2)})">
        <rect x="-17" y="-9.5" width="34" height="17" rx="4.5" fill="#064e3b" fill-opacity="0.95" stroke="#059669" stroke-width="0.8" />
        <text x="0" y="3" text-anchor="middle" fill="#6ee7b7" font-size="10" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(loc.pluginStat)}</text>
      </g>
    `;
  }).join("\n        ");

  // 指标卡片与标签（去掉了量程小字，更精炼高级）
  const metricLabels = METRICS_DATA.map((d) => {
    const loc = isZh ? d.zh : d.en;
    const unitStr = isZh ? d.unit.zh : d.unit.en;
    const unitSuffix = unitStr ? ` ${unitStr}` : "";

    return `
      <g transform="translate(${d.labelX}, ${d.labelY})">
        <text x="0" y="0" text-anchor="${d.align}" fill="#f1f5f9" font-size="13.5" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          ${escapeXml(loc.name)}
        </text>
        <text x="0" y="18" text-anchor="${d.align}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12">
          <tspan fill="#34d399" font-weight="800">${escapeXml(loc.pluginStat + unitSuffix)}</tspan>
          <tspan fill="#64748b" font-weight="500"> vs </tspan>
          <tspan fill="#94a3b8" font-weight="600">${escapeXml(loc.baselineStat + unitSuffix)}</tspan>
        </text>
        <text x="0" y="34" text-anchor="${d.align}" fill="#94a3b8" font-size="10.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">
          ${escapeXml(loc.detail)}
        </text>
      </g>
    `;
  }).join("\n      ");

  // 底部药丸摘要卡片
  const pillWidth = 214;
  const pillGap = 16;
  const pillStartX = (WIDTH - (4 * pillWidth + 3 * pillGap)) / 2;
  const pillY = 594;

  const highlightCards = highlights.map((h, idx) => {
    const px = pillStartX + idx * (pillWidth + pillGap);
    return `
      <g transform="translate(${px}, ${pillY})">
        <rect width="${pillWidth}" height="60" rx="10" fill="#0d1422" stroke="#1e293b" stroke-width="1" />
        <text x="14" y="20" fill="#94a3b8" font-size="11" font-weight="500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(h.label)}</text>
        <text x="14" y="43" fill="#34d399" font-size="16" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(h.val)}</text>
        <text x="${pillWidth - 14}" y="43" text-anchor="end" fill="#64748b" font-size="10" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(h.sub)}</text>
      </g>
    `;
  }).join("\n      ");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <!-- 背景渐变 -->
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#0d2426" stop-opacity="0.45" />
      <stop offset="60%" stop-color="#09101b" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#06090e" stop-opacity="1" />
    </radialGradient>

    <!-- 中心微光 -->
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
    </radialGradient>

    <!-- 插件区域渐变填充 -->
    <linearGradient id="pluginGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.42" />
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.18" />
    </linearGradient>

    <!-- 发光滤镜 -->
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>

    <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#10b981" flood-opacity="0.25" />
    </filter>
  </defs>

  <style>
    text { text-rendering: geometricPrecision; -webkit-font-smoothing: antialiased; }
  </style>

  <!-- 主卡片背景 -->
  <rect width="${WIDTH}" height="${HEIGHT}" rx="18" fill="url(#bgGlow)" stroke="#1e293b" stroke-width="1.5" />

  <!-- 顶部 Header 区域（左侧标题，右侧图例，绝对不重叠） -->
  <g id="header-section">
    <!-- 左侧标题信息 -->
    <g transform="translate(36, 26)">
      <!-- 徽标 -->
      <rect x="0" y="0" width="${t.badgeWidth}" height="22" rx="11" fill="#064e3b" fill-opacity="0.4" stroke="#059669" stroke-width="1" />
      <circle cx="11" cy="11" r="3.5" fill="#34d399" />
      <text x="22" y="15" fill="#6ee7b7" font-size="10" font-weight="700" letter-spacing="0.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.badge)}</text>

      <!-- 主标题 -->
      <text x="0" y="46" fill="#f8fafc" font-size="20" font-weight="800" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.title)}</text>

      <!-- 副标题 -->
      <text x="0" y="66" fill="#94a3b8" font-size="12" font-weight="400" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.subtitle)}</text>
    </g>

    <!-- 右侧图例 Legend（宽度 260px，左右文字极大留白，绝不撞车） -->
    <g transform="translate(684, 26)">
      <!-- 插件图例 -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="260" height="28" rx="8" fill="#064e3b" fill-opacity="0.25" stroke="#059669" stroke-width="1" />
        <circle cx="14" cy="14" r="5" fill="#10b981" filter="url(#glow)" />
        <text x="28" y="18" fill="#f1f5f9" font-size="11.5" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.pluginLegend)}</text>
        <text x="246" y="18" text-anchor="end" fill="#34d399" font-size="11.5" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.pluginLegendStat)}</text>
      </g>

      <!-- 基线图例 -->
      <g transform="translate(0, 34)">
        <rect x="0" y="0" width="260" height="28" rx="8" fill="#1e293b" fill-opacity="0.4" stroke="#334155" stroke-width="1" />
        <circle cx="14" cy="14" r="4.5" fill="#94a3b8" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="2,2" />
        <text x="28" y="18" fill="#94a3b8" font-size="11.5" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.baselineLegend)}</text>
        <text x="246" y="18" text-anchor="end" fill="#64748b" font-size="11.5" font-weight="600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">${escapeXml(t.baselineLegendStat)}</text>
      </g>
    </g>

    <!-- Header 分割线 -->
    <line x1="36" y1="102" x2="944" y2="102" stroke="#1e293b" stroke-width="1" stroke-dasharray="4,4" />
  </g>

  <!-- 中心微光背景 -->
  <circle cx="${CX}" cy="${CY}" r="160" fill="url(#centerGlow)" />

  <!-- 雷达图网格与坐标轴 -->
  <g id="radar-grid">
    ${gridPolygons}
    ${axisLines}
  </g>

  <!-- A 臂数据层 (Bare Agent Baseline) -->
  <g id="baseline-layer">
    <path d="${baselinePath}" fill="#64748b" fill-opacity="0.14" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="5,4" />
    ${baselinePoints}
  </g>

  <!-- B 臂数据层 (Plugin with Kernel) -->
  <g id="plugin-layer" filter="url(#radarGlow)">
    <path d="${pluginPath}" fill="url(#pluginGrad)" stroke="#10b981" stroke-width="2.6" stroke-linejoin="round" />
    ${pluginPoints}
  </g>

  <!-- 6 维度指标卡片 -->
  <g id="metric-labels">
    ${metricLabels}
  </g>

  <!-- 底部汇总统计卡片 -->
  <g id="highlight-cards">
    ${highlightCards}
  </g>
</svg>`;
}

// 生成完整的 HTML 交互页面
function generateHtml() {
  const svgEn = generateSvg("en");
  const svgZh = generateSvg("zh");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Search Before Build - Empirical Benchmark Metrics Radar</title>
  <style>
    :root {
      --bg: #070b12;
      --card-bg: #0d131f;
      --card-border: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --accent: #10b981;
      --accent-light: #34d399;
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
    }

    .container {
      max-width: 1020px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .top-bar h1 {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .top-bar p {
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 4px;
    }

    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: var(--text-main);
      padding: 7px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
    }

    .btn:hover {
      background: #334155;
      border-color: #475569;
    }

    .btn.active {
      background: #064e3b;
      border-color: #059669;
      color: #6ee7b7;
    }

    .btn.highlight {
      background: #065f46;
      border-color: #10b981;
      color: #ecfdf5;
      font-weight: 700;
    }

    .btn.highlight:hover {
      background: #047857;
      border-color: #34d399;
    }

    .chart-box {
      background: #0b0f17;
      border-radius: 20px;
      border: 1px solid var(--card-border);
      padding: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      position: relative;
    }

    .chart-box svg {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 12px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
      gap: 16px;
    }

    .metric-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .metric-card:hover {
      border-color: #059669;
      transform: translateY(-2px);
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .metric-title {
      font-size: 15px;
      font-weight: 700;
      color: #f1f5f9;
    }

    .metric-values {
      display: flex;
      align-items: baseline;
      gap: 10px;
    }

    .val-plugin {
      font-size: 22px;
      font-weight: 800;
      color: #34d399;
    }

    .val-base {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-dim);
    }

    .metric-detail {
      font-size: 12.5px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #064e3b;
      font-weight: 700;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 13px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.25s ease;
      pointer-events: none;
      z-index: 999;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-bar">
      <div>
        <h1 id="page-title">Search Before Build · Concrete Metrics Radar</h1>
        <p id="page-sub">Empirical measurements from 12 real-world software selection tasks (24 paired sessions)</p>
      </div>
      <div class="actions">
        <button class="btn active" id="btn-en" onclick="setLang('en')">English</button>
        <button class="btn" id="btn-zh" onclick="setLang('zh')">简体中文</button>
        <button class="btn highlight" onclick="downloadPng(2)">Export 2x PNG</button>
        <button class="btn" onclick="downloadSvg()">Save SVG</button>
        <button class="btn" onclick="copySvg()">Copy SVG</button>
      </div>
    </div>

    <div class="chart-box" id="chart-container">
      <!-- SVG will be injected here -->
    </div>

    <div class="metric-grid" id="detail-grid">
      <!-- Detail cards will be injected here -->
    </div>
  </div>

  <div class="toast" id="toast">Ready!</div>

  <script>
    const svgSources = {
      en: ${JSON.stringify(svgEn)},
      zh: ${JSON.stringify(svgZh)}
    };

    const metricCardsData = ${JSON.stringify(METRICS_DATA)};

    let currentLang = 'en';

    function setLang(lang) {
      currentLang = lang;
      document.getElementById('btn-en').classList.toggle('active', lang === 'en');
      document.getElementById('btn-zh').classList.toggle('active', lang === 'zh');
      
      document.getElementById('page-title').textContent = lang === 'zh' 
        ? 'Search Before Build · 实测具体数值雷达图' 
        : 'Search Before Build · Concrete Metrics Radar';
      document.getElementById('page-sub').textContent = lang === 'zh'
        ? '12 个真实软硬件选型场景成对双臂实测数据（具体数值，杜绝百分比通胀）'
        : 'Empirical measurements from 12 real-world software selection tasks (concrete numbers, no % inflation)';

      document.getElementById('chart-container').innerHTML = svgSources[lang];
      renderCards(lang);
    }

    function renderCards(lang) {
      const grid = document.getElementById('detail-grid');
      const isZh = lang === 'zh';
      grid.innerHTML = metricCardsData.map(d => {
        const loc = isZh ? d.zh : d.en;
        const unit = isZh ? d.unit.zh : d.unit.en;
        const unitSuffix = unit ? ' <small style="font-size:13px;font-weight:600">' + unit + '</small>' : '';
        const baseSuffix = unit ? ' ' + unit : '';
        return (
          '<div class="metric-card">' +
            '<div class="metric-header">' +
              '<span class="metric-title">' + loc.name + '</span>' +
            '</div>' +
            '<div class="metric-values">' +
              '<span class="val-plugin">' + loc.pluginStat + unitSuffix + '</span>' +
              '<span class="val-base">vs ' + loc.baselineStat + baseSuffix + '</span>' +
            '</div>' +
            '<div class="metric-detail">' + loc.detail + '</div>' +
          '</div>'
        );
      }).join('');
    }

    function showToast(msg) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 2500);
    }

    function copySvg() {
      navigator.clipboard.writeText(svgSources[currentLang]).then(() => {
        showToast(currentLang === 'zh' ? 'SVG 代码已复制！' : 'SVG copied!');
      });
    }

    function downloadSvg() {
      const blob = new Blob([svgSources[currentLang]], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'benchmark-radar.' + currentLang + '.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(currentLang === 'zh' ? 'SVG 文件已下载！' : 'SVG downloaded!');
    }

    // 将 SVG 无损渲染到 Canvas 并一键导出 2x Retina PNG
    function downloadPng(scale = 2) {
      showToast(currentLang === 'zh' ? '正在导出 2x 高清 PNG...' : 'Exporting 2x PNG...');
      const svgStr = svgSources[currentLang];
      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = ${WIDTH} * scale;
          canvas.height = ${HEIGHT} * scale;
          const ctx = canvas.getContext('2d');
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (!blob) {
              const dataUrl = canvas.toDataURL('image/png');
              const a = document.createElement('a');
              a.href = dataUrl;
              a.download = 'benchmark-radar.' + currentLang + '@' + scale + 'x.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              showToast(currentLang === 'zh' ? '2x 高清 PNG 已下载！' : '2x PNG downloaded!');
              return;
            }
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = 'benchmark-radar.' + currentLang + '@' + scale + 'x.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
            showToast(currentLang === 'zh' ? '2x 高清 PNG 已下载！' : '2x PNG downloaded!');
          }, 'image/png');
        } catch (err) {
          console.error('Canvas export error:', err);
          showToast(currentLang === 'zh' ? '导出失败: ' + err.message : 'Export failed: ' + err.message);
        }
      };

      img.onerror = (e) => {
        console.error('SVG Image load error:', e);
        showToast(currentLang === 'zh' ? '图片加载失败' : 'Failed to load image');
      };

      img.src = svgUrl;
    }

    // Initialize
    setLang('en');
  </script>
</body>
</html>
`;
}

// 如果系统装有 Edge/Chrome，直接导出 2x 高清 PNG 文件备用
function tryExportHeadlessPng() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  if (!existsSync(edgePath)) return;

  const pairs = [
    { svg: join(ASSETS_DIR, "benchmark-radar.svg"), png: join(ASSETS_DIR, "benchmark-radar.png") },
    { svg: join(ASSETS_DIR, "benchmark-radar.zh.svg"), png: join(ASSETS_DIR, "benchmark-radar.zh.png") },
  ];

  for (const pair of pairs) {
    try {
      execFileSync(edgePath, [
        "--headless",
        `--screenshot=${pair.png}`,
        `--window-size=${WIDTH},${HEIGHT}`,
        "--hide-scrollbars",
        `file:///${pair.svg.replace(/\\/g, "/")}`,
      ], { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
}

// 主执行函数
function main() {
  mkdirSync(ASSETS_DIR, { recursive: true });

  const svgEn = generateSvg("en");
  const svgZh = generateSvg("zh");
  const html = generateHtml();

  const enPath = join(ASSETS_DIR, "benchmark-radar.svg");
  const zhPath = join(ASSETS_DIR, "benchmark-radar.zh.svg");
  const htmlPath = join(ASSETS_DIR, "benchmark-radar.html");

  writeFileSync(enPath, svgEn, "utf8");
  writeFileSync(zhPath, svgZh, "utf8");
  writeFileSync(htmlPath, html, "utf8");

  tryExportHeadlessPng();

  console.log(`Generated:
  - ${enPath}
  - ${zhPath}
  - ${htmlPath}
  - ${join(ASSETS_DIR, "benchmark-radar.png")}
  - ${join(ASSETS_DIR, "benchmark-radar.zh.png")}
`);
}

main();
