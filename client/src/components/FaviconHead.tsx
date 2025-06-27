import { Helmet } from "react-helmet";

interface FaviconHeadProps {
  title?: string;
  description?: string;
}

export default function FaviconHead({ 
  title = "FeatherWood | Affordable Luxury Interiors",
  description = "Luxury interior design solutions for discerning clients who appreciate exceptional craftsmanship and timeless elegance."
}: FaviconHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/cmp_logo.jpg" />
      
      {/* Open Graph / Social Media */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content="/cmp_logo.jpg" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#FFD700" />
    </Helmet>
  );
} 