import type { Metadata } from "next";
import Link from "next/link";
import PageViews from "@/components/site-view/PageViews";
import ViewControls from "@/components/site-view/ViewControls";
import { SimpleFrame } from "@/components/site-view/SimpleChrome";

export const metadata: Metadata = {
  title: "How to Check an MCP Tool Before You Call It",
  description: "A practical MCP tool checklist: inspect the schema, confirm the boundary, and verify the result before relying on an agent answer.",
  alternates: { canonical: "/guides/how-to-check-mcp-tool-safely" },
};

const specUrl = "https://modelcontextprotocol.io/specification/2025-06-18/server/tools";
const readmeUrl = "https://github.com/kyisaiah47/openlookup/blob/main/README.md";

export default function CheckMcpToolSafely() {
  const body = (
    <>
      <Link className="guide__back" href="/">← OpenLookup</Link>
      <p className="eyebrow">Guide · updated 2026-09-30</p>
      <h1>How to check an MCP tool before you call it</h1>
      <p className="guide__lead">Check an MCP tool in three passes: inspect its declared schema, confirm the operation matches the requested boundary, and validate the returned evidence. The Model Context Protocol defines discovery with <code>tools/list</code> and invocation with <code>tools/call</code>; the protocol does not make an untrusted annotation a security guarantee.</p>

      <h2>What should you inspect in an MCP tool definition?</h2>
      <p>Read the tool name, description, input schema, output schema, and annotations before invocation. The MCP tools specification says a tool definition includes those fields and that clients must treat annotations as untrusted unless the server is trusted. A description that says “read-only” is useful context, but it is not permission control.</p>

      <h2>How do you confirm that an MCP tool is read-only?</h2>
      <p>Confirm that the requested action is a lookup. Confirm that the server exposes no create, update, or delete operation for the task. OpenLookup exposes eleven lookup tools. Its captured surface marks the tools read-only. The project README states that OpenLookup requires no API key or signup. Each result covers the public source that the lookup checked, so it does not by itself establish a compliance conclusion.</p>
      <ol>
        <li>Match the user question to one named lookup and its required arguments.</li>
        <li>Reject arguments that would turn a lookup into an unrequested mutation or disclosure.</li>
        <li>Show the call and ask for confirmation when the operation is sensitive.</li>
        <li>Read the returned source, checked time, coverage, and error state before citing it.</li>
      </ol>

      <h2>How should an MCP client handle a tool result?</h2>
      <p>An MCP result can contain text in <code>content</code> and structured data in <code>structuredContent</code>. The specification recommends validating structured results, checking errors, and using timeouts. OpenLookup returns an answer-sized result with a checked receipt. The receipt lets an agent distinguish a current lookup from an unsupported generalization.</p>

      <h2>The safest first call with OpenLookup</h2>
      <p>You start with one narrow question. You install the server with <code>npx -y openlookup</code>. You inspect the returned receipt before asking a follow-up. A clear result provides evidence about the indexed source and its stated coverage. It does not prove that every related record is complete or current.</p>

      <footer className="guide__sources"><span className="eyebrow">Sources fetched 2026-09-30</span><a href={specUrl}>Model Context Protocol specification: Tools</a><a href={readmeUrl}>OpenLookup README</a></footer>
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
