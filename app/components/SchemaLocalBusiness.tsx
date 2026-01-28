// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\SchemaLocalBusiness.tsx
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
          "description": "Vulpine Homes provides cabinet refacing, door replacement, and in-house installation across Greater Phoenix.",
          "knowsAbout": [
            "Cabinet Refacing",
            "Door Replacement",
            "Cabinet Refinishing",
            "Home Improvement"
          ],
          "makesOffer": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cabinet Refacing",
                "description": "Cabinet door and drawer front replacement with professional installation"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cabinet Refinishing",
                "description": "Cabinet box refinishing and color updates"
              }
            }
          ]
        })
      }}
    />
  );
}
