import type { Metadata } from "next";
import "./globals.css";
import { LOCALES } from "./lib/constants";
import { Providers } from "./lib/providers/Providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://futures.themanufactory.xyz/"),
  title: "FGO Futures",
  description: "Fractional Garment Ownership Futures.",
  twitter: {
    card: "summary_large_image",
    creator: "@emmajane1313",
    title: "FGO Futures",
    description: "Fractional Garment Ownership Futures.",
  },
  openGraph: {
    title: "FGO Futures",
    description: "Fractional Garment Ownership Futures.",
  },
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: `https://futures.themanufactory.xyz/`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://futures.themanufactory.xyz/${item}/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
  keywords: [
    "Web3",
    "Web3 Fashion",
    "Moda Web3",
    "Open Source",
    "CC0",
    "Emma-Jane MacKinnon-Lee",
    "Emma-Jane Mac Fhionghuin-Vere",
    "Open Source LLMs",
    "DIGITALAX",
    "F3Manifesto",
    "digitalax",
    "f3manifesto",
    "Women",
    "Life",
    "Freedom",
  ],
  pinterest: {
    richPin: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DIGITALAX",
              url: "https://digitalax.xyz/",
              founder: {
                "@type": "Person",
                "@id": "https://emmajanemackinnonlee.com/#person",
                name: "Emma-Jane MacKinnon-Lee",
                url: "https://emmajanemackinnonlee.com/",
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": "https://emmajanemackinnonlee.com/",
                },
                sameAs: [
                  "https://emmajanemackinnonlee.com/",
                  "https://emmajanemackinnon.com/",
                  "https://emmajane.ai/",
                  "https://janefuture.com/",
                  "https://emmajanemackinnonlee.xyz/",
                  "https://emmajanemackinnonlee.net/",
                  "https://emmajanemackinnonlee.ai/",
                  "https://emmajanemackinnonlee.org/",
                  "https://emmajanemackinnonlee-f3manifesto.com/",
                  "https://emmajanemackinnonlee-digitalax.com/",
                  "https://emmajanemackinnonlee-history.com/",
                  "https://emmajanemackinnonlee-runway.com/",
                  "https://icoinedweb3fashion.com/",
                  "https://syntheticfutures.xyz/",
                  "https://web3fashion.xyz/",
                  "https://emancipa.xyz/",
                  "https://highlangu.com/",
                  "https://digitalax.xyz/",
                  "https://cc0web3fashion.com/",
                  "https://cc0web3.com/",
                  "https://cuntism.net/",
                  "https://dhawu.com/",
                  "https://casadeespejos.com/",
                  "https://emancipa.net/",
                  "https://dhawu.emancipa.xyz/",
                  "https://highlangu.emancipa.xyz/",
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
