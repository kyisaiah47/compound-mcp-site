#!/usr/bin/env node
/* CAPTURE THE TOOL SURFACE FROM THE SERVER ITSELF.
 *
 *   npm run capture
 *
 * The subject of this site is an MCP server, and an MCP server's surface is the answer it gives
 * to `tools/list`. So this spawns the real binary over stdio, completes the handshake, asks for
 * the list, and freezes the reply into src/lib/surface.ts. A page that retypes a tool name, an
 * argument or a description drifts from the server the first release after somebody edits one,
 * and nothing errors when it does: the page still looks like a tool list.
 *
 * NO TOOL IS CALLED. This asks for the catalogue and nothing else. Every tool on this server is
 * an unauthenticated GET against a public endpoint, so calling one spends no key, and it still
 * is not this script's job: a capture that hit ten live upstreams would be a health probe, and
 * the package already ships one.
 *
 * It writes a MODULE, not a data file. The Cloudflare Worker this site deploys to has no
 * filesystem, so a JSON file read at request time is a file that exists in development and does
 * not exist in production.
 *
 * Three things fail closed rather than writing a thinner capture:
 *   1. a tools/list that returns nothing, or fewer tools than the last capture held
 *   2. a tool whose input schema is missing, so the page would print a tool that takes nothing
 *   3. a tool whose upstream endpoint cannot be resolved out of the server's own source
 */
import { spawn } from 'node:child_process';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PKG_DIR = process.env.COMPOUND_MCP_DIR || resolve(ROOT, '..', 'compound-mcp');
const OUT = resolve(ROOT, 'src/lib/surface.ts');

if (!existsSync(resolve(PKG_DIR, 'bin/compound-mcp.js'))) {
  throw new Error(`the package is not at ${PKG_DIR}. Set COMPOUND_MCP_DIR.`);
}

/* ── 1. tools/list, over the real stdio transport ─────────────────────────────────────── */
const rpc = () =>
  new Promise((done, bad) => {
    const p = spawn(process.execPath, ['bin/compound-mcp.js'], { cwd: PKG_DIR, stdio: ['pipe', 'pipe', 'pipe'] });
    const send = (o) => p.stdin.write(JSON.stringify(o) + '\n');
    let buf = '';
    let init = null;
    const timer = setTimeout(() => {
      p.kill();
      bad(new Error('the server did not answer tools/list within 30 seconds'));
    }, 30_000);
    p.stdout.on('data', (d) => {
      buf += d.toString();
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.trim()) continue;
        let m;
        try { m = JSON.parse(line); } catch { continue; }
        if (m.id === 1) {
          init = m.result;
          send({ jsonrpc: '2.0', method: 'notifications/initialized' });
          send({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
        }
        if (m.id === 2) {
          clearTimeout(timer);
          p.kill();
          done({ init, tools: m.result?.tools ?? [] });
        }
      }
    });
    p.on('error', (e) => { clearTimeout(timer); bad(e); });
    send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'compound-mcp-site capture', version: '1' } },
    });
  });

const { init, tools } = await rpc();
if (!tools.length) throw new Error('tools/list returned nothing');

const previous = existsSync(OUT) ? Number(/TOOL_COUNT = (\d+)/.exec(readFileSync(OUT, 'utf8'))?.[1] || 0) : 0;
if (previous && tools.length < previous) {
  throw new Error(`tools/list returned ${tools.length}, and the last capture held ${previous}. A capture never shrinks silently.`);
}
for (const t of tools) {
  if (!t.inputSchema || typeof t.inputSchema !== 'object') throw new Error(`${t.name} advertises no input schema`);
}

/* ── 2. the endpoint each tool reads, out of the server's own source ──────────────────── */
const dirSrc = readFileSync(resolve(PKG_DIR, 'src/directories.js'), 'utf8');
const srvSrc = readFileSync(resolve(PKG_DIR, 'src/server.js'), 'utf8');
const API = Object.fromEntries(
  [...(/export const API = \{([\s\S]*?)\n\};/.exec(dirSrc)?.[1] ?? '').matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1], m[2]]),
);
const CONST = Object.fromEntries(
  [...srvSrc.matchAll(/export const (SB_URL|GS_API|CB_SITE) = '([^']+)';/g)].map((m) => [m[1], m[2]]),
);

/** The block of source that registers one tool, from its name to the next registration. */
function blockFor(name) {
  for (const src of [dirSrc, srvSrc]) {
    const at = src.indexOf(`'${name}',`);
    if (at < 0) continue;
    const next = src.indexOf('\n  tool(', at);
    return src.slice(at, next < 0 ? src.length : next);
  }
  return '';
}

/** The body of the named async function, for a registration whose handler delegates to one. */
function bodyOf(fn) {
  const at = srvSrc.indexOf(`async function ${fn}(`);
  if (at < 0) return '';
  const next = srvSrc.indexOf('\nasync function ', at + 1);
  return srvSrc.slice(at, next < 0 ? srvSrc.length : next);
}

function endpointFor(name) {
  /* A registration either builds its own URL inline, as the nine directory tools do, or hands
   * off to a named function, as the two compliance tools do. Reading only the registration
   * block resolved nine of eleven and reported two tools with no upstream, which is the whole
   * reason this refuses to write rather than filing them as unknown. */
  const block = blockFor(name);
  const delegate = /=>\s*(\w+)\(/.exec(block)?.[1] ?? '';
  const text = block + (delegate ? bodyOf(delegate) : '');
  const viaApi = /\$\{API\.(\w+)\}/.exec(text);
  if (viaApi && API[viaApi[1]]) return { host: new URL(API[viaApi[1]]).host, base: API[viaApi[1]], key: viaApi[1] };
  if (/\$\{SB_URL\}/.test(text) && CONST.SB_URL) return { host: new URL(CONST.SB_URL).host, base: `${CONST.SB_URL}/rest/v1/cb_ada_scans`, key: 'civicbinder' };
  if (/GS_API/.test(text) && CONST.GS_API) return { host: new URL(CONST.GS_API).host, base: CONST.GS_API, key: 'goodstanding' };
  return null;
}

/* ── 3. the group each tool sits in, out of the README's own headings ─────────────────── */
const readme = readFileSync(resolve(PKG_DIR, 'README.md'), 'utf8');
const GROUP_HEADS = { 'Things that go stale': 'stale', Directories: 'directory', Compliance: 'compliance' };
const names = new Set(tools.map((t) => t.name));
const group = {};
let current = null;
for (const line of readme.split('\n')) {
  const head = /^###\s+(.+?)\s*$/.exec(line);
  if (head && GROUP_HEADS[head[1]]) { current = GROUP_HEADS[head[1]]; continue; }
  if (!current) continue;
  for (const m of line.matchAll(/`([a-z_]+)[(`]/g)) if (names.has(m[1]) && !group[m[1]]) group[m[1]] = current;
}

const missingGroup = tools.filter((t) => !group[t.name]).map((t) => t.name);
if (missingGroup.length) throw new Error(`the README lists no group for ${missingGroup.join(', ')}`);
const missingEndpoint = tools.filter((t) => !endpointFor(t.name)).map((t) => t.name);
if (missingEndpoint.length) throw new Error(`no upstream endpoint resolved for ${missingEndpoint.join(', ')}`);

/* ── 4. the last health run, written by the package's own probe ───────────────────────── */
const receiptPath = resolve(PKG_DIR, 'ops/health/receipts/latest.local.json');
if (!existsSync(receiptPath)) throw new Error('the package has written no local health receipt');
const r = JSON.parse(readFileSync(receiptPath, 'utf8'));
const probe = {
  checked_at: r.checked_at,
  repo_version: r.repo_version,
  protocol_version: r.signals.initialize.protocol_version,
  server_version: r.signals.initialize.server_version,
  tool_count: r.signals.tools_list.tool_count,
  endpoints_checked: r.signals.reachable.checked,
  endpoints_failed: r.signals.reachable.failed_count,
  duration_ms: r.duration_ms,
  failing: r.failing,
  endpoints: r.signals.reachable.probes.map((p) => ({ name: p.name, url: p.url, http: p.http, bytes: p.bytes, ms: p.ms, ok: p.ok })),
  outcomes: r.signals.tool_outcome.probes.map((p) => ({ tool: p.tool, ms: p.ms, ok: p.ok })),
};

/* ── 5. write the module ──────────────────────────────────────────────────────────────── */
const rows = tools.map((t) => {
  const s = t.inputSchema;
  const required = new Set(s.required ?? []);
  return {
    name: t.name,
    title: t.title ?? t.annotations?.title ?? t.name,
    description: t.description ?? '',
    group: group[t.name],
    endpoint: endpointFor(t.name),
    annotations: {
      readOnlyHint: t.annotations?.readOnlyHint === true,
      destructiveHint: t.annotations?.destructiveHint === true,
      idempotentHint: t.annotations?.idempotentHint === true,
      openWorldHint: t.annotations?.openWorldHint === true,
    },
    args: Object.entries(s.properties ?? {}).map(([k, v]) => ({
      name: k,
      type: v.type ?? 'string',
      required: required.has(k),
      describe: v.description ?? '',
    })),
    additionalProperties: s.additionalProperties === true,
  };
});

const banner =
  `// GENERATED by scripts/capture.mjs. Do not edit.\n` +
  `//\n` +
  `// Every string below is the server's own answer to tools/list over stdio, or a field of the\n` +
  `// receipt its own health probe wrote. Nothing here was typed by hand, and the punctuation is\n` +
  `// the package's, which is why scripts/check-register.mjs exempts this one file from the dash\n` +
  `// rule by identity.\n` +
  `//\n` +
  `// Captured from ${PKG_DIR}\n`;

const body =
  banner +
  `export const SURFACE_CAPTURED_AT = ${JSON.stringify(new Date().toISOString())};\n` +
  `export const SERVER = ${JSON.stringify({ name: init?.serverInfo?.name, version: init?.serverInfo?.version, protocol: init?.protocolVersion }, null, 1)} as const;\n` +
  `export const TOOL_COUNT = ${tools.length};\n` +
  `export type ToolArg = { name: string; type: string; required: boolean; describe: string };\n` +
  `export type ToolRow = {\n` +
  `  name: string; title: string; description: string;\n` +
  `  group: 'stale' | 'directory' | 'compliance';\n` +
  `  endpoint: { host: string; base: string; key: string };\n` +
  `  annotations: { readOnlyHint: boolean; destructiveHint: boolean; idempotentHint: boolean; openWorldHint: boolean };\n` +
  `  args: ToolArg[]; additionalProperties: boolean;\n` +
  `};\n` +
  `export const TOOLS: ToolRow[] = ${JSON.stringify(rows, null, 1)};\n` +
  `export const PROBE = ${JSON.stringify(probe, null, 1)} as const;\n`;

writeFileSync(OUT, body);
process.stdout.write(
  `${tools.length} tools captured from ${init?.serverInfo?.name} ${init?.serverInfo?.version} ` +
    `over protocol ${init?.protocolVersion}\n` +
    rows.map((t) => `  ${t.name.padEnd(30)} ${t.group.padEnd(11)} ${t.args.filter((a) => a.required).length} required, ${t.args.length} total  ${t.endpoint.host}\n`).join('') +
    `\nprobe ${probe.checked_at}: ${probe.endpoints_checked - probe.endpoints_failed} of ${probe.endpoints_checked} endpoints answered\n` +
    `wrote src/lib/surface.ts\n`,
);
