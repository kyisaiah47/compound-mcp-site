import Link from "next/link";
import PageViews from "@/components/site-view/PageViews";
import ViewControls from "@/components/site-view/ViewControls";
import SimplePage from "@/components/site-view/SimplePage";
import { SimpleFrame } from "@/components/site-view/SimpleChrome";
import { PRODUCT } from "@/lib/product";

/* A missing page, in whichever view the visitor reads. Both views offer the way back. */
export default function NotFound() {
  const links = (
    <nav className="sv-home-links" aria-label="Next steps">
      <Link href="/">Back to the tools ↗</Link>
      <Link href="/guides/what-is-a-read-only-mcp-server">Read the guide ↗</Link>
      <a href={PRODUCT.repo} target="_blank" rel="noreferrer">Read the source ↗</a>
    </nav>
  );
  return (
    <PageViews
      simpleView={
        <SimpleFrame>
          <SimplePage eyebrow="OPENLOOKUP" title="This page does not exist" intro={<p>The address may be old, or it may have a typo.</p>}>
            {links}
          </SimplePage>
        </SimpleFrame>
      }
      consoleView={
        <>
          <main className="guide">
            <Link className="guide__back" href="/">OpenLookup</Link>
            <h1>This page does not exist.</h1>
            <p className="guide__lead">The address may be old, or it may have a typo.</p>
            {links}
          </main>
          <div className="foot-view">
            <ViewControls />
          </div>
        </>
      }
    />
  );
}
