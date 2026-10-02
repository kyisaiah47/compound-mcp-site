import { PRODUCT } from '@/lib/product';
import { TOOLS } from '@/lib/surface';
export function GET() { const body = [`# ${PRODUCT.displayName}`, '', PRODUCT.description, '', `Install: ${PRODUCT.install}`, `Repository: ${PRODUCT.repo}`, '', '## Guide', '- What is a read-only MCP server? https://openlookup.thecompound.tech/guides/what-is-a-read-only-mcp-server', '', '## Tools', ...TOOLS.map((tool) => `- ${tool.name}: ${tool.title}`), ''].join('\n'); return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } }); }
