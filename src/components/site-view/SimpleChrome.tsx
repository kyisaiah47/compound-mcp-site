'use client';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PRODUCT } from '@/lib/product';
import Mark from './Mark';
import ViewControls from './ViewControls';

export function SimpleHeader() {
  return (
    <header className="sv-nav">
      <Link className="sv-brand" href="/" aria-label={`${PRODUCT.displayName} home`}>
        <span className="sv-mark">
          <Mark />
        </span>
        {PRODUCT.displayName}
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#start">Install</Link>
        <Link href="/#example">Tools</Link>
        <Link href="/guides/what-is-a-read-only-mcp-server">Guide</Link>
        <a href={PRODUCT.repo} target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}

export function SimpleFooter() {
  return (
    <footer className="sv-footer">
      <div>
        <Link href="/">{PRODUCT.displayName}</Link>
        <nav aria-label="Footer">
          <Link href="/guides/what-is-a-read-only-mcp-server">What is a read-only MCP server</Link>
          <Link href="/guides/how-to-check-mcp-tool-safely">How to check an MCP tool</Link>
          <a href={PRODUCT.npm} target="_blank" rel="noreferrer">
            npm ↗
          </a>
          <a href="mailto:hello@thecompound.tech">Contact ↗</a>
        </nav>
        <p className="sv-credit">
          Built by
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="studio-credit-mark" src="/brand/compound-labs.svg" alt="Compound Labs" width={20} height={20} />
          Compound Labs
        </p>
      </div>
      <ViewControls />
    </footer>
  );
}

export function SimpleFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <SimpleHeader />
      <main className="sv-main">{children}</main>
      <SimpleFooter />
    </>
  );
}
