import { Helmet } from "react-helmet-async"

export default function SEO({
  title = "propnews24 - India News Portal",
  description = "Stay informed with real-time India news across 10 categories - politics, business, sports, tech and more.",
  keywords = "India news, breaking news, latest news, politics, business, sports, technology",
  image = "/logo.svg",
  url = "https://propnews.ddns.net",
  type = "website",
  author = "propnews24",
  publishedTime,
  modifiedTime,
  section,
  tags = [],
}) {
  const fullTitle = title.includes("propnews24") ? title : `${title} | propnews24`
  const fullUrl = url.startsWith("http") ? url : `https://propnews.ddns.net${url}`
  const fullImage = image.startsWith("http") ? image : `https://propnews.ddns.net${image}`

  // Build schema separately — never inline JSON.stringify inside JSX/Helmet
  const schema = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "NewsArticle" : "WebSite",
    name: fullTitle,
    description,
    url: fullUrl,
    image: fullImage,
    publisher: {
      "@type": "Organization",
      name: "propnews24",
      logo: { "@type": "ImageObject", url: "https://propnews.ddns.net/logo.svg" },
    },
    ...(publishedTime && { datePublished: publishedTime }),
    ...(modifiedTime && { dateModified: modifiedTime }),
    ...(author && { author: { "@type": "Person", name: author } }),
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="propnews24" />
      <meta property="og:locale" content="en_IN" />

      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      {tags.map((tag, i) => <meta key={i} property="article:tag" content={tag} />)}

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="propnews24" />

      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
