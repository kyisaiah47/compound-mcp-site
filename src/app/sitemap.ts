import type { MetadataRoute } from 'next';
export const ROUTES = ['/'] as const;
export default function sitemap(): MetadataRoute.Sitemap { return ROUTES.map((path) => ({ url: `https://compound-mcp.thecompound.tech${path}`, lastModified: new Date('2026-09-28') })); }
