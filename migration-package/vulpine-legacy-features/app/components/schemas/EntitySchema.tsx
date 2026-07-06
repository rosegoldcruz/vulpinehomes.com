// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\schemas\EntitySchema.tsx
export default function EntitySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://vulpinehomes.com/#entity",
    "name": "Vulpine Homes",
    "alternateName": "Vulpine LLC",
    "url": "https://vulpinehomes.com",
    "logo": "https://vulpinehomes.com/logos/vulpines-official-logo.png",
    "image": "https://vulpinehomes.com/marketing/Storm-Shaker_Kitchen.jpg",
    "description": "Cabinet door installation and cabinet refinishing service in Phoenix, AZ. Our team installs replacement cabinet doors, drawer fronts, and refinishes cabinet boxes. All measuring, preparation, and installation work is performed by our team.",
    "telephone": "+1-480-364-8205",
    "additionalType": [
      "https://schema.org/HomeImprovementBusiness",
      "https://schema.org/ProfessionalService"
    ],
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Phoenix Metro Area",
      "addressLocality": "Phoenix",
      "addressRegion": "AZ",
      "postalCode": "85001",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "33.4484",
      "longitude": "-112.0740"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Phoenix",
        "containedIn": {
          "@type": "State",
          "name": "Arizona"
        }
      },
      {
        "@type": "City",
        "name": "Scottsdale"
      },
      {
        "@type": "City",
        "name": "Tempe"
      },
      {
        "@type": "City",
        "name": "Mesa"
      },
      {
        "@type": "City",
        "name": "Glendale"
      },
      {
        "@type": "City",
        "name": "Chandler"
      },
      {
        "@type": "City",
        "name": "Gilbert"
      }
    ],
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "08:00",
      "closes": "18:00"
    }],
    "sameAs": [
      "https://www.facebook.com/vulpinehomes",
      "https://www.instagram.com/vulpinehomes"
    ],
    "serviceType": [
      "Cabinet Door Installation",
      "Cabinet Refinishing",
      "Drawer Front Installation",
      "Cabinet Hardware Installation"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cabinet Installation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cabinet Door Installation",
            "description": "Professional installation of replacement cabinet doors and drawer fronts"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cabinet Refinishing",
            "description": "Refinishing of existing cabinet boxes to match new doors"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Hardware Installation",
            "description": "Installation of cabinet hardware including pulls, knobs, and soft-close mechanisms"
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
