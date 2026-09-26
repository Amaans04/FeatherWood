import { Helmet } from "react-helmet";

const SITE_URL = "https://www.featherwood.in";
const OG_IMAGE_URL = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

function resolveCanonical(canonical?: string): string {
  if (canonical) {
    return canonical.startsWith("http") ? canonical : `${SITE_URL}${canonical.startsWith("/") ? canonical : `/${canonical}`}`;
  }
  if (typeof window !== "undefined") {
    return `${SITE_URL}${window.location.pathname}`;
  }
  return SITE_URL;
}

function resolveOgImage(ogImage?: string): string {
  if (!ogImage) return OG_IMAGE_URL;
  return ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  noIndex = false,
  structuredData,
}: SEOProps) {
  const canonicalUrl = resolveCanonical(canonical);
  const ogImageUrl = resolveOgImage(ogImage);
  const fullTitle = `${title} | FeatherWood`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="FeatherWood Design" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:secure_url" content={ogImageUrl} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="FeatherWood Design — Luxury Interior Design & Furniture" />
      <meta property="og:url" content={canonicalUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@featherwoodin" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content="FeatherWood Design — Luxury Interior Design & Furniture" />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData) ? { "@context": "https://schema.org", "@graph": structuredData } : structuredData
          )}
        </script>
      )}
    </Helmet>
  );
}
