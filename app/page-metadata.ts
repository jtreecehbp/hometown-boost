import type { Metadata } from "next";

type PageMetadataInput = {
  title: string;
  description: string;
  path: `/${string}`;
  robots?: Metadata["robots"];
};

export function createPageMetadata({
  title,
  description,
  path,
  robots,
}: PageMetadataInput): Metadata {
  const socialTitle = `${title} | Hometown Boost`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Hometown Boost",
      title: socialTitle,
      description,
      url: path,
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
      title: socialTitle,
      description,
      images: ["/og.png"],
    },
    robots,
  };
}
