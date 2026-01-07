interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  url: string;
  areaServed?: string;
  priceRange?: string;
}

export default function ServiceSchema({ 
  serviceName, 
  description, 
  url,
  areaServed = "Phoenix AZ",
  priceRange = "500-15000"
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    "serviceType": serviceName,
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://vulpinehomes.com/#entity",
      "name": "Vulpine Homes"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": areaServed
    },
    "offers": {
      "@type": "Offer",
      "priceSpecification": {
        "@type": "PriceSpecification",
        "priceCurrency": "USD",
        "price": priceRange
      },
      "availability": "https://schema.org/InStock"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": `${serviceName} Services`,
      "itemListElement": [{
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": serviceName
        }
      }]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
