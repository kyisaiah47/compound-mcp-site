"use client";
import { useState } from "react";
import NumberFlow from "@number-flow/react";
import { PRODUCT, SOURCES } from "@/lib/product";
import { TOOLS, type ToolRow } from "@/lib/surface";
type ToolGroup = 'stale' | 'directory' | 'compliance';
import Icon from "@/components/Icon";
import PageViews from "@/components/site-view/PageViews";
import ViewControls from "@/components/site-view/ViewControls";
import SimpleHome from "@/components/site-view/SimpleHome";
import { SimpleFrame } from "@/components/site-view/SimpleChrome";
const groups: {
  key: ToolGroup;
  label: string;
  icon: "clock-countdown" | "books" | "seal-check";
}[] = [
  { key: "stale", label: "Things that go stale", icon: "clock-countdown" },
  { key: "directory", label: "Directories", icon: "books" },
  { key: "compliance", label: "Compliance", icon: "seal-check" },
];
function ToolRowView({
  tool,
  selected,
  onSelect,
}: {
  tool: ToolRow;
  selected: boolean;
  onSelect: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(tool.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <article className={`tool ${selected ? "tool--selected" : ""}`}>
      <button
        className="tool__head"
        onClick={onSelect}
        aria-expanded={selected}
      >
        <span className="tool__name">
          <Icon name="plugs-connected" size={17} />
          {tool.name}
        </span>
        <span className="tool__title">{tool.title}</span>
        <span className="tool__host">{tool.endpoint.host}</span>
        <span className="tool__arrow">
          <Icon name="caret-right" size={15} />
        </span>
      </button>
      <div className="tool__summary">
        <span>{tool.description}</span>
        <span className="badge">
          <Icon name="check" size={12} /> read only
        </span>
        <button
          className="copy"
          onClick={copy}
          aria-label={`Copy ${tool.name}`}
        >
          {copied ? "copied" : <Icon name="copy" size={14} />}
        </button>
      </div>
      {selected && (
        <div className="tool__detail">
          <div>
            <p className="eyebrow">Takes</p>
            <div className="args">
              {tool.args.map((arg) => (
                <div className="arg" key={arg.name}>
                  <code>{arg.name}</code>
                  <span>
                    {arg.type}
                    {arg.required ? " · required" : " · optional"}
                  </span>
                  <small>{arg.describe}</small>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Returns</p>
            <p className="return-copy">
              JSON in <code>content</code> for older clients and{" "}
              <code>structuredContent</code> for clients that support it. The
              result is bounded to an answer-sized payload.
            </p>
          </div>
          <div>
            <p className="eyebrow">Boundary</p>
            <p className="return-copy">
              Reads{" "}
              <a
                href={`https://${tool.endpoint.host}`}
                target="_blank"
                rel="noreferrer"
              >
                {tool.endpoint.host}
              </a>
              . It does not write, delete, or require credentials.
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="eyebrow">Source ledger</p>
        <p className="footer__source">
          Every product claim on this page is recorded in{" "}
          <code>src/lib/product.ts</code>.
        </p>
        <div className="source-list">
          {SOURCES.map((source) => (
            <a
              href={source.url}
              key={source.quote}
              target="_blank"
              rel="noreferrer"
            >
              “{source.quote}”{" "}
              <span>
                {source.cite} · {source.read_at}
              </span>
            </a>
          ))}
        </div>
      </div>
      <div className="credit">
        <span>Built by</span>
        <img
          className="studio-credit-mark"
          src="/brand/compound-labs.svg"
          alt="Compound Labs"
          width={20}
          height={20}
        />
        <p>© 2026 {PRODUCT.displayName}. A Compound Labs product.</p>
        <a href="mailto:hello@thecompound.tech">hello@thecompound.tech</a>
      </div>
      <div className="foot-view">
        <ViewControls />
      </div>
    </footer>
  );
}
export default function Home() {
  return (
    <PageViews
      simpleView={
        <SimpleFrame>
          <SimpleHome />
        </SimpleFrame>
      }
      consoleView={<ConsoleHome />}
    />
  );
}
function ConsoleHome() {
  const [activeGroup, setActiveGroup] = useState<ToolGroup | "all">("all");
  const [selected, setSelected] = useState<string | null>(null);
  const visible =
    activeGroup === "all"
      ? TOOLS
      : TOOLS.filter((tool) => tool.group === activeGroup);
  return (
    <>
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand-mark">
            <img src="/icon.svg" alt="" width={22} height={22} />
          </span>
          <span>{PRODUCT.displayName}</span>
        </a>
        <span className="divider" />
        <span className="strap">READ-ONLY LOOKUPS, LIVE PUBLIC DATA</span>
        <nav>
          <a className="nav-active" href="#tools">
            Surface
          </a>
          <a href={PRODUCT.repo} target="_blank" rel="noreferrer">
            <Icon name="github-logo" size={15} /> Repository
          </a>
          <a href={PRODUCT.npm} target="_blank" rel="noreferrer">
            <Icon name="package" size={15} /> npm
          </a>
        </nav>
        <span className="release">
          <i /> v{PRODUCT.version}
        </span>
      </header>
      <div className="ticker">
        <span>
          <b>{TOOLS.length}</b> tools
        </span>
        <span>
          <b>3</b> groups
        </span>
        <span>
          <b>0</b> credentials
        </span>
        <span>
          <b>1</b> transport
        </span>
        <span className="ticker__right">
          MCP name <b>{PRODUCT.mcpName}</b>
        </span>
      </div>
      <main id="top" className="frame">
        <aside className="rail rail--left">
          <p className="eyebrow">The surface</p>
          <h1>{PRODUCT.subhead}</h1>
          <p className="rail-copy">
            {PRODUCT.description} The package reads public endpoints and returns
            a structured result.
          </p>
          <div className="filters">
            <button
              className={
                activeGroup === "all" ? "filter filter--active" : "filter"
              }
              onClick={() => setActiveGroup("all")}
            >
              <span>All tools</span>
              <b>{TOOLS.length}</b>
            </button>
            {groups.map((group) => (
              <button
                className={
                  activeGroup === group.key ? "filter filter--active" : "filter"
                }
                key={group.key}
                onClick={() => setActiveGroup(group.key)}
              >
                <span>
                  <Icon name={group.icon} size={15} /> {group.label}
                </span>
                <b>{TOOLS.filter((tool) => tool.group === group.key).length}</b>
              </button>
            ))}
          </div>
          <div className="install">
            <p className="eyebrow">Install</p>
            <code>{PRODUCT.install}</code>
            <a href="#install">
              copy command <Icon name="caret-right" size={13} />
            </a>
          </div>
        </aside>
        <section className="track" id="tools">
          <div className="section-head">
            <div>
              <p className="eyebrow">Tool surface · <NumberFlow value={visible.length} /> shown</p>
              <h2>What an agent can ask.</h2>
            </div>
            <span className="head-note">
              <Icon name="pulse" size={15} /> public endpoints <i />
            </span>
          </div>
          <div className="tools">
            {visible.map((tool) => (
              <ToolRowView
                key={tool.name}
                tool={tool}
                selected={selected === tool.name}
                onSelect={() =>
                  setSelected(selected === tool.name ? null : tool.name)
                }
              />
            ))}
          </div>
        </section>
        <aside className="rail rail--right">
          <div className="fact">
            <p className="eyebrow">Protocol</p>
            <strong>stdio</strong>
            <p>
              The package also exposes optional streamable HTTP on a loopback
              port.
            </p>
          </div>
          <div className="fact">
            <p className="eyebrow">Every call</p>
            <ul>
              <li>
                <Icon name="check" size={14} /> read only
              </li>
              <li>
                <Icon name="check" size={14} /> idempotent
              </li>
              <li>
                <Icon name="check" size={14} /> open world
              </li>
              <li>
                <Icon name="prohibit" size={14} /> no API key
              </li>
            </ul>
          </div>
          <div className="fact">
            <p className="eyebrow">Answers go stale</p>
            <p>
              Pricing, routing, maintenance, and directory records are live
              data. A receipt or date travels with the results where the package
              provides one.
            </p>
          </div>
          <div className="fact fact--boundary">
            <p className="eyebrow">Read the source</p>
            <a href={PRODUCT.repo} target="_blank" rel="noreferrer">
              <Icon name="github-logo" size={15} /> GitHub repository{" "}
              <Icon name="arrow-square-out" size={13} />
            </a>
            <a href={PRODUCT.npm} target="_blank" rel="noreferrer">
              <Icon name="package" size={15} /> npm package{" "}
              <Icon name="arrow-square-out" size={13} />
            </a>
          </div>
        </aside>
      </main>
      <section className="install-strip" id="install">
        <div>
          <p className="eyebrow">One command, no account</p>
          <code>{PRODUCT.install}</code>
        </div>
        <a
          className="button"
          href={PRODUCT.repo}
          target="_blank"
          rel="noreferrer"
        >
          Read the package <Icon name="arrow-square-out" size={15} />
        </a>
      </section>
      <Footer />
    </>
  );
}
