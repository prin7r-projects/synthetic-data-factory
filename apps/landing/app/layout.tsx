import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foundry/7 — synthetic dataset factory · schema in, dataset out",
  description:
    "Declare your schema, constraints, and bias profile. Receive a labeled synthetic dataset with provenance, audit log, and reproducibility manifest. Built for ML engineers, eval leads, applied scientists.",
  metadataBase: new URL("https://synthetic-data-factory.prin7r.com"),
  openGraph: {
    title: "Foundry/7 — synthetic dataset factory",
    description:
      "Schema in, labeled dataset out. Auditable, reproducible synthetic data for training and evaluation.",
    url: "https://synthetic-data-factory.prin7r.com",
    siteName: "Foundry/7",
    type: "website"
  },
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#hero" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
