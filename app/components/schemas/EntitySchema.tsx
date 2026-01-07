export default function EntitySchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
    "@id": "https://vulpinehomes.com/#entity",
    "name": "Vulpine Homes",
    "alternateName": "Vulpine LLC",
    "url": "https://vulpinehomes.com",
    "logo": "https://vulpinehomes.com/logos/vulpines-official-logo.png",
    "image": "https://vulpinehomes.com/marketing/Storm-Shaker_Kitchen.jpg",
    "description": "Vulpine Homes provides kitchen design, project coordination, and homeowner oversight. Installations are completed by the experienced team at Freedom Kitchen & Bath. Homeowners work directly with dedicated Project Advisors from start to finish.",
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
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Cabinet Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cabinet Refacing",
            "description": "Professional cabinet refacing with custom doors and finishes"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Cabinet Doors",
            "description": "Made-to-order cabinet doors in various styles and colors"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Cabinet Hardware Installation",
            "description": "Premium hardware selection and professional installation"
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
