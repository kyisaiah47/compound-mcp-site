import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";
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
        <SmoothScroll />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
