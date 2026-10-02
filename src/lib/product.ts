export const PRODUCT = {
  name: "openlookup",
  displayName: "OpenLookup",
  version: "0.5.1",
  host: "openlookup.thecompound.tech",
  repo: "https://github.com/kyisaiah47/openlookup",
  npm: "https://www.npmjs.com/package/openlookup",
  mcpName: "tech.thecompound/openlookup",
  install: "npx -y openlookup",
  description: "Eleven read-only lookup tools backed by live public data.",
  subhead: "Current answers for questions that go stale.",
} as const;

export const SOURCES = [
  {
    quote: "Eleven read-only lookup tools backed by live public data",
    cite: "README.md",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/README.md",
    read_at: "2026-09-28",
  },
  {
    quote:
      "Most of these answer questions that a model cannot answer correctly from a training cutoff, because the underlying fact changed after it.",
    cite: "README.md",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/README.md",
    read_at: "2026-09-28",
  },
  {
    quote:
      "Every one of them is a real lookup an agent currently resolves by guessing from training data or by scraping a search page.",
    cite: "src/directories.js",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/src/directories.js",
    read_at: "2026-09-28",
  },
  {
    quote:
      "Every tool returns both content (the text an older client reads) and structuredContent (what a client that supports it parses).",
    cite: "src/directories.js",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/src/directories.js",
    read_at: "2026-09-28",
  },
  {
    quote: "No credentials required. Read-only.",
    cite: "src/server.js",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/src/server.js",
    read_at: "2026-09-28",
  },
  {
    quote:
      "A clear result means the EIN is absent from those lists. It is not a statement that the organization was never revoked, and no other state registry is consulted.",
    cite: "src/server.js",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/src/server.js",
    read_at: "2026-09-28",
  },
  {
    quote:
      "A grade describes the pages listed in pages_scanned as they were on scanned_at, not the site as it stands now.",
    cite: "src/server.js",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/src/server.js",
    read_at: "2026-09-28",
  },
  {
    quote: "The server runs via npx.",
    cite: "package.json",
    url: "https://github.com/kyisaiah47/openlookup/blob/main/package.json",
    read_at: "2026-09-28",
  },
] as const;
