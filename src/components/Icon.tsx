import { GLYPH, type GlyphName } from '@/lib/phosphor';
export default function Icon({ name, size = 16 }: { name: GlyphName; size?: number }) { return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 256 256" fill="currentColor" dangerouslySetInnerHTML={{ __html: GLYPH[name] }} />; }
