// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\SocialMetaTags.tsx
export default function SocialMetaTags() {
  return (
    <>
      {/* Facebook Business Page Verification */}
      <meta name="facebook-domain-verification" content="YOUR_VERIFICATION_CODE" />
      
      {/* Additional Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Vulpine Homes" />
      <meta property="og:locale" content="en_US" />
      
      {/* Service Area Business Info */}
      <meta property="business:contact_data:locality" content="Phoenix" />
      <meta property="business:contact_data:region" content="AZ" />
      <meta property="business:contact_data:country_name" content="USA" />
      <meta property="business:contact_data:phone_number" content="480-364-8205" />
      <meta property="business:contact_data:website" content="https://vulpinehomes.com" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vulpine_homes" />
      <meta name="twitter:creator" content="@vulpine_homes" />
      
      {/* Additional Business Info */}
      <meta name="author" content="Vulpine Homes" />
      <meta name="publisher" content="Vulpine Homes" />
      
      {/* Schema.org for Service Area Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "Vulpine Homes",
            "url": "https://vulpinehomes.com",
            "logo": "https://vulpinehomes.com/logos/vulpines-official-logo.png",
            "description": "Cabinet Refacing & Kitchen Design Service serving Greater Phoenix Area",
            "telephone": "+1-480-364-8205",
            "email": "info@vulpinehomes.com",
            "areaServed": [
              "Phoenix, AZ",
              "Scottsdale, AZ", 
              "Mesa, AZ",
              "Gilbert, AZ",
              "Chandler, AZ",
              "Tempe, AZ",
              "Peoria, AZ",
              "Glendale, AZ"
            ],
            "serviceType": "Cabinet Refacing, Door Replacement, Cabinet Refinishing",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-480-364-8205",
              "contactType": "customer service",
              "availableLanguage": "English",
              "hoursAvailable": "Mo-Fr 08:00-18:00"
            },
            "sameAs": [
              "https://www.facebook.com/YOUR_FACEBOOK_PAGE",
              "https://www.instagram.com/vulpine_homes",
              "https://www.linkedin.com/company/vulpine-homes"
            ]
          })
        }}
      />
    </>
  )
}
