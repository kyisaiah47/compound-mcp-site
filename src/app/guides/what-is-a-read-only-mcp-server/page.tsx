import type { Metadata } from "next";
import Link from "next/link";
import PageViews from "@/components/site-view/PageViews";
import ViewControls from "@/components/site-view/ViewControls";
import { SimpleFrame } from "@/components/site-view/SimpleChrome";

export const metadata: Metadata = {
  title: "What Is a Read-Only MCP Server?",
  description: "A practical guide to read-only MCP tools, their boundaries, and how to try Compound Labs MCP.",
  alternates: { canonical: "/guides/what-is-a-read-only-mcp-server" },
};

const specUrl = "https://modelcontextprotocol.io/specification/2025-06-18/server/tools";

export default function ReadOnlyMcpGuide() {
  const body = (
    <>
      <Link className="guide__back" href="/">← Compound Labs MCP</Link>
      <p className="eyebrow">Guide · updated 2026-09-29</p>
      <h1>What is a read-only MCP server?</h1>
      <p className="guide__lead">A read-only MCP server gives an AI application tools for retrieving information without giving those tools permission to create, edit, or delete records. Compound Labs MCP is a small example: install it with <code>npx -y compound-mcp</code>, then let an MCP client call eleven lookup tools backed by public data.</p>

      <h2>What does MCP let a server expose?</h2>
      <p>The official MCP specification says that tools let language models interact with external systems, including querying databases, calling APIs, and performing computations. Each tool has a name, description, and input schema. A client discovers them with <code>tools/list</code> and invokes one with <code>tools/call</code>. <a href={specUrl}>Read the MCP tools specification</a>.</p>

      <h2>What makes an MCP tool read-only?</h2>
      <p>A read-only tool has a retrieval boundary: it accepts lookup inputs and returns a result, but it does not expose write, delete, or mutation operations. That boundary reduces the action surface, but it is not a complete security guarantee. The MCP specification says clients should treat tool annotations as untrusted unless they come from a trusted server and should show inputs before sensitive calls.</p>
      <ol>
        <li>Inspect the tool name, description, and input schema.</li>
        <li>Confirm that the requested operation is a lookup, not a mutation.</li>
        <li>Check the returned receipt, date, and coverage limits before relying on the answer.</li>
      </ol>

      <h2>How does Compound Labs MCP return an answer?</h2>
      <p>Compound Labs MCP exposes eleven read-only lookup tools in three groups: stale facts, directories, and compliance. The package returns text in <code>content</code> for compatibility and structured data in <code>structuredContent</code> for clients that support it. The landing page lists each tool, its arguments, its public data boundary, and whether it requires credentials.</p>

      <h2>How do I try a read-only MCP server?</h2>
      <p>Run <code>npx -y compound-mcp</code> from an MCP client that supports local servers. Start with one narrow lookup, inspect the returned source and checked time, and treat a clear or passing result as scoped evidence rather than a universal compliance conclusion. The tool output is current for the source it checked, not a promise that every related record is covered.</p>

      <footer className="guide__sources"><span className="eyebrow">Sources fetched 2026-09-29</span><a href={specUrl}>Model Context Protocol specification: Tools</a><a href="https://github.com/kyisaiah47/compound-mcp/blob/main/README.md">Compound MCP README</a></footer>
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
              <a href="https://github.com/kyisaiah47/compound-mcp" target="_blank" rel="noreferrer">Read the source ↗</a>
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
