import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export function SEO({
  title = "Welsh Rugby Club | Premier Rugby in Wales",
  description = "Join Welsh Rugby Club - over 127 years of rugby excellence. Professional coaching, youth development, and a proud community. Book tickets for upcoming fixtures.",
  keywords = "Welsh rugby, rugby club Wales, Cardiff rugby, rugby training, youth rugby Wales, Welsh Premier Division, rugby fixtures",
  ogImage = "/og-image.jpg"
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords },
      { name: "author", content: "Welsh Rugby Club" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "theme-color", content: "#dc2626" },

      { property: "og:type", content: "website" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: ogImage },
      { property: "og:site_name", content: "Welsh Rugby Club" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },

      { name: "robots", content: "index, follow" },
      { name: "googlebot", content: "index, follow" },
      { name: "language", content: "English" },
      { name: "revisit-after", content: "7 days" }
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement("meta");
        if (name) element.setAttribute("name", name);
        if (property) element.setAttribute("property", property);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    });

    const linkTags = [
      { rel: "canonical", href: window.location.href }
    ];

    linkTags.forEach(({ rel, href }) => {
      let element = document.querySelector(`link[rel="${rel}"]`);

      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }

      element.setAttribute("href", href);
    });

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "SportsOrganization",
      "name": "Welsh Rugby Club",
      "sport": "Rugby Union",
      "url": window.location.origin,
      "logo": `${window.location.origin}/logo.png`,
      "foundingDate": "1899",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Rugby Road",
        "addressLocality": "Cardiff",
        "addressRegion": "Wales",
        "postalCode": "CF10 1AA",
        "addressCountry": "GB"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+44-29-2087-4000",
        "contactType": "customer service",
        "email": "info@welshrugby.com"
      },
      "sameAs": [
        "https://facebook.com/welshrugby",
        "https://twitter.com/welshrugby",
        "https://instagram.com/welshrugby",
        "https://youtube.com/welshrugby"
      ]
    };

    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (!scriptElement) {
      scriptElement = document.createElement("script");
      scriptElement.setAttribute("type", "application/ld+json");
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, ogImage]);

  return null;
}
