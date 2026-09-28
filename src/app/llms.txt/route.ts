import { PRODUCT } from '@/lib/product';
import { TOOLS } from '@/lib/surface';
export function GET() { const body = [`# ${PRODUCT.displayName}`, '', PRODUCT.description, '', `Install: ${PRODUCT.install}`, `Repository: ${PRODUCT.repo}`, '', '## Tools', ...TOOLS.map((tool) => `- ${tool.name}: ${tool.title}`), ''].join('\n'); return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } }); }
