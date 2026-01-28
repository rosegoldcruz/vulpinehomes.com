// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\GoogleBusinessLink.tsx
export default function GoogleBusinessLink() {
  return (
    <>
      {/* Google Business Profile verification and linking */}
      <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
      
      {/* Google Business Profile structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "@id": "https://vulpinehomes.com",
            "name": "Vulpine Homes",
            "url": "https://vulpinehomes.com",
            "logo": "https://vulpinehomes.com/logos/vulpines-official-logo.png",
            "description": "Cabinet refacing and door replacement serving Greater Phoenix Area. Save 50% vs full remodel.",
            "telephone": "+1-480-364-8205",
            "email": "info@vulpinehomes.com",
            "areaServed": {
              "@type": "GeoCircle",
              "geoMidpoint": {
                "@type": "GeoCoordinates",
                "latitude": "33.4484",
                "longitude": "-112.0740",
                "address": "Phoenix, AZ"
              },
              "geoRadius": "50"
            },
            "serviceArea": [
              "Phoenix, AZ",
              "Scottsdale, AZ", 
              "Mesa, AZ",
              "Gilbert, AZ",
              "Chandler, AZ",
              "Tempe, AZ",
              "Peoria, AZ",
              "Glendale, AZ"
            ],
            "serviceType": [
              "Cabinet Refacing",
              "Door Replacement",
              "Cabinet Refinishing"
            ],
            "priceRange": "$$",
            "paymentAccepted": "Cash, Credit Card, Check",
            "languagesSpoken": "English",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-480-364-8205",
              "contactType": "customer service",
              "availableLanguage": "English",
              "hoursAvailable": [
                "Mo-Fr 08:00-18:00",
                "Sa 09:00-15:00"
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5.0",
              "reviewCount": "39",
              "bestRating": "5",
              "worstRating": "1"
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Arizona Homeowner"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5"
                },
                "reviewBody": "Excellent service and craftsmanship. Made our kitchen refacing stress-free."
              }
            ],
            "sameAs": [
              "https://www.facebook.com/YOUR_FACEBOOK_PAGE",
              "https://www.instagram.com/vulpine_homes",
              "https://www.linkedin.com/company/vulpine-homes",
              "https://g.page/YOUR_GOOGLE_BUSINESS_PAGE"
            ]
          })
        }}
      />
    </>
  )
}
