import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Check an MCP Tool Before You Call It",
  description: "A practical MCP tool checklist: inspect the schema, confirm the boundary, and verify the result before relying on an agent answer.",
  alternates: { canonical: "/guides/how-to-check-mcp-tool-safely" },
};

const specUrl = "https://modelcontextprotocol.io/specification/2025-06-18/server/tools";
const readmeUrl = "https://github.com/kyisaiah47/compound-mcp/blob/main/README.md";

export default function CheckMcpToolSafely() {
  return (
    <main className="guide">
      <Link className="guide__back" href="/">← Compound Labs MCP</Link>
      <p className="eyebrow">Guide · updated 2026-09-30</p>
      <h1>How to check an MCP tool before you call it</h1>
      <p className="guide__lead">Check an MCP tool in three passes: inspect its declared schema, confirm the operation matches the requested boundary, and validate the returned evidence. The Model Context Protocol defines discovery with <code>tools/list</code> and invocation with <code>tools/call</code>; the protocol does not make an untrusted annotation a security guarantee.</p>

      <h2>What should you inspect in an MCP tool definition?</h2>
      <p>Read the tool name, description, input schema, output schema, and annotations before invocation. The MCP tools specification says a tool definition includes those fields and that clients must treat annotations as untrusted unless the server is trusted. A description that says “read-only” is useful context, but it is not permission control.</p>

      <h2>How do you confirm that an MCP tool is read-only?</h2>
      <p>Confirm that the requested action is a lookup and that the server exposes no create, update, or delete operation for the task. Compound Labs MCP presents eleven lookup tools, marks them read-only in its captured surface, and requires no API key or signup according to the project README. The practical boundary is still narrower than a compliance conclusion: each result covers the public source that the lookup checked.</p>
      <ol>
        <li>Match the user question to one named lookup and its required arguments.</li>
        <li>Reject arguments that would turn a lookup into an unrequested mutation or disclosure.</li>
        <li>Show the call and ask for confirmation when the operation is sensitive.</li>
        <li>Read the returned source, checked time, coverage, and error state before citing it.</li>
      </ol>

      <h2>How should an MCP client handle a tool result?</h2>
      <p>An MCP result can contain text in <code>content</code> and structured data in <code>structuredContent</code>. The specification recommends validating structured results, checking errors, and using timeouts. Compound Labs MCP returns an answer-sized result with a checked receipt so an agent can distinguish a current lookup from an unsupported generalization.</p>

      <h2>What is the safest first call with Compound Labs MCP?</h2>
      <p>Start with one narrow question, install the server with <code>npx -y compound-mcp</code>, and inspect the returned receipt before asking a follow-up. A clear result is evidence about the indexed source and its stated coverage; it is not proof that every related record is complete or current.</p>

      <footer className="guide__sources"><span className="eyebrow">Sources fetched 2026-09-30</span><a href={specUrl}>Model Context Protocol specification: Tools</a><a href={readmeUrl}>Compound MCP README</a></footer>
    </main>
  );
}
