import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  noIndex?: boolean;
}

export function SEO({
  title,
  description,
  keywords,
  ogImage,
  ogUrl,
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  noIndex = false,
}: SEOProps) {
  const siteTitle = "Sulton UzDev | Android Developer";
  const finalTitle = `${title} | ${siteTitle}`;
  const defaultDescription = "Professional Android developer creating innovative mobile applications.";
  
  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={articlePublishedTime ? "article" : "website"} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Article specific */}
      {articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      
      {/* No index if specified */}
      {noIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}
    </Helmet>
  );
}