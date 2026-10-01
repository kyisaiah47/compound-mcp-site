# Compound Labs MCP site: Simple view review

Built on `main` on 2026-10-01. Blueprint: `compound-ops/standards/SIMPLE-VIEW-BLUEPRINT.md`.

## Truth map (2.A)

| Item | Source fact |
| --- | --- |
| Primary user | A person who runs an MCP client and wants current answers instead of answers from training data. |
| Problem | Pricing, routing, maintenance and directory facts change after a model's cutoff. |
| Input | No form. The first action is one command, `PRODUCT.install` (`npx -y compound-mcp`). |
| Output | Read-only lookup tools from `lib/surface.ts` `TOOLS`, captured from the server's own `tools/list`. Answers come back in `content` and `structuredContent`. |
| Free and paid | Free. No credentials ("No credentials required. Read-only.", src/server.js). There is no paid step. |
| Limits | A clear result covers only the lists a tool checked (src/server.js). |
| Permissions | None. The site sends nothing. |
| Recovery | The new 404 page. |

How it differs from CiteRank: there is no check to run. The action card holds the server command and a copy button. The example is one tool from the captured list, in a sentence with where it reads from, and its description and inputs behind disclosures. One tool reads a raw database host; Simple names the index its own description names instead of the host.

## Route inventory (2.E)

| Route | Treatment |
| --- | --- |
| `/` | Curated Simple: hero, install card, one tool (themed listbox), what it costs, next steps. The Console tool track and filters stay in Console. |
| `/guides/what-is-a-read-only-mcp-server`, `/guides/how-to-check-mcp-tool-safely` | Readable adaptation: the guide's own text in Simple chrome. The Console guides gained a view-control footer. |
| 404 | New `not-found.tsx` in both views. |
| `/llms.txt`, `/robots.txt`, `/sitemap.xml`, `/opengraph-image` | Unchanged. |

## Verification

- `npx tsc --noEmit`, `npm run check` (register gate) and `npm run build` pass.
- `node scripts/verify-simple.mjs http://localhost:3312 compound-mcp-site`: 28 of 28 (welcome, view state, listbox keyboard and focus, inert disclosure, chrome and overflow on 4 routes at 1440 and 390).
- Not verified: the clipboard copy in a real browser session.
