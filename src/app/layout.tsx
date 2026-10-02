import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
import "@/components/site-view/simple.css";
import SiteViewProvider from "@/components/site-view/SiteViewProvider";
import Welcome from "@/components/site-view/Welcome";
import Mark from "@/components/site-view/Mark";
import Analytics from "@/components/Analytics";
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});
export const metadata: Metadata = {
  title: "Compound Labs MCP",
  description: "Eleven read-only lookup tools backed by live public data.",
  metadataBase: new URL("https://compound-mcp.thecompound.tech"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "Compound Labs MCP",
    description: "Eleven read-only lookup tools backed by live public data.",
    url: "https://compound-mcp.thecompound.tech/",
    siteName: "Compound Labs MCP",
    type: "website",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: { card: "summary_large_image", images: ["/opengraph-image"] },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Compound Labs MCP",
    url: "https://compound-mcp.thecompound.tech",
    publisher: {
      "@type": "Organization",
      "@id": "https://thecompound.tech/#organization",
      name: "Compound Labs",
      url: "https://thecompound.tech",
    },
  };
  return (
    <html lang="en" className={mono.variable}>
      <body>
        <Analytics />
        <SmoothScroll />
        <SiteViewProvider
          slug="compound-mcp"
          welcome={
            <Welcome
              copy={{
                name: "Compound Labs MCP",
                mark: <Mark />,
                eyebrow: "YOUR AGENT. CURRENT FACTS.",
                question: "Does your agent answer from facts that have changed?",
                explain:
                  "This MCP server gives an agent read-only lookup tools backed by live public data. It answers from the source instead of from its training data.",
                illustration: {
                  head: "ONE QUESTION. ONE LOOKUP.",
                  before: "You ask your agent whether a nonprofit is in good standing.",
                  answer: "It calls a lookup tool and answers from the IRS list, with the date it checked.",
                  tag: "READ ONLY. NO KEY.",
                  after: "A clear result covers only the lists it checked.",
                },
              }}
            />
          }
        >
          {children}
        </SiteViewProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
