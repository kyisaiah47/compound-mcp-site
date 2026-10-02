'use client';

/* THE SIMPLE HOME. The outcome, the install command, one tool explained, what it costs, next
 * steps. Tools come from lib/surface.ts, which scripts/capture.mjs writes from the server's own
 * tools/list. Claims come from lib/product.ts. */
import Link from 'next/link';
import { PRODUCT } from '@/lib/product';
import { SURFACE_CAPTURED_AT, TOOLS } from '@/lib/surface';
import CopyCommand from './CopyCommand';
import Disclosure from './Disclosure';
import ThemedSelect from './ThemedSelect';
import { useViewState } from './SiteViewProvider';

const GROUP: Record<string, string> = {
  stale: 'Things that go stale',
  directory: 'Directories',
  compliance: 'Compliance',
};

/** Where a tool reads. A raw database host is named by the index the tool's own description names. */
function source(t: (typeof TOOLS)[number]): string {
  if (!t.endpoint.host.endsWith('.supabase.co')) return t.endpoint.host;
  const named = /in the ([A-Z][^.]*? Index)/.exec(t.description)?.[1];
  return named ? `the ${named}` : 'a public index';
}

export default function SimpleHome() {
  const [name, setName] = useViewState<string>('simple:tool', TOOLS[0].name);
  const tool = TOOLS.find((t) => t.name === name) ?? TOOLS[0];

  return (
    <div className="sv-home">
      <section className="sv-hero">
        <div className="sv-pitch">
          <span className="sv-eyebrow">READ-ONLY LOOKUPS · LIVE PUBLIC DATA</span>
          <h1>{PRODUCT.subhead}</h1>
          <p>
            {PRODUCT.displayName} provides an MCP client {TOOLS.length} read-only lookup tools backed by live
            public data. The package reads public endpoints and returns a structured result.
          </p>
          <div className="sv-qualifier">The server requires no credentials and only reads data. It is version {PRODUCT.version}.</div>
        </div>

        <div className="sv-card" id="start">
          <div className="sv-step">
            <span>01 / ADD THE SERVER</span>
            <span>STDIO</span>
          </div>
          <h2>Add it to your MCP client.</h2>
          <p className="sv-card-sub">Add this command as a local server to any MCP client that runs one.</p>
          <CopyCommand command={PRODUCT.install} label="Server command" />
          <p className="sv-terms">The server needs no account or API key and runs through npx.</p>
        </div>
      </section>

      <section className="sv-section" id="example" aria-live="polite">
        <div className="sv-section-intro">
          <div>
            <span className="sv-eyebrow">02 / WHAT AN AGENT CAN ASK</span>
            <h2>Tools run one at a time.</h2>
          </div>
          <p>Pick a tool to see what it answers, what it needs, and where it reads data from.</p>
        </div>
        <div className="sv-result">
          <div className="sv-step">
            <span>EXAMPLE · ONE TOOL</span>
            <span>{tool.name}</span>
          </div>
          <ThemedSelect
            label="Tool"
            options={TOOLS.map((t) => ({ value: t.name, label: t.title }))}
            value={tool.name}
            onChange={setName}
          />
          <div className="sv-result-summary">
            <h3>{tool.title}.</h3>
            <p>
              It reads {source(tool)}. It does not write or delete data and requires no credentials.
            </p>
          </div>
          <Disclosure title="What the tool says it does">
            <p>{tool.description}</p>
          </Disclosure>
          <Disclosure title="What the call needs">
            <dl className="sv-facts">
              {tool.args.map((a) => (
                <div key={a.name}>
                  <dt>
                    <code>{a.name}</code>, {a.required ? 'required' : 'optional'}
                  </dt>
                  <dd>{a.describe}</dd>
                </div>
              ))}
              <div>
                <dt>Group</dt>
                <dd>{GROUP[tool.group]}</dd>
              </div>
            </dl>
            <p>
              The answer comes back as JSON in content for older clients and in structuredContent for clients that
              support it.
            </p>
          </Disclosure>
          <p className="sv-note">
            This describes one tool from the server&rsquo;s own tool list, captured {SURFACE_CAPTURED_AT.slice(0, 10)}.
            Nothing was looked up.
          </p>
        </div>
      </section>

      <section className="sv-section" id="cost">
        <div className="sv-section-intro">
          <div>
            <span className="sv-eyebrow">03 / WHAT IT COSTS</span>
            <h2>It is free.</h2>
          </div>
          <p>You need no account, key, or paid step. The package is on npm and GitHub.</p>
        </div>
        <div className="sv-cards">
          <div>
            <h3>No credentials.</h3>
            <p>Every tool reads public data. You do not sign up or paste a key.</p>
          </div>
          <div>
            <h3>Read only.</h3>
            <p>Every call is read only and idempotent. No tool writes or deletes anything.</p>
          </div>
          <div>
            <h3>Results carry a date.</h3>
            <p>Where the package provides one, results include a receipt or date.</p>
          </div>
        </div>
      </section>

      <nav className="sv-home-links" aria-label="Next steps">
        <Link href="/guides/what-is-a-read-only-mcp-server">Read-only MCP server ↗</Link>
        <Link href="/guides/how-to-check-mcp-tool-safely">Check an MCP tool first ↗</Link>
        <a href={PRODUCT.repo} target="_blank" rel="noreferrer">
          Read the source ↗
        </a>
      </nav>
    </div>
  );
}
