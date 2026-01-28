// File: C:\Users\cruz\OneDrive - Aeon Investments Technologies LLC\production websites\vulpinehomes.com\app\components\NAPComponent.tsx
export default function NAPComponent() {
  const businessInfo = {
    name: "Vulpine Homes",
    phone: "480-364-8205",
    email: "info@vulpinehomes.com",
    website: "https://vulpinehomes.com",
    serviceAreas: ["Phoenix", "Scottsdale", "Mesa", "Gilbert", "Chandler", "Tempe", "Peoria", "Glendale"]
  }

  return (
    <div className="nap-info" itemScope itemType="https://schema.org/LocalBusiness">
      <meta itemProp="name" content={businessInfo.name} />
      <meta itemProp="telephone" content={businessInfo.phone} />
      <meta itemProp="email" content={businessInfo.email} />
      <meta itemProp="url" content={businessInfo.website} />
      
      {/* Service area instead of address */}
      <div itemScope itemType="https://schema.org/GeoCircle" itemProp="areaServed">
        <meta itemProp="geoMidpoint" content="33.4484,-112.0740" />
        <meta itemProp="geoRadius" content="50" />
      </div>
      
      {/* Visible NAP for users */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">{businessInfo.name}</h3>
        <div className="text-white/70">
          Serving Greater Phoenix Area
        </div>
        <div className="text-white/60 text-sm">
          {businessInfo.serviceAreas.join(", ")}
        </div>
        <div className="flex flex-col items-center space-y-1">
          <a href={`tel:${businessInfo.phone}`} className="text-[#FF8A3D] hover:text-[#FF6B35] transition-colors">
            {businessInfo.phone}
          </a>
          <a href={`mailto:${businessInfo.email}`} className="text-white/70 hover:text-white transition-colors text-sm">
            {businessInfo.email}
          </a>
        </div>
      </div>
    </div>
  )
}
