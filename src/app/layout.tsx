import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShohojSheba",
  description: "Explainable healthcare staffing, with people in control.",
  metadataBase: new URL("https://joggo-ai-bd.najdhotel1.chatgpt.site"),
  openGraph: {
    title: "ShohojSheba",
    description: "Verified professionals. Explainable matching. Human decisions.",
    images: [{ url: "/og.png", width: 1672, height: 941, alt: "ShohojSheba healthcare staffing platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShohojSheba",
    description: "Verified professionals. Explainable matching. Human decisions.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
