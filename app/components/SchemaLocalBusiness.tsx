export function SchemaLocalBusiness() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["LocalBusiness", "ProfessionalService"],
          "name": "Vulpine Homes",
          "url": "https://vulpinehomes.com",
          "telephone": "+1-480-364-8205",
          "areaServed": {
            "@type": "State",
            "name": "Arizona"
          },
          "description": "Vulpine Homes provides kitchen design, project coordination, and homeowner oversight. Installations are completed by the experienced team at Freedom Kitchen & Bath.",
          "knowsAbout": [
            "Kitchen Design",
            "Project Coordination",
            "Cabinet Refacing",
            "Home Improvement Consulting"
          ],
          "makesOffer": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Kitchen Design & Coordination",
                "description": "Design, coordination, and oversight for kitchen transformations"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cabinet Refacing",
                "description": "Cabinet door and drawer front replacement with professional installation"
              }
            }
          ]
        })
      }}
    />
  );
}
