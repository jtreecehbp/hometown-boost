import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSiteUrl } from "./site-url";

const title = "Hometown Boost | Local Marketing That Drives Growth";
const description =
  "Practical websites, local SEO, Google visibility, review growth, lead tracking, and ongoing marketing support for hometown businesses.";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  const metadataBase = new URL(siteUrl);

  return {
    metadataBase,
    title: {
      default: title,
      template: "%s | Hometown Boost",
    },
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Hometown Boost",
      title,
      description,
      url: "/",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: "Hometown Boost — local marketing built for hometown growth",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf2",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = await getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Hometown Boost",
        url: siteUrl,
        logo: `${siteUrl}/favicon.svg`,
        description,
        slogan: "Get found. Get chosen. Grow your hometown business.",
        knowsAbout: [
          "Website design",
          "Local SEO",
          "Google Business Profile management",
          "Reputation management",
          "Call and lead tracking",
          "Paid advertising",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Hometown Boost",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
