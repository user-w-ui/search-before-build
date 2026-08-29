// 双臂量化提取器 v3：硬指标 + 分臂引用口径
// - A 臂（baseline）：引用来自最终聊天答复
// - B 臂（plugin）：引用来自渲染简报（HTML brief 内嵌 payload 的 competitors[].url + sources[].url）
// 运行：node bench/metrics.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const RESULTS = join(ROOT, "bench", "results");

const CATALOGS = [
  ["api.github.com", "GitHub API"],
  ["registry.npmjs", "npm"],
  ["registry.modelcontextprotocol.io", "MCP Registry"],
  ["crates.io", "crates.io"],
  ["search.maven.org", "Maven Central"],
  ["repo1.maven.org", "Maven Central"],
  ["packages.ecosyste.ms", "Ecosyste.ms"],
  ["huggingface.co", "HF Hub"],
  ["export.arxiv.org", "arXiv"],
  ["hn.algolia.com", "HN Algolia"],
  ["html.duckduckgo.com", "DDG fallback"],
  ["lite.duckduckgo.com", "DDG fallback"],
];

const hasCJK = (t) => /[\u4e00-\u9fff]/.test(t) || /%E[4-9][0-9A-F]/i.test(t);
const hasLatin = (t) => /[a-zA-Z]{3,}/.test(t);

function parseLines(path) {
  try {
    return readFileSync(path, "utf8").split("\n").filter((l) => l.trim())
      .map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

function briefUrls(briefPath) {
  try {
    const html = readFileSync(briefPath, "utf8");
    const anchor = 'const encodedReport = "';
    const s = html.indexOf(anchor);
    if (s < 0) return { count: 0, distinct: 0 };
    const e = html.indexOf('"', s + anchor.length);
    const payload = JSON.parse(Buffer.from(html.slice(s + anchor.length, e), "base64").toString("utf8"));
    const urls = new Set();
    for (const c of payload.competitors || []) {
      if (c.url) urls.add(c.url);
      for (const src of c.sources || []) if (src.url) urls.add(src.url);
    }
    return { count: urls.size, distinct: urls.size };
  } catch { return { count: 0, distinct: 0 }; }
}

function analyze(lines, arm, briefPath) {
  const out = {
    totalToolUse: 0, byTool: {}, catalogHits: new Set(), catalogCalls: {},
    webSearch: 0, webFetch: 0, userTurns: 0, zhQ: 0, enQ: 0,
    chatUrls: 0, tasksAgents: 0,
  };
  let finalAnswer = "", lastLong = "";
  for (const line of lines) {
    const msg = line.message;
    if (!msg) continue;
    if (msg.role === "user") {
      const c = msg.content;
      const isText = Array.isArray(c) ? c[0]?.type === "text" : typeof c === "string" && c.trim().length > 0;
      if (isText) out.userTurns += 1;
      continue;
    }
    if (msg.role !== "assistant") continue;
    const content = msg.content;
    if (typeof content === "string") {
      if (content.length > 400) lastLong = content;
      if (/recommendation|建议/i.test(content) && content.length > finalAnswer.length) finalAnswer = content;
      continue;
    }
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (c.type === "text") {
        if (c.text.length > 400) lastLong = c.text;
        if (/recommendation|建议/i.test(c.text) && c.text.length > finalAnswer.length) finalAnswer = c.text;
        continue;
      }
      if (c.type !== "tool_use") continue;
      out.totalToolUse += 1;
      out.byTool[c.name] = (out.byTool[c.name] || 0) + 1;
      if (c.name === "WebSearch") {
        out.webSearch += 1;
        const q = c.input?.query || c.input?.searchTerm || "";
        if (hasCJK(q)) out.zhQ += 1; else if (hasLatin(q)) out.enQ += 1;
      }
      if (c.name === "WebFetch") { out.webFetch += 1; scan(c.input?.url, out); }
      if (c.name === "Task" || c.name === "Agent") out.tasksAgents += 1;
      if (c.name === "Bash" || c.name === "PowerShell") {
        const cmd = [c.input?.command, c.input?.script].filter(Boolean).join(" ");
        if (hasCJK(cmd)) out.zhQ += 1;
        else if (hasLatin(cmd)) out.enQ += 1;
        scan(cmd, out);
      }
    }
  }
  const chat = finalAnswer || lastLong;
  out.chatUrls = (chat.match(/https?:\/\/[^\s)\]]+/g) || []).length;
  const b = arm === "plugin" ? briefUrls(briefPath) : { count: 0, distinct: 0 };
  return { out, brief: b };
}

function scan(text, out) {
  if (!text) return;
  for (const [domain, label] of CATALOGS) {
    if (text.includes(domain)) {
      out.catalogHits.add(label);
      out.catalogCalls[label] = (out.catalogCalls[label] || 0) + 1;
    }
  }
}

const cases = readdirSync(RESULTS).filter((d) => d.startsWith("case-"));
console.log("case | arm | toolCalls | WebSearch | WebFetch | userTurns | zhQ | enQ | catalogDomains | refUrls(chat/brief) | Task/Agent");
for (const c of cases) {
  for (const [arm, sess, brief] of [
    ["baseline", join(RESULTS, c, "baseline", "session.jsonl"), null],
    ["plugin", join(RESULTS, c, "plugin", "artifacts", "session.jsonl"), join(RESULTS, c, "plugin", "artifacts", "brief.html")],
  ]) {
    const { out, brief: b } = analyze(parseLines(sess), arm, brief);
    const cats = [...out.catalogHits].sort().join("+") || "-";
    const refs = arm === "plugin" ? `brief:${b.count}` : `chat:${out.chatUrls}`;
    console.log(`${c} | ${arm} | ${out.totalToolUse} | ${out.webSearch} | ${out.webFetch} | ${out.userTurns} | ${out.zhQ} | ${out.enQ} | ${cats} | ${refs} | ${out.tasksAgents}`);
  }
}
