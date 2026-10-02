import type { Metadata } from "next";
import Link from "next/link";
import PageViews from "@/components/site-view/PageViews";
import ViewControls from "@/components/site-view/ViewControls";
import { SimpleFrame } from "@/components/site-view/SimpleChrome";

export const metadata: Metadata = {
  title: "What Is a Read-Only MCP Server?",
  description: "This guide explains read-only MCP tools, their boundaries, and how to try OpenLookup.",
  alternates: { canonical: "/guides/what-is-a-read-only-mcp-server" },
};

const specUrl = "https://modelcontextprotocol.io/specification/2025-06-18/server/tools";

export default function ReadOnlyMcpGuide() {
  const body = (
    <>
      <Link className="guide__back" href="/">← OpenLookup</Link>
      <p className="eyebrow">Guide · updated 2026-09-29</p>
      <h1>What is a read-only MCP server?</h1>
      <p className="guide__lead">A read-only MCP server gives an AI application tools for retrieving information. Those tools cannot create, edit, or delete records. OpenLookup is a read-only example backed by public data. You install it with <code>npx -y openlookup</code>. An MCP client can then call eleven lookup tools.</p>

      <h2>What does MCP let a server expose?</h2>
      <p>The official MCP specification says that tools let language models interact with external systems, including querying databases, calling APIs, and performing computations. Each tool has a name, description, and input schema. A client discovers them with <code>tools/list</code> and invokes one with <code>tools/call</code>. <a href={specUrl}>Read the MCP tools specification</a>.</p>

      <h2>What makes an MCP tool read-only?</h2>
      <p>A read-only tool has a retrieval boundary: it accepts lookup inputs and returns a result, but it does not expose write, delete, or mutation operations. That boundary reduces the action surface, but it is not a complete security guarantee. The MCP specification says clients should treat tool annotations as untrusted unless they come from a trusted server and should show inputs before sensitive calls.</p>
      <ol>
        <li>Inspect the tool name, description, and input schema.</li>
        <li>Confirm that the requested operation is a lookup, not a mutation.</li>
        <li>Check the returned receipt, date, and coverage limits before relying on the answer.</li>
      </ol>

      <h2>OpenLookup answer format</h2>
      <p>OpenLookup exposes eleven read-only lookup tools. The tools cover stale facts, directories, and compliance. The package returns text in <code>content</code> for compatibility. It returns structured data in <code>structuredContent</code> for clients that support it. The landing page lists each tool, its arguments, its public data boundary, and whether it requires credentials.</p>

      <h2>How do I try a read-only MCP server?</h2>
      <p>You run <code>npx -y openlookup</code> from an MCP client that supports local servers. You start with one narrow lookup. You inspect the returned source and checked time. A clear or passing result provides scoped evidence. It is not a universal compliance conclusion. The tool output is current for the source it checked. It does not promise coverage of every related record.</p>

      <footer className="guide__sources"><span className="eyebrow">Sources fetched 2026-09-29</span><a href={specUrl}>Model Context Protocol specification: Tools</a><a href="https://github.com/kyisaiah47/openlookup/blob/main/README.md">OpenLookup README</a></footer>
    </>
  );
  return (
    <PageViews
      simpleView={
        <SimpleFrame>
          <div className="sv-page">
            <div className="sv-guide">{body}</div>
            <nav className="sv-home-links" aria-label="Next steps">
              <Link href="/#start">Copy the server command ↗</Link>
              <Link href="/#example">See what each tool answers ↗</Link>
              <a href="https://github.com/kyisaiah47/openlookup" target="_blank" rel="noreferrer">Read the source ↗</a>
            </nav>
          </div>
        </SimpleFrame>
      }
      consoleView={
        <>
          <main className="guide">{body}</main>
          <div className="foot-view">
            <ViewControls />
          </div>
        </>
      }
    />
  );
}
