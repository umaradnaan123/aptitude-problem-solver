import { useEffect } from 'react';

export interface SEOMetaProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  schema?: Record<string, any> | Record<string, any>[];
}

export default function SEOMeta({
  title,
  description,
  canonicalUrl = "https://aptitude-problem-solver.vercel.app/",
  ogType = "website",
  schema
}: SEOMetaProps) {
  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update OpenGraph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    // Update OpenGraph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // Update OpenGraph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', canonicalUrl);

    // Update OpenGraph Type
    let ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (!ogTypeMeta) {
      ogTypeMeta = document.createElement('meta');
      ogTypeMeta.setAttribute('property', 'og:type');
      document.head.appendChild(ogTypeMeta);
    }
    ogTypeMeta.setAttribute('content', ogType);

    // Update Twitter Title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title);

    // Update Twitter Description
    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', description);

    // Update Twitter Card
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    // Update JSON-LD Schema
    let scriptTag = document.getElementById('jsonld-seo') as HTMLScriptElement;
    if (scriptTag) {
      scriptTag.textContent = JSON.stringify(schema || {});
    } else {
      scriptTag = document.createElement('script');
      scriptTag.id = 'jsonld-seo';
      scriptTag.type = 'application/ld+json';
      scriptTag.textContent = JSON.stringify(schema || {});
      document.head.appendChild(scriptTag);
    }

    return () => {
      // Clean up schema on unmount to avoid stale schema on route changes
      const currentScript = document.getElementById('jsonld-seo');
      if (currentScript) {
        currentScript.textContent = '{}';
      }
    };
  }, [title, description, canonicalUrl, ogType, schema]);

  return null;
}
